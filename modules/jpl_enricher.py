# modules/jpl_enricher.py

import requests
import pandas as pd
import numpy as np  # Importamos numpy para usar np.nan
import time
from tqdm import tqdm

# Definimos los campos que esperamos recibir de la API
EXPECTED_FIELDS = ['a', 'e', 'i', 'om', 'w', 'ma', 'moid']

def get_jpl_orbital_data(spk_id):
    """
    Obtiene datos orbitales detallados para un solo asteroide desde la API de JPL SBDB.
    """
    url = "https://ssd-api.jpl.nasa.gov/sbdb.api"
    # Unimos los campos esperados en un string para la petición
    fields_str = ','.join(EXPECTED_FIELDS)
    params = {'spk': spk_id, 'fields': fields_str}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Verificamos si la respuesta contiene datos válidos
        if 'data' in data and len(data['data']) > 0:
            orbital_params = {field: float(data['data'][0][i]) if data['data'][0][i] is not None else np.nan for i, field in enumerate(data['fields'])}
            return orbital_params
        else:
            # La API respondió bien, pero no encontró datos para este objeto
            return None
        
    except (requests.exceptions.RequestException, KeyError, IndexError, ValueError):
        # Capturamos varios posibles errores
        return None

def enrich_with_jpl_data(df):
    """
    Recorre un DataFrame de asteroides y añade columnas con datos orbitales de JPL.
    Esta versión es más robusta y maneja fallos en las llamadas a la API.
    """
    orbital_data_list = []
    
    print("Enriqueciendo datos con la API de JPL SBDB...")
    for index, row in tqdm(df.iterrows(), total=df.shape[0]):
        spk_id = row['id']
        orbital_data = get_jpl_orbital_data(spk_id)
        
        # --- ESTA ES LA LÓGICA MEJORADA ---
        if orbital_data:
            orbital_data_list.append(orbital_data)
        else:
            # SI FALLA: en lugar de un dict vacío, creamos un dict con
            # todos los campos esperados y valor nulo (np.nan).
            # Esto GARANTIZA que las columnas siempre se crearán.
            null_data = {field: np.nan for field in EXPECTED_FIELDS}
            orbital_data_list.append(null_data)
            
        time.sleep(0.2)

    # Convertir la lista de diccionarios a un DataFrame
    df_orbital = pd.DataFrame(orbital_data_list)
    
    # Unir el DataFrame original con el nuevo DataFrame de datos orbitales
    df_enriched = pd.concat([df.reset_index(drop=True), df_orbital], axis=1)
    
    return df_enriched
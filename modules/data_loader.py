# modules/data_loader.py

import pandas as pd
import requests
import json
import os
from tqdm import tqdm
import urllib.parse # Necesitamos esta librería para construir la URL

def get_large_asteroid_catalog(api_key, max_per_class=500):
    """
    Obtiene un catálogo grande y variado de asteroides directamente de la API de JPL.
    Esta versión construye la URL manualmente para máxima compatibilidad.
    """
    cache_file = f'jpl_large_catalog_cache.json'
    if os.path.exists(cache_file):
        print(f"Cargando catálogo grande desde el caché '{cache_file}'...")
        return pd.read_json(cache_file)

    print("Construyendo catálogo grande de asteroides desde JPL (con URL manual)...")
    
    all_asteroids_df = []
    base_url = "https://ssd-api.jpl.nasa.gov/sbdb.api"

    fields_of_interest = [
        'fullname', 'h', 'diameter', 'albedo', 'rot_per', 'pha', 'neo', 
        'moid', 'a', 'e', 'i', 'om', 'w', 'ma', 'q', 'ad', 'per_y', 
        'data_arc'
    ]
    fields_str = ','.join(fields_of_interest)

    # --- CAMBIO CLAVE: Construiremos las URLs manualmente ---
    
    # Creamos un diccionario de parámetros base
    base_params = {
        'fields': fields_str,
        'limit': max_per_class,
        'api_key': api_key
    }

    # Creamos las URLs completas para cada consulta
    urls_to_query = {
        "ATE": f"{base_url}?{urllib.parse.urlencode({**base_params, 'class': 'ATE'})}",
        "APO": f"{base_url}?{urllib.parse.urlencode({**base_params, 'class': 'APO'})}",
        "AMO": f"{base_url}?{urllib.parse.urlencode({**base_params, 'class': 'AMO'})}",
        "IEO": f"{base_url}?{urllib.parse.urlencode({**base_params, 'class': 'IEO'})}",
        "PHA": f"{base_url}?{urllib.parse.urlencode({**base_params, 'pha': '1'})}"
    }

    for name, url in tqdm(queries.items(), desc="Consultando a JPL"):
        try:
            # Ahora pasamos la URL completa y 'params' como None
            response = requests.get(url, params=None)
            response.raise_for_status()
            data = response.json()
            if int(data.get('count', 0)) > 0:
                df = pd.DataFrame(data['data'], columns=data['fields'])
                all_asteroids_df.append(df)
        except requests.exceptions.RequestException as e:
            print(f"Error consultando {name}: {e}")

    if not all_asteroids_df:
        print("No se pudieron obtener datos.")
        return pd.DataFrame()

    final_df = pd.concat(all_asteroids_df, ignore_index=True)
    final_df.drop_duplicates(subset=['fullname'], keep='first', inplace=True)

    for col in final_df.columns:
        if col not in ['fullname', 'pha', 'neo']:
            final_df[col] = pd.to_numeric(final_df[col], errors='coerce')

    print(f"Catálogo final construido con {len(final_df)} asteroides únicos.")
    final_df.to_json(cache_file, orient='records')
    
    return final_df
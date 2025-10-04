# modules/data_loader.py
import pandas as pd
import os

def load_local_jpl_catalog(filename="jpl_catalog.csv"):
    """
    Carga el catálogo de asteroides desde un archivo CSV descargado localmente.
    """
    if not os.path.exists(filename):
        print(f"❌ ERROR: No se encontró el archivo '{filename}'.")
        print("   Por favor, descárgalo desde la web de JPL y guárdalo en esta carpeta.")
        return pd.DataFrame()

    print(f"📁 Cargando catálogo desde el archivo local: {filename}")
    try:
        # Leemos el CSV. JPL a veces usa espacios extra, así que 'skipinitialspace' ayuda.
        df = pd.read_csv(filename, skipinitialspace=True)
        print(f"✅ Se cargaron {len(df)} asteroides desde el archivo.")
        return df
    except Exception as e:
        print(f"❌ Error al leer el archivo CSV: {e}")
        return pd.DataFrame()

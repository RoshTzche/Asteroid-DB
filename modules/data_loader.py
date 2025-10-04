# modules/data_loader.py
import pandas as pd
import os

def load_local_jpl_catalog(filename="jpl_catalog.csv"):
    """
    Carga el catálogo de asteroides desde un archivo CSV local, buscando el archivo
    en la misma carpeta donde se encuentra el script principal.
    """
    # --- ESTA ES LA LÓGICA CLAVE ---
    # Obtenemos la ruta absoluta del directorio donde se está ejecutando el script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construimos la ruta completa hacia el archivo CSV, asumiendo que está en la carpeta raíz del proyecto
    # (un nivel arriba de la carpeta 'modules')
    project_root = os.path.dirname(script_dir)
    file_path = os.path.join(project_root, filename)

    print(f"Buscando el archivo en la ruta: {file_path}")

    if not os.path.exists(file_path):
        print(f"❌ ERROR: No se encontró el archivo en la ruta esperada.")
        print(f"   Asegúrate de que '{filename}' esté en la carpeta principal de tu proyecto: '{project_root}'")
        return pd.DataFrame()

    print(f"📁 Cargando catálogo desde el archivo local: {filename}")
    try:
        # Leemos el CSV
        df = pd.read_csv(file_path, skipinitialspace=True)
        print(f"✅ Se cargaron {len(df)} asteroides desde el archivo.")
        return df
    except Exception as e:
        print(f"❌ Error al leer el archivo CSV: {e}")
        return pd.DataFrame()
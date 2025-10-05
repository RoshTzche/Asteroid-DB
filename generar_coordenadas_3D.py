# generar_coordenadas_3d.py
import pandas as pd
import numpy as np
import json
import os

def generar_orbita_3d(a, e, i_deg, om_deg, w_deg):
    """
    Calcula los puntos (x, y, z) de una órbita en el espacio 3D a partir de sus elementos orbitales.
    """
    # 1. Convertir ángulos de grados a radianes
    i = np.radians(i_deg if pd.notna(i_deg) else 0)
    om = np.radians(om_deg if pd.notna(om_deg) else 0)
    w = np.radians(w_deg if pd.notna(w_deg) else 0)

    # 2. Generar puntos en el plano orbital 2D
    theta = np.linspace(0, 2 * np.pi, 360) # 360 puntos para una órbita suave
    r = a * (1 - e**2) / (1 + e * np.cos(theta))
    x_plano = r * np.cos(theta)
    y_plano = r * np.sin(theta)

    # 3. Rotar los puntos para llevarlos al espacio 3D
    # Se aplican las matrices de rotación de Euler
    xp = x_plano * (np.cos(w) * np.cos(om) - np.sin(w) * np.cos(i) * np.sin(om)) - \
         y_plano * (np.sin(w) * np.cos(om) + np.cos(w) * np.cos(i) * np.sin(om))
    
    yp = x_plano * (np.cos(w) * np.sin(om) + np.sin(w) * np.cos(i) * np.cos(om)) + \
         y_plano * (np.cos(w) * np.cos(i) * np.cos(om) - np.sin(w) * np.sin(om))
    
    zp = x_plano * (np.sin(w) * np.sin(i)) + y_plano * (np.cos(w) * np.sin(i))
    
    return np.stack((xp, yp, zp), axis=-1).tolist()

def procesar_y_guardar_orbitas_3d(archivo_csv="jpl_catalog.csv"):
    """
    Carga el catálogo, calcula las órbitas 3D y las guarda en un JSON.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, archivo_csv)

    print(f"Buscando el archivo en: {file_path}")
    if not os.path.exists(file_path):
        print(f"❌ ERROR: No se encontró el archivo '{archivo_csv}'.")
        return

    print("📁 Cargando catálogo...")
    df = pd.read_csv(file_path, skipinitialspace=True)
        
    df['identificador'] = df['full_name'].fillna(df['spkid'].astype(str))
    
    # Asegurarse de que tenemos todos los datos necesarios para 3D
    required_cols = ['a', 'e', 'i', 'om', 'w', 'identificador']
    df_orbitas = df.dropna(subset=required_cols).copy()
    print(f"Se procesarán {len(df_orbitas)} asteroides con datos orbitales 3D completos.")

    sistema_solar_3d = {}

    print("🌍 Calculando la órbita 3D de la Tierra...")
    # Parámetros orbitales aproximados para la Tierra
    orbita_tierra = generar_orbita_3d(a=1.0, e=0.0167, i_deg=0, om_deg=0, w_deg=102.9)
    sistema_solar_3d["Tierra"] = {"nombre": "Tierra", "coordenadas": orbita_tierra}

    print("☄️ Calculando órbitas 3D de asteroides (limitado a los primeros 100)...")
    for _, asteroide in df_orbitas.head(100).iterrows():
        identificador = asteroide['identificador']
        orbita = generar_orbita_3d(asteroide['a'], asteroide['e'], asteroide['i'], asteroide['om'], asteroide['w'])
        sistema_solar_3d[identificador] = {"nombre": identificador, "coordenadas": orbita}

    archivo_salida = "orbitas_3d.json"
    print(f"💾 Guardando {len(sistema_solar_3d)} órbitas en '{archivo_salida}'...")
    with open(archivo_salida, 'w') as f:
        json.dump(sistema_solar_3d, f)
        
    print(f"✅ ¡Éxito! Archivo '{archivo_salida}' generado.")

if __name__ == "__main__":
    procesar_y_guardar_orbitas_3d()
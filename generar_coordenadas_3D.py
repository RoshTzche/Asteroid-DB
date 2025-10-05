# generar_coordenadas_3d.py
import pandas as pd
import numpy as np
import json
import os

def generar_orbita_3d(a, e, i_deg, om_deg, w_deg):
    """
    Calcula los puntos (x, y, z) de una órbita en el espacio 3D a partir de sus elementos orbitales.
    """
    i = np.radians(i_deg if pd.notna(i_deg) else 0)
    om = np.radians(om_deg if pd.notna(om_deg) else 0)
    w = np.radians(w_deg if pd.notna(w_deg) else 0)

    theta = np.linspace(0, 2 * np.pi, 360)
    r = a * (1 - e**2) / (1 + e * np.cos(theta))
    x_plano = r * np.cos(theta)
    y_plano = r * np.sin(theta)

    xp = x_plano * (np.cos(w) * np.cos(om) - np.sin(w) * np.cos(i) * np.sin(om)) - \
         y_plano * (np.sin(w) * np.cos(om) + np.cos(w) * np.cos(i) * np.sin(om))
    
    yp = x_plano * (np.cos(w) * np.sin(om) + np.sin(w) * np.cos(i) * np.cos(om)) + \
         y_plano * (np.cos(w) * np.cos(i) * np.cos(om) - np.sin(w) * np.sin(om))
    
    zp = x_plano * (np.sin(w) * np.sin(i)) + y_plano * (np.cos(w) * np.sin(i))
    
    return np.stack((xp, yp, zp), axis=-1).tolist()

def procesar_y_guardar_orbitas_3d(archivo_csv="jpl_catalog.csv"):
    sistema_solar_3d = {}

    # --- NEW: Orbital data for all solar system planets ---
    planets_data = {
        "Mercury": {"a": 0.387, "e": 0.205, "i_deg": 7.0, "om_deg": 48.3, "w_deg": 29.1},
        "Venus":   {"a": 0.723, "e": 0.007, "i_deg": 3.4, "om_deg": 76.7, "w_deg": 54.9},
        "Earth":   {"a": 1.0,   "e": 0.0167,"i_deg": 0.0, "om_deg": 0,    "w_deg": 102.9},
        "Mars":    {"a": 1.524, "e": 0.093, "i_deg": 1.9, "om_deg": 49.6, "w_deg": 286.5},
        "Jupiter": {"a": 5.203, "e": 0.048, "i_deg": 1.3, "om_deg": 100.5,"w_deg": 273.8},
        "Saturn":  {"a": 9.537, "e": 0.054, "i_deg": 2.5, "om_deg": 113.7,"w_deg": 339.3},
        "Uranus":  {"a": 19.191,"e": 0.047, "i_deg": 0.8, "om_deg": 74.0, "w_deg": 98.9},
        "Neptune": {"a": 30.069,"e": 0.009, "i_deg": 1.8, "om_deg": 131.8,"w_deg": 276.3},
    }

    print("🪐 Calculando las órbitas 3D de los planetas...")
    for name, data in planets_data.items():
        orbit = generar_orbita_3d(data["a"], data["e"], data["i_deg"], data["om_deg"], data["w_deg"])
        sistema_solar_3d[name] = {"nombre": name, "coordenadas": orbit}

    # --- Process asteroids (optional, can be commented out if not needed) ---
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, archivo_csv)
    if os.path.exists(file_path):
        print("📁 Cargando catálogo de asteroides...")
        df = pd.read_csv(file_path, skipinitialspace=True)
        df['identificador'] = df['full_name'].fillna(df['spkid'].astype(str))
        required_cols = ['a', 'e', 'i', 'om', 'w', 'identificador']
        df_orbitas = df.dropna(subset=required_cols).copy()
        
        print(f"☄️ Calculando órbitas 3D de los primeros {min(50, len(df_orbitas))} asteroides...")
        for _, asteroide in df_orbitas.head(100).iterrows():
            identificador = asteroide['identificador']
            orbita = generar_orbita_3d(asteroide['a'], asteroide['e'], asteroide['i'], asteroide['om'], asteroide['w'])
            sistema_solar_3d[identificador] = {"nombre": identificador, "coordenadas": orbita}
    else:
        print("⚠️ No se encontró el archivo del catálogo de asteroides, se omitirá su procesamiento.")

    archivo_salida = "orbitas_3d.json"
    print(f"💾 Guardando {len(sistema_solar_3d)} órbitas en '{archivo_salida}'...")
    with open(archivo_salida, 'w') as f:
        json.dump(sistema_solar_3d, f)
        
    print(f"✅ ¡Éxito! Archivo '{archivo_salida}' generado.")

if __name__ == "__main__":
    procesar_y_guardar_orbitas_3d()
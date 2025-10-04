import pandas as pd
import numpy as np
import json
import os
import matplotlib.pyplot as plt

def generar_orbita_2d(a, e, w_deg):
    """
    Calcula los puntos (x, y) de una órbita en el plano 2D.
    """
    w = np.radians(w_deg if w_deg is not None else 0)
    theta = np.linspace(0, 2 * np.pi, 360)
    r = a * (1 - e**2) / (1 + e * np.cos(theta))
    x_plano = r * np.cos(theta)
    y_plano = r * np.sin(theta)
    x_rotado = x_plano * np.cos(w) - y_plano * np.sin(w)
    y_rotado = x_plano * np.sin(w) + y_plano * np.cos(w)
    return np.stack((x_rotado, y_rotado), axis=-1).tolist()

def procesar_y_guardar_orbitas(archivo_csv="jpl_catalog.csv"):
    """
    Carga el catálogo de asteroides, calcula las órbitas 2D y las guarda en un JSON.
    """
    # --- LÓGICA DE RUTA ROBUSTA ---
    # Obtenemos la ruta del directorio donde se encuentra este script.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construimos la ruta completa al archivo CSV, asumiendo que está en el mismo directorio.
    file_path = os.path.join(script_dir, archivo_csv)

    print(f"Buscando el archivo en la ruta: {file_path}")

    if not os.path.exists(file_path):
        print(f"❌ ERROR: No se encontró el archivo en la ruta esperada.")
        print(f"   Asegúrate de que '{archivo_csv}' esté en la misma carpeta que este script: '{script_dir}'")
        return None

    print(f"📁 Cargando catálogo desde '{file_path}'...")
    df = pd.read_csv(file_path, skipinitialspace=True)
    
    # Nos aseguramos de tener los datos necesarios (nombre o spkid como identificador)
    if 'full_name' not in df.columns or 'spkid' not in df.columns:
        print("❌ ERROR: El CSV debe contener las columnas 'full_name' y 'spkid'.")
        return None
        
    df['identificador'] = df['full_name'].fillna(df['spkid'].astype(str))
    df_orbitas = df.dropna(subset=['a', 'e', 'w', 'identificador']).copy()
    print(f"Se procesarán {len(df_orbitas)} asteroides con datos orbitales completos.")

    sistema_solar_2d = {
        "sol": {"nombre": "Sol", "coordenadas": [[0, 0]]}
    }

    print("🌍 Calculando la órbita de la Tierra...")
    orbita_tierra = generar_orbita_2d(a=1.0, e=0.0167, w_deg=102.9)
    sistema_solar_2d["tierra"] = {"nombre": "Tierra", "coordenadas": orbita_tierra}

    print("☄️ Calculando las órbitas de los asteroides...")
    # Limita el procesamiento a los primeros 50 para que el JSON no sea gigante
    for index, asteroide in df_orbitas.head(50).iterrows():
        identificador = asteroide['identificador']
        orbita = generar_orbita_2d(asteroide['a'], asteroide['e'], asteroide['w'])
        sistema_solar_2d[identificador] = {"nombre": identificador, "coordenadas": orbita}

    archivo_salida = "orbitas_2d.json"
    print(f"💾 Guardando {len(sistema_solar_2d)} órbitas en '{archivo_salida}'...")
    with open(archivo_salida, 'w') as f:
        json.dump(sistema_solar_2d, f, indent=2)
        
    return archivo_salida

# La función 'graficar_orbitas_2d' se mantiene igual que en la versión anterior...

def graficar_orbitas_2d(archivo_json):
    """
    Lee el archivo JSON de órbitas y lo grafica con Matplotlib.
    """
    print(f"🎨 Graficando órbitas desde '{archivo_json}'...")
    with open(archivo_json, 'r') as f:
        datos = json.load(f)

    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(12, 12))

    # Graficar el Sol
    ax.plot(0, 0, 'o', color='yellow', markersize=10, label='Sol')

    # Graficar la Tierra
    tierra_coords = np.array(datos['tierra']['coordenadas'])
    ax.plot(tierra_coords[:, 0], tierra_coords[:, 1], color='blue', linewidth=1.5, label='Órbita de la Tierra')

    # Graficar los asteroides
    for key, valor in datos.items():
        if key not in ['sol', 'tierra']:
            coords = np.array(valor['coordenadas'])
            ax.plot(coords[:, 0], coords[:, 1], linestyle='--', linewidth=0.7, alpha=0.6)

    ax.set_aspect('equal')
    ax.set_title('Visualización de Órbitas en 2D (Plano de la Eclíptica)')
    ax.set_xlabel('Distancia X (AU)')
    ax.set_ylabel('Distancia Y (AU)')
    ax.legend()
    ax.grid(True, alpha=0.2)
    plt.show()


if __name__ == "__main__":
    archivo_json_generado = procesar_y_guardar_orbitas()
    if archivo_json_generado:
        graficar_orbitas_2d(archivo_json_generado)
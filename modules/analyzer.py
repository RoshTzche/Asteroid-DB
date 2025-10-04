# modules/analyzer.py
import numpy as np
import pandas as pd


def calculate_derived_parameters(df):
    """
    Calcula parámetros orbitales derivados, como el semieje menor.
    """
    print("Calculando parámetros derivados (semieje menor)...")
    
    # Asegurarnos que las columnas 'a' y 'e' existen y no son nulas
    if 'a' in df.columns and 'e' in df.columns:
        # La fórmula b = a * sqrt(1 - e^2)
        # Usamos np.sqrt para la raíz cuadrada y **2 para el cuadrado
        df['b'] = df['a'] * np.sqrt(1 - df['e']**2)
    
    return df

def clean_data(df):
    """Limpia el DataFrame convirtiendo tipos y eliminando nulos."""
    if df.empty:
        return df
    
    # Limpieza de datos de NeoWs
    df['relative_velocity.kilometers_per_second'] = pd.to_numeric(
        df['relative_velocity.kilometers_per_second'], errors='coerce')
    df = df.dropna(subset=['relative_velocity.kilometers_per_second'])
    
    # Limpieza de datos de JPL
    if 'moid' in df.columns:
        df['moid'] = pd.to_numeric(df['moid'], errors='coerce')
    
    return df

def perform_risk_analysis(df_enriched, n_top=10):
    """
    Realiza un análisis de riesgo basado en el MOID (Minimum Orbit Intersection Distance).
    
    Args:
        df_enriched (pd.DataFrame): El DataFrame con datos de JPL.
        n_top (int): El número de los asteroides más riesgosos a mostrar.
    """
    print("\n--- ANÁLISIS DE RIESGO POR PROXIMIDAD ORBITAL (SIMULACIÓN) ---")
    
    if 'moid' not in df_enriched.columns:
        print("La columna 'moid' no existe. No se puede realizar el análisis de riesgo.")
        return
        
    # Filtramos los que tienen datos de MOID y son potencialmente peligrosos
    risk_candidates = df_enriched.dropna(subset=['moid'])
    risk_candidates = risk_candidates[risk_candidates['is_potentially_hazardous_asteroid'] == True]
    
    if risk_candidates.empty:
        print("No se encontraron asteroides potencialmente peligrosos con datos de MOID para analizar.")
        return

    # El MOID está en Unidades Astronómicas (AU). 1 AU = ~150 millones de km.
    # Lo convertimos a "distancias lunares" para mejor comprensión (1 LD ≈ 384,400 km)
    AU_TO_LD = 389.17
    risk_candidates['moid_ld'] = risk_candidates['moid'] * AU_TO_LD
    
    # Ordenamos por MOID para encontrar las órbitas más cercanas a la de la Tierra
    closest_orbits = risk_candidates.sort_values(by='moid').head(n_top)
    
    print(f"Los {n_top} asteroides PHA con las órbitas más cercanas a la de la Tierra son:")
    print(closest_orbits[['name', 'moid_ld', 'moid', 'estimated_diameter.kilometers.estimated_diameter_max']])
    
def generate_orbit_path_3d(asteroid_data):
    """
    Genera una lista de puntos 3D que trazan la órbita completa de un asteroide.
    Implementa el pseudocódigo del usuario usando NumPy para eficiencia.
    
    Args:
        asteroid_data (pd.Series): Una fila del DataFrame que contiene los datos orbitales.
        
    Returns:
        np.array: Un array de NumPy con forma (360, 3) donde cada fila es un punto (x, y, z).
    """
    # --- ENTRADAS ---
    a = asteroid_data['a']          # Semieje mayor
    e = asteroid_data['e']          # Excentricidad
    i_deg = asteroid_data['i']      # Inclinación
    Omega_deg = asteroid_data['om'] # Longitud del nodo ascendente
    omega_deg = asteroid_data['w']  # Argumento del perihelio

    # --- CONVERSIÓN DE ÁNGULOS A RADIANES ---
    i = np.radians(i_deg)
    Omega = np.radians(Omega_deg)
    omega = np.radians(omega_deg)

    # --- BUCLE VECTORIZADO ---
    # Generamos 360 puntos para la Anomalía Verdadera (theta) de 0 a 360 grados.
    theta = np.linspace(0, 2 * np.pi, 360)

    # --- PASO 1: Calcular coordenadas en el plano 2D (vectorizado) ---
    r = a * (1 - e**2) / (1 + e * np.cos(theta))
    x_plano = r * np.cos(theta)
    y_plano = r * np.sin(theta)

    # --- PASO 2: Rotar los puntos 2D a su posición 3D (vectorizado) ---
    # Estas son las matrices de rotación combinadas de tu pseudocódigo.
    x_final = (x_plano * (np.cos(Omega) * np.cos(omega) - np.sin(Omega) * np.sin(omega) * np.cos(i)) - 
               y_plano * (np.cos(Omega) * np.sin(omega) + np.sin(Omega) * np.cos(omega) * np.cos(i)))
    
    y_final = (x_plano * (np.sin(Omega) * np.cos(omega) + np.cos(Omega) * np.sin(omega) * np.cos(i)) + 
               y_plano * (-np.sin(Omega) * np.sin(omega) + np.cos(Omega) * np.cos(omega) * np.cos(i)))
    
    z_final = (x_plano * (np.sin(omega) * np.sin(i)) + 
               y_plano * (np.cos(omega) * np.sin(i)))
    
    # Apilamos los arrays de coordenadas para crear el array final de (360, 3)
    orbit_points = np.stack((x_final, y_final, z_final), axis=-1)
    
    return orbit_points
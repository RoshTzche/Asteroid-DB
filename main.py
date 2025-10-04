# main.py

import os
import pandas as pd
# <-- CAMBIO: Importamos la nueva función de carga completa y eliminamos la que no se usa.
from modules.jpl_enricher import enrich_with_jpl_data
from modules.analyzer import perform_risk_analysis, calculate_derived_parameters, generate_orbit_path_3d
# <-- CAMBIO: Ya no se usará 'plot_velocity_distribution'.
from modules.visualizer import plot_risk_scatter, plot_3d_orbit
from modules.data_loader import get_large_asteroid_catalog #

# --- CONFIGURACIÓN ---
API_KEY = os.getenv('NASA_API_KEY', 'qeXXTqWAYhdeO6BEgtBFg7UbUq4nIGXQkmn3QdpJ') # Reemplaza con tu key

'''def export_to_json(df, filename='asteroides_todos.json'):
    """
    Filtra el DataFrame para obtener los datos más importantes y los exporta a un archivo JSON.
    """
    print(f"\nGenerando archivo JSON completo: {filename}...")

    # <-- CAMBIO: Eliminamos columnas que no existen en la descarga completa (/browse).
    # Estas columnas solo existen en los datos de acercamientos (/feed).
    columnas_esenciales = [
        'name',
        'id',
        'is_potentially_hazardous_asteroid',
        'absolute_magnitude_h',
        'estimated_diameter.kilometers.estimated_diameter_max',
        'moid', # La distancia mínima entre órbitas (en AU)
        'a',    # Semieje mayor
        'e',    # Excentricidad
        'i'     # Inclinación
    ]

    columnas_existentes = [col for col in columnas_esenciales if col in df.columns]
    df_filtrado = df[columnas_existentes].copy()
    
    df_filtrado.sort_values(by='moid', ascending=True, inplace=True)

    # <-- CAMBIO: Eliminamos los renames de las columnas que ya no existen.
    df_filtrado.rename(columns={
        'is_potentially_hazardous_asteroid': 'es_peligroso',
        'estimated_diameter.kilometers.estimated_diameter_max': 'diametro_km',
        'moid': 'distancia_min_orbita_au',
        'a': 'semieje_mayor_au',
        'e': 'excentricidad',
        'i': 'inclinacion_grados'
    }, inplace=True)
    
    df_filtrado.to_json(filename, orient='records', indent=4)
    
    print(f"¡Éxito! Archivo '{filename}' creado con {len(df_filtrado)} asteroides procesados.")
'''
def export_results_to_json(df, filename='asteroides_catalogo_web.json'):
    """Exporta el catálogo completo a un archivo JSON para la web."""
    print(f"\nGenerando archivo JSON para la web: {filename}...")
    
    # Renombramos columnas para que sean más amigables en el frontend
    df_export = df.rename(columns={
        'pha': 'es_peligroso',
        'h': 'magnitud_absoluta',
        'diameter': 'diametro_km',
        'albedo': 'reflectividad',
        'rot_per': 'periodo_rotacion_horas',
        'moid': 'distancia_min_orbita_au',
        'a': 'semieje_mayor_au',
        'e': 'excentricidad',
        'i': 'inclinacion_grados',
        'per_y': 'periodo_orbital_anios',
        'data_arc': 'arco_observacion_dias',
        'first_obs': 'primera_observacion',
        'last_obs': 'ultima_observacion',
        'pdes': 'designacion_permanente'
    }, inplace=False, errors='ignore')

    # Guardamos el DataFrame con NaNs reemplazados por None (más amigable para JSON/JS)
    df_export.where(pd.notna(df_export), None).to_json(filename, orient='records', indent=4)
    print(f"¡Éxito! Archivo '{filename}' creado con {len(df_export)} asteroides.")


'''def main():

    # <-- CAMBIO: Llamamos a la nueva función de carga completa.
    df_neows = load_all_neows_asteroids(API_KEY)
    
    if df_neows.empty:
        print("No se pudieron cargar los datos de NeoWs. Terminando el programa.")
        return

    # <-- CAMBIO: El paso de 'clean_data' se elimina porque el nuevo DataFrame no tiene
    # las columnas que esa función esperaba (como 'relative_velocity').
    # Pasamos el DataFrame directamente al siguiente paso.
    df_enriched = enrich_with_jpl_data(df_neows)
    df_final = calculate_derived_parameters(df_enriched)
    
    perform_risk_analysis(df_final)
    export_to_json(df_final)

    # --- NUEVA SECCIÓN: GENERAR Y VISUALIZAR UNA ÓRBITA ---
    print("\n--- Visualización de Órbita 3D ---")
    df_drawable = df_final.dropna(subset=['a', 'e', 'i', 'om', 'w'])
    
    if not df_drawable.empty:
        asteroid_a_dibujar = df_drawable.iloc[0]
        nombre_asteroide = asteroid_a_dibujar['name']
        print(f"Generando la trayectoria para el asteroide: {nombre_asteroide}")
        
        puntos_orbita = generate_orbit_path_3d(asteroid_a_dibujar)
        plot_3d_orbit(puntos_orbita, nombre_asteroide)
    else:
        print("No se encontraron asteroides con datos orbitales suficientes para dibujar.")
    
    # <-- CAMBIO: El gráfico de velocidad ya no es aplicable y se elimina del flujo.
    print("\nGenerando visualizaciones 2D...")
    plot_risk_scatter(df_final)
    
    # <-- CAMBIO: Eliminado el 'print' duplicado.
    print("\nAnálisis completado.")

if __name__ == "__main__":
    main()'''

def main():
    # 1. Obtenemos el catálogo grande y variado
    df_asteroids = get_large_asteroid_catalog()
    
    if df_asteroids.empty:
        print("No se pudieron cargar datos. Terminando.")
        return

    # 2. Exportamos el JSON completo para la página web
    export_results_to_json(df_asteroids.copy()) # Usamos una copia por si acaso

    # 3. Análisis de riesgo y visualizaciones (con los mismos datos)
    perform_risk_analysis(df_asteroids)

    print("\n--- Visualización de Órbita 3D ---")
    df_drawable = df_asteroids.dropna(subset=['a', 'e', 'i', 'om', 'w', 'diameter'])
    
    if not df_drawable.empty:
        asteroid_a_dibujar = df_drawable.sort_values(by='diameter', ascending=False).iloc[0]
        nombre_asteroide = asteroid_a_dibujar['fullname']
        print(f"Generando la trayectoria para el asteroide: {nombre_asteroide}")
        
        puntos_orbita = generate_orbit_path_3d(asteroid_a_dibujar)
        plot_3d_orbit(puntos_orbita, nombre_asteroide)
    else:
        print("No se encontraron asteroides con datos orbitales completos para dibujar.")

    print("\nAnálisis completado.")


if __name__ == "__main__":
    main()
# main.py
import os
import pandas as pd
from modules.data_loader import load_local_jpl_catalog
from modules.analyzer import clean_and_prepare_data
from modules.visualizer import plot_orbital_distribution

def export_to_json(df, filename='catalogo_asteroides_web.json'):
    """
    Exporta el DataFrame final a un archivo JSON limpio, creando un
    identificador robusto a partir del nombre completo o el SPK ID.
    """
    print(f"\nGenerando archivo JSON para la web: {filename}...")

    # --- LÓGICA MEJORADA PARA EL IDENTIFICADOR ---
    # 1. Aseguramos que la columna 'spkid' sea del tipo correcto para poder usarla.
    if 'spkid' in df.columns:
        df['spkid_str'] = df['spkid'].astype(str)
    else:
        print("⚠️ No se encontró la columna 'spkid'. Se usará un índice como fallback.")
        df['spkid_str'] = df.index.astype(str)

    # 2. Creamos la nueva columna 'identificador'.
    #    Usa 'full_name' si no es nulo; si lo es, usa el 'spkid_str'.
    df['identificador'] = df['full_name'].fillna(df['spkid_str'])

    # 3. Renombramos las columnas del CSV a nombres más amigables
    df_export = df.rename(columns={
        'is_pha': 'es_peligroso',
        'H': 'magnitud_absoluta',
        'rot_per': 'periodo_rotacion_horas',
        'moid': 'distancia_min_orbita_au',
        'per_y': 'periodo_orbital_anios',
        'data_arc': 'arco_observacion_dias'
        # 'full_name' ya no es necesario porque tenemos 'identificador'
    }, inplace=False, errors='ignore')

    # Reemplazamos los NaN de Pandas con None para un JSON estándar
    df_export = df_export.where(pd.notna(df_export), None)
    
    # Seleccionamos las columnas finales que queremos en el JSON
    columnas_finales = [col for col in [
        'identificador', 'es_peligroso', 'magnitud_absoluta', 'diameter', 
        'albedo', 'periodo_rotacion_horas', 'distancia_min_orbita_au', 
        'a', 'e', 'i', 'om', 'w', 'ma', 'q', 'ad', 'periodo_orbital_anios', 'data_arc'
    ] if col in df_export.columns]
    
    df_export[columnas_finales].to_json(filename, orient='records', indent=4)
    print(f"¡Éxito! Archivo '{filename}' creado con {len(df_export)} asteroides.")


def main():
    """
    Flujo de trabajo principal: Cargar catálogo local, procesar y exportar.
    """
    df_asteroids = load_local_jpl_catalog()
    
    if df_asteroids.empty:
        return

    df_final = clean_and_prepare_data(df_asteroids)
    export_to_json(df_final.copy())

    print("\nGenerando visualización 2D del catálogo...")
    plot_orbital_distribution(df_final)
    
    print("\nProceso completado.")


if __name__ == "__main__":
    main()
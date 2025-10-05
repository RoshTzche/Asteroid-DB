# main.py
import os
import pandas as pd
from modules.data_loader import load_local_jpl_catalog
from modules.analyzer import clean_and_prepare_data
from modules.visualizer import plot_orbital_distribution

def export_to_json(df, filename='catalogo_asteroides_web.json'):
    """
    Exports the final DataFrame to a clean JSON file, including
    both a robust identifier and the full name.
    """
    print(f"\nGenerating JSON file for the web: {filename}...")

    if 'spkid' in df.columns:
        df['spkid_str'] = df['spkid'].astype(str)
    else:
        print("⚠️ 'spkid' column not found. Using index as a fallback.")
        df['spkid_str'] = df.index.astype(str)

    df['identificador'] = df['full_name'].fillna(df['spkid_str'])

    df_export = df.rename(columns={
        'is_pha': 'es_peligroso',
        'H': 'magnitud_absoluta',
        'rot_per': 'periodo_rotacion_horas',
        'moid': 'distancia_min_orbita_au',
        'per_y': 'periodo_orbital_anios',
    }, inplace=False, errors='ignore')

    df_export = df_export.where(pd.notna(df_export), None)
    
    final_columns = [col for col in [
        'identificador', 'full_name', 'es_peligroso', 'magnitud_absoluta', 'diameter',
        'albedo', 'periodo_rotacion_horas', 'distancia_min_orbita_au', 
        'a', 'e', 'i', 'om', 'w', 'ma', 'q', 'ad', 'periodo_orbital_anios'
    ] if col in df_export.columns]
    
    df_export[final_columns].to_json(filename, orient='records', indent=4)
    print(f"Success! File '{filename}' created with {len(df_export)} asteroids.")


def main():
    """
    Main workflow: Load, process, filter, and export.
    """
    df_asteroids = load_local_jpl_catalog()
    
    if df_asteroids.empty:
        return

    df_processed = clean_and_prepare_data(df_asteroids)

    # --- NEW LOGIC: Filter for asteroids with a real name first ---
    df_named = df_processed[df_processed['full_name'].notna()].copy()
    print(f"\nFound {len(df_named)} asteroids with a real name.")

    print("Filtering and sorting for the 5,000 most interesting named asteroids...")

    if 'pha' in df_named.columns:
        df_named['is_pha'] = df_named['pha'].apply(lambda x: True if x == 'Y' else False)
    else:
        df_named['is_pha'] = False
        print("Warning: 'pha' column not found. Cannot prioritize by hazard status.")

    sort_columns = ['is_pha', 'diameter', 'moid']
    sort_ascending = [False, False, True] # is_pha DESC, diameter DESC, moid ASC
    
    available_sort_cols = [col for col in sort_columns if col in df_named.columns]
    available_sort_order = [order for col, order in zip(sort_columns, sort_ascending) if col in available_sort_cols]

    if not available_sort_cols:
         print("Warning: Sorting columns not found. Taking the first 5,000 named rows.")
         df_interesting = df_named.head(5000)
    else:
        print(f"Sorting by: {available_sort_cols}")
        df_interesting = df_named.sort_values(
            by=available_sort_cols,
            ascending=available_sort_order
        ).head(5000)
    # --- END of new logic ---

    export_to_json(df_interesting.copy())

    print("\nGenerating 2D visualization of the catalog...")
    plot_orbital_distribution(df_interesting)
    
    print("\nProcess completed.")


if __name__ == "__main__":
    main()
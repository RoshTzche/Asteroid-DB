# modules/analyzer.py
import pandas as pd

def clean_and_prepare_data(df):
    """
    Convierte todas las columnas a numérico (donde sea posible) y maneja errores.
    """
    print("Limpiando y preparando datos...")
    for col in df.columns:
        # Excluye las columnas que sabemos que son texto
        if col not in ['full_name', 'pha', 'neo']:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    return df
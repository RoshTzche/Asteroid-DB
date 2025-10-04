# modules/visualizer.py
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

def plot_orbital_distribution(df):
    """
    Genera un gráfico de dispersión 2D mostrando la distribución de las órbitas
    de los asteroides del catálogo.
    """
    required_cols = ['a', 'i', 'diameter', 'pha']
    if not all(col in df.columns for col in required_cols):
        print("Faltan columnas necesarias para el gráfico ('a', 'i', 'diameter', 'pha').")
        return
        
    df_plot = df.dropna(subset=required_cols).copy()
    if df_plot.empty:
        print("No hay suficientes datos completos para generar el gráfico.")
        return

    print(f"Graficando {len(df_plot)} asteroides con datos completos...")

    plt.figure(figsize=(14, 9))
    
    # Asigna color basado en si es peligroso o no (el campo 'pha' es 'Y'/'N')
    colores = df_plot['pha'].map({'Y': 'red', 'N': 'skyblue'})
    
    # El tamaño del punto es proporcional al diámetro, con un mínimo para visibilidad
    sizes = (df_plot['diameter'] * 20) + 10
    
    plt.scatter(
        df_plot['a'],
        df_plot['i'],
        c=colores,
        s=sizes,
        alpha=0.6,
        edgecolors='w',
        linewidth=0.5
    )
    
    plt.title('Distribución Orbital de Asteroides del Catálogo JPL', fontsize=16)
    plt.xlabel('Semieje Mayor (Tamaño de la órbita en AU)', fontsize=12)
    plt.ylabel('Inclinación Orbital (grados)', fontsize=12)
    plt.xscale('log') # Escala logarítmica para ver mejor la distribución
    plt.grid(True, which="both", ls="--", alpha=0.5)
    
    # Leyenda manual
    legend_elements = [
        Line2D([0], [0], marker='o', color='w', label='No Peligroso', markerfacecolor='skyblue', markersize=12),
        Line2D([0], [0], marker='o', color='w', label='Potencialmente Peligroso', markerfacecolor='red', markersize=12)
    ]
    plt.legend(handles=legend_elements, title="Clasificación de Riesgo")
    
    plt.show()
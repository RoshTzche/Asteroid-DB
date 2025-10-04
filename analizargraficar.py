import pandas as pd
import matplotlib.pyplot as plt
import json

def analizar_desde_json(archivo_entrada='asteroides_todos.json'):
    """
    Lee un archivo JSON de asteroides, lo analiza, crea un subconjunto
    de datos y genera un gráfico 2D y un nuevo archivo JSON.
    """
    # --- 1. Leer el archivo JSON principal ---
    print(f"Leyendo datos desde '{archivo_entrada}'...")
    try:
        # Usamos pd.read_json que es directo y eficiente
        df = pd.read_json(archivo_entrada)
    except ValueError:
        print(f"Error: No se pudo encontrar o leer el archivo '{archivo_entrada}'.")
        print("Asegúrate de que el archivo existe y está en la misma carpeta que este script.")
        return

    print(f"Se cargaron {len(df)} asteroides.")

    # --- 2. Filtrar para obtener datos interesantes ---
    # Vamos a quedarnos con los asteroides más grandes, por ejemplo,
    # aquellos con un diámetro estimado mayor a 1 km.
    print("Filtrando asteroides con diámetro > 1 km...")
    df_filtrado = df[df['diametro_km'] > 1.0].copy()

    if df_filtrado.empty:
        print("No se encontraron asteroides con un diámetro mayor a 1 km en este conjunto de datos.")
        return
        
    print(f"Se encontraron {len(df_filtrado)} asteroides grandes.")

    # --- 3. Generar el nuevo archivo JSON ---
    archivo_json_salida = 'asteroides_visualizacion.json'
    print(f"Guardando datos filtrados en '{archivo_json_salida}'...")
    df_filtrado.to_json(
        archivo_json_salida,
        orient='records',
        indent=4
    )

    # --- 4. Crear el Gráfico 2D ---
    print("Generando gráfico 2D...")
    plt.style.use('seaborn-v0_8-darkgrid') # Estilo visual atractivo
    fig, ax = plt.subplots(figsize=(12, 8))

    # Coloreamos los puntos según si el asteroide es "potencialmente peligroso"
    colores = {True: 'red', False: 'skyblue'}
    
    scatter = ax.scatter(
        df_filtrado['semieje_mayor_au'],
        df_filtrado['inclinacion_grados'],
        s=df_filtrado['diametro_km'] * 50,  # El tamaño del punto representa el tamaño del asteroide
        c=df_filtrado['es_peligroso'].map(colores),
        alpha=0.6,
        edgecolors='w',
        linewidth=0.5
    )

    # Añadir etiquetas y títulos
    ax.set_title('Asteroides Grandes (>1 km): Tamaño de la Órbita vs. Inclinación')
    ax.set_xlabel('Semieje Mayor (Distancia promedio al Sol en AU)')
    ax.set_ylabel('Inclinación Orbital (grados)')
    ax.grid(True)

    # Crear una leyenda para los colores
    # Se crea manualmente porque los colores se asignan dinámicamente
    from matplotlib.lines import Line2D
    legend_elements = [
        Line2D([0], [0], marker='o', color='w', label='No Peligroso', markerfacecolor='skyblue', markersize=10),
        Line2D([0], [0], marker='o', color='w', label='Potencialmente Peligroso', markerfacecolor='red', markersize=10)
    ]
    ax.legend(handles=legend_elements, title="Clasificación de Riesgo")

    # --- 5. Guardar el Gráfico en un archivo ---
    archivo_grafico_salida = 'grafico_asteroides_2d.png'
    print(f"Guardando gráfico en '{archivo_grafico_salida}'...")
    plt.savefig(archivo_grafico_salida, dpi=150) # dpi = dots per inch (resolución)
    plt.show() # Opcional: también muestra el gráfico en pantalla

    print("\n¡Proceso completado!")


if __name__ == "__main__":
    analizar_desde_json()
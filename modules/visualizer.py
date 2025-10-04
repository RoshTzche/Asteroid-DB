# modules/visualizer.py
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D 

def plot_velocity_distribution(df):
    """Genera un histograma de la velocidad relativa de los asteroides."""
    plt.figure(figsize=(12, 6))
    plt.hist(df['relative_velocity.kilometers_per_second'], bins=40, color='skyblue', edgecolor='black')
    plt.title('Distribución de Velocidad Relativa (NeoWs)')
    plt.xlabel('Velocidad (km/s)')
    plt.ylabel('Frecuencia')
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.show()

def plot_risk_scatter(df):
    """Genera un gráfico de dispersión de MOID vs Diámetro."""
    df_plot = df.dropna(subset=['moid', 'estimated_diameter.kilometers.estimated_diameter_max'])
    if df_plot.empty:
        print("No hay suficientes datos para el gráfico de riesgo.")
        return

    AU_TO_LD = 389.17
    df_plot['moid_ld'] = df_plot['moid'] * AU_TO_LD
    
    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(
        df_plot['estimated_diameter.kilometers.estimated_diameter_max'],
        df_plot['moid_ld'],
        c=df_plot['relative_velocity.kilometers_per_second'],
        cmap='viridis',
        alpha=0.7,
        s=50  # Tamaño de los puntos
    )
    
    plt.colorbar(scatter, label='Velocidad Relativa (km/s)')
    plt.title('Análisis de Riesgo: Proximidad Orbital vs. Tamaño Estimado')
    plt.xlabel('Diámetro Máximo Estimado (km)')
    plt.ylabel('Distancia Mínima de Intersección Orbital (Distancias Lunares)')
    plt.yscale('log') # Escala logarítmica para ver mejor los valores pequeños de MOID
    plt.grid(True, which="both", ls="--")
    plt.axhline(y=1, color='r', linestyle='--', label='1 Distancia Lunar (Umbral Crítico)')
    plt.legend()
    plt.show()

'''def plot_risk_scatter(df):
    """
    Genera un gráfico de dispersión de MOID vs. Diámetro.
    Esta versión es más robusta y maneja datos de MOID faltantes.
    """
    # Seleccionamos solo los que tienen diámetro para poder graficarlos
    df_plot = df.dropna(subset=['estimated_diameter.kilometers.estimated_diameter_max']).copy()
    
    if df_plot.empty:
        print("No hay asteroides con datos de diámetro para graficar.")
        return

    # --- LÓGICA MEJORADA ---
    # Si a un asteroide le falta el MOID (es NaN), le asignamos un valor muy alto (ej. 10 AU)
    # para que aparezca en la parte superior del gráfico, indicando un riesgo orbital desconocido.
    AU_TO_LD = 389.17
    df_plot['moid_ld'] = df_plot['moid'].fillna(10) * AU_TO_LD # fillna(10) es la clave

    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(
        df_plot['diametro_km'], # Usamos la columna ya renombrada si existe
        df_plot['moid_ld'],
        c=df_plot['es_peligroso'].astype(int), # Coloreamos por si es PHA o no
        cmap='coolwarm',
        alpha=0.7,
        s=50
    )
    
    plt.colorbar(scatter, ticks=[0, 1], label='Es Potencialmente Peligroso').set_ticklabels(['No', 'Sí'])
    plt.title('Análisis de Riesgo: Proximidad Orbital vs. Tamaño Estimado')
    plt.xlabel('Diámetro Máximo Estimado (km)')
    plt.ylabel('Distancia Mínima de Intersección Orbital (Distancias Lunares)')
    plt.yscale('log')
    plt.grid(True, which="both", ls="--")
    plt.axhline(y=1, color='r', linestyle='--', label='1 Distancia Lunar (Umbral Crítico)')
    plt.ylim(bottom=0.1) # Ajustamos el límite inferior para una mejor visualización
    plt.legend()
    print(f"Graficando {len(df_plot)} asteroides con datos de diámetro.")
    plt.show()
'''

def plot_3d_orbit(orbit_points, asteroid_name):

    #Dibuja una órbita 3D a partir de una lista de puntos 
    if orbit_points is None or len(orbit_points) == 0:
        print(f"No hay datos de órbita para graficar para {asteroid_name}.")
        return

    fig = plt.figure(figsize=(10, 10))
    ax = fig.add_subplot(111, projection='3d')

    # Descomprimir los puntos (x, y, z)
    x, y, z = orbit_points[:, 0], orbit_points[:, 1], orbit_points[:, 2]

    # Dibujar la órbita del asteroide
    ax.plot(x, y, z, label=f'Órbita de {asteroid_name}')
    
    # Dibujar el Sol en el centro
    ax.scatter([0], [0], [0], color='yellow', s=100, label='Sol')

    # Estética del gráfico
    ax.set_xlabel('X (AU)')
    ax.set_ylabel('Y (AU)')
    ax.set_zlabel('Z (AU)')
    ax.set_title(f'Visualización de la Órbita 3D')
    ax.legend()
    plt.show()
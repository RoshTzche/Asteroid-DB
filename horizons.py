# obtener_posiciones.py

from astroquery.jplhorizons import Horizons
from astropy.time import Time

def obtener_posicion_actual(id_objeto, id_tipo='smallbody'):
    """
    Obtiene la posición vectorial (x, y, z) de un objeto del sistema solar
    para el momento actual, usando la API de JPL Horizons.
    
    Args:
        id_objeto (str): El ID del objeto (ej. 'Eros', '433', o '399' para la Tierra).
        id_tipo (str): 'majorbody' para planetas/sol, 'smallbody' para asteroides/cometas.
        
    Returns:
        dict: Un diccionario con las coordenadas x, y, z en Unidades Astronómicas (AU).
    """
    try:
        # Obtenemos la fecha y hora actual
        ahora = Time.now()
        
        # Configuramos la consulta a Horizons
        obj = Horizons(
            id=id_objeto,
            location='@sun',  # Queremos las coordenadas con el Sol en el origen (0,0,0)
            epochs=ahora.jd,  # Usamos la fecha actual en formato de día juliano
            id_type=id_tipo
        )
        
        # Hacemos la petición para obtener los vectores (posición y velocidad)
        vectores = obj.vectors()
        
        # Extraemos las coordenadas x, y, z de la tabla de resultados
        x = vectores['x'][0] # AU
        y = vectores['y'][0] # AU
        z = vectores['z'][0] # AU
        
        print(f"✅ Posición de '{id_objeto}' obtenida para {ahora.iso}")
        return {'x': x, 'y': y, 'z': z}
        
    except Exception as e:
        print(f"❌ Error al obtener la posición para '{id_objeto}': {e}")
        return None

if __name__ == "__main__":
    
    # --- OBTENER LA POSICIÓN DE LA TIERRA ---
    # Para Horizons, el ID del sistema Tierra-Luna es '399'
    posicion_tierra = obtener_posicion_actual('399', id_tipo='majorbody')
    if posicion_tierra:
        print(f"   Coordenadas de la Tierra (AU): x={posicion_tierra['x']:.4f}, y={posicion_tierra['y']:.4f}, z={posicion_tierra['z']:.4f}\n")

    # --- OBTENER LA POSICIÓN DE UN ASTEROIDE CONOCIDO (Eros) ---
    # Usamos su SPK ID, que es más preciso
    posicion_eros = obtener_posicion_actual('2000433', id_tipo='smallbody')
    if posicion_eros:
        print(f"   Coordenadas de 433 Eros (AU): x={posicion_eros['x']:.4f}, y={posicion_eros['y']:.4f}, z={posicion_eros['z']:.4f}\n")

    # --- CÁLCULO DE DISTANCIA (Ejemplo de simulación simple) ---
    if posicion_tierra and posicion_eros:
        dist_x = posicion_tierra['x'] - posicion_eros['x']
        dist_y = posicion_tierra['y'] - posicion_eros['y']
        dist_z = posicion_tierra['z'] - posicion_eros['z']
        
        # Distancia euclidiana en 3D
        distancia_total = (dist_x**2 + dist_y**2 + dist_z**2)**0.5
        
        distancia_km = distancia_total * 149597870.7 # 1 AU en km
        
        print("--- Simulación de Distancia Actual ---")
        print(f"Distancia entre la Tierra y Eros ahora mismo: {distancia_total:.4f} AU")
        print(f"({distancia_km:,.0f} km)")
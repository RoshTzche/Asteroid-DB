# app.py
from flask import Flask, jsonify
from flask_cors import CORS  # Para permitir la comunicación entre el backend y el frontend
import pandas as pd
import numpy as np
import os
from astroquery.jplhorizons import Horizons
from astropy.time import Time

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

# --- DATOS ESTÁTICOS (ÓRBITAS) ---
def generar_orbita_2d(a, e, w_deg):
    w = np.radians(w_deg if pd.notna(w_deg) else 0)
    theta = np.linspace(0, 2 * np.pi, 180) # 180 puntos es suficiente
    r = a * (1 - e**2) / (1 + e * np.cos(theta))
    x_plano = r * np.cos(theta)
    y_plano = r * np.sin(theta)
    x_rotado = x_plano * np.cos(w) - y_plano * np.sin(w)
    y_rotado = x_plano * np.sin(w) + y_plano * np.cos(w)
    return np.stack((x_rotado, y_rotado), axis=-1).tolist()

@app.route('/api/orbits')
def get_orbits():
    """Devuelve las trayectorias orbitales completas para la visualización inicial."""
    print("Petición recibida para /api/orbits")
    try:
        df = pd.read_csv("jpl_catalog.csv", skipinitialspace=True)
        df['identificador'] = df['full_name'].fillna(df['spkid'].astype(str))
        df_orbitas = df.dropna(subset=['a', 'e', 'w', 'identificador']).head(20) # Primeros 20

        sistema_solar_2d = {}
        # Tierra
        sistema_solar_2d["Tierra"] = generar_orbita_2d(a=1.0, e=0.0167, w_deg=102.9)
        # Asteroides
        for _, asteroide in df_orbitas.iterrows():
            sistema_solar_2d[asteroide['identificador']] = generar_orbita_2d(asteroide['a'], asteroide['e'], asteroide['w'])
            
        return jsonify(sistema_solar_2d)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- DATOS EN TIEMPO REAL (POSICIONES) ---
@app.route('/api/positions')
def get_positions():
    """Calcula y devuelve la posición actual de la Tierra y algunos asteroides."""
    print("Petición recibida para /api/positions (tiempo real)")
    ahora = Time.now()
    posiciones = {}
    
    # IDs para Horizons: '399' es la Tierra, los otros son SPK IDs de asteroides
    objetos = {
        'Tierra': {'id': '399', 'type': 'majorbody'},
        '433 Eros': {'id': '2000433', 'type': 'smallbody'},
        '1566 Icarus': {'id': '2001566', 'type': 'smallbody'},
        '1036 Ganymed': {'id': '2001036', 'type': 'smallbody'}
    }
    
    for nombre, info in objetos.items():
        try:
            obj = Horizons(id=info['id'], location='@sun', epochs=ahora.jd, id_type=info['type'])
            vectores = obj.vectors()
            # Solo nos interesan las coordenadas X e Y para la visualización 2D
            posiciones[nombre] = {'x': vectores['x'][0], 'y': vectores['y'][0]}
        except Exception as e:
            print(f"No se pudo obtener la posición de {nombre}: {e}")
            
    return jsonify(posiciones)

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Usamos el puerto 5001
# debug_api.py

import requests

print("Iniciando script de diagnóstico para la API de JPL SBDB...")

# La lista COMPLETA de campos que hemos intentado solicitar
fields_to_test = [
    'fullname', 'pdes', 'spk', 'h', 'diameter', 'albedo', 'rot_per', 'pha', 
    'neo', 'orbit_id', 'moid', 'a', 'e', 'i', 'om', 'w', 'ma', 'q', 'ad', 
    'per_y', 'data_arc', 'first_obs', 'last_obs', 'n_obs_used', 'producer', 
    'spec_B', 'spec_T'
]

tested_fields = []
base_url = "https://ssd-api.jpl.nasa.gov/sbdb.api"

for field in fields_to_test:
    # Añadimos el siguiente campo a nuestra lista de prueba
    current_test_list = tested_fields + [field]
    fields_str = ','.join(current_test_list)
    
    # Hacemos una petición muy simple con la lista de campos actual
    params = {'class': 'ATE', 'limit': '1', 'fields': fields_str}
    
    try:
        response = requests.get(base_url, params=params)
        # Si la petición falla, raise_for_status() lanzará un error
        response.raise_for_status()
        
        # Si la petición es exitosa, añadimos el campo a la lista de "buenos"
        tested_fields.append(field)
        print(f"✅ ÉXITO: El campo '{field}' es compatible.")

    except requests.exceptions.HTTPError as e:
        print("\n" + "="*50)
        print(f"❌ FALLO DETECTADO.")
        print(f"El problema ocurre al añadir el campo: '{field}'")
        print(f"Error completo: {e}")
        print("La lista de campos buenos hasta ahora era:")
        print(tested_fields)
        print("="*50 + "\n")
        break # Detenemos el script al encontrar el primer error

print("Diagnóstico completado.")
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import ollama

app = Flask(__name__)
CORS(app)

# Product data
products = {
    101: {
        'id': '101',
        'name': 'Nendoroid Chainsaw Man Denji',
        'price': 54.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/6c/5a/1b/6c5a1b579e17e8585c895c055a3b0c7c.jpg'
    },
    102: {
        'id': '102',
        'name': 'Figma Demon Slayer Tanjiro',
        'price': 89.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/7e/53/27/7e5327df138e6b4a7a0bfdbbb9e4d312.jpg'
    },
    103: {
        'id': '103',
        'name': 'Pop Up Parade Vocaloid Miku',
        'price': 239.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/62/c9/b1/62c9b1ace3d687d13854d490296ce06f.jpg'
    },
    104: {
        'id': '104',
        'name': 'Scale Figure Attack on Titan Eren',
        'price': 189.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/6b/74/bb/6b74bbe2c411facd5c9b40fe5de4a32a.jpg'
    },
    105: {
        'id': '105',
        'name': 'Nendoroid Final Fantasy Cloud',
        'price': 54.99,
        'category': 'game',
        'image': 'https://i.pinimg.com/736x/65/53/b2/6553b22b8dd3090de9b7852437dc2617.jpg'
    },
    106: {
        'id': '106',
        'name': 'Nendoroid Rem',
        'price': 359.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/95/5b/6d/955b6deeba417df921a8fdbb3aa52fb3.jpg'
    },
    107: {
        'id': '107',
        'name': 'Figma Asuna Yuuki',
        'price': 89.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/3e/af/09/3eaf092a9c6b61b4f79269c23f25d091.jpg'
    },
    108: {
        'id': '108',
        'name': 'Scale Figure Mikasa Ackerman',
        'price': 199.99,
        'category': 'anime',
        'image': 'https://i.pinimg.com/736x/36/fd/fc/36fdfcc332636a08a2abf049cfa777e2.jpg'
    }
}

# Training data generation
data = {
    'user_id': [1, 2, 3, 4, 5] * 2,
    'product_id': [101, 102, 103, 104, 105] * 2,
    'view_count': [5, 3, 2, 6, 4, 1, 2, 3, 4, 5],
    'purchase_count': [1, 0, 0, 1, 0, 1, 0, 0, 1, 0]
}
df = pd.DataFrame(data)

# Train model
X = df[['user_id', 'product_id', 'view_count']]
y = df['purchase_count']
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

def generate_context_and_prompt(recommendations, message, mode="default"):
    # Determinar el número de recomendaciones y el contexto según el modo
    if mode == "catalog":
        top_recommendations = recommendations # Ajusta según tu necesidad
        context = "Basado en el mensaje del usuario, estas figuras se encuentran en el catálogo disponible:\n"
        prompt = f"""Context: {context}
        User message: {message}
        Comparte el catálogo con el formato dado."""
    else:
        top_recommendations = recommendations[:2]  # Recomendaciones por defecto
        context = "Basado en los intereses del usuario, estas figuras son recomendadas:\n"
        prompt = f"""Context: {context}
        User message: {message}
        Responde eficazmente sobre las figuras, incorporando las recomendaciones naturalmente."""
    
    # Agregar detalles de productos reales al contexto
    for rec in top_recommendations:
        context += f"- id({rec['id']}), {rec['name']} (${rec['price']}) - {rec['category']}\n"

    return top_recommendations, context, prompt

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_id = data.get('userId', 1)
    message = data.get('message', '').lower()

    # Get recommendations for user
    recommendations = []
    for product_id in products.keys():
        pred_data = pd.DataFrame({
            'user_id': [user_id],
            'product_id': [product_id],
            'view_count': [1]
        })
        prob = model.predict_proba(pred_data)[0][1]
        recommendations.append({
            'id': product_id,
            'probability': prob,
            **products[product_id]
        })
    
    recommendations.sort(key=lambda x: x['probability'], reverse=True)

    # Check if any product is mentioned in the message
    mentioned_products = []
    for product in products.values():
        # Convert product name to lower case for comparison
        if any(word.lower() in message for word in product['name'].split()):
            product_info = product.copy()
            mentioned_products.append(product_info)

    # Determine mode and context based on message content
    if "catalogo" in message:
        mode = "catalog"
    elif mentioned_products:
        mode = "product_info"
    else:
        mode = "default"

    # Generate appropriate context and prompt
    if mode == "product_info":
        top_recommendations, context, prompt = generate_context_and_prompt(recommendations, message, mode)
        context = "El usuario ha mencionado productos específicos. Información detallada:\n"
        for product in mentioned_products:
            context += f"- Id: {product['id']}\n  Nombre: {product['name']}\n  Precio: ${product['price']}\n  Categoría: {product['category']}\n"
        prompt = f"""Context: {context}
        User message: {message}
        Proporciona información detallada sobre los productos mencionados."""
    else:
        top_recommendations, context, prompt = generate_context_and_prompt(recommendations, message, mode)

    # Enhanced system prompt
    system_prompt = """Eres un asistente de compras de figuras de anime, manga y videojuegos coleccionables.
    IMPORTANTE: 
    - Debes usar ÚNICAMENTE los productos proporcionados en el contexto. NO inventes ni agregues productos adicionales.
    - Si el usuario menciona un producto específico, proporciona toda la información disponible sobre ese producto.
    - Si el usuario menciona 'catalogo', comparte exactamente los productos listados en el contexto.
    - Si el usuario no menciona productos específicos ni el catálogo, proporciona recomendaciones usando solo los productos mencionados en el contexto."""

    try:
        response = ollama.chat(
            model="qwen2.5:1.5b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        )

        if mode == "catalog":
            catalog_response = "Aquí está nuestro catálogo de figuras disponibles:\n\n"
            for item in top_recommendations:
                item_info = item.copy()
                catalog_response += f"- {item_info['id']} - {item_info['name']} - ${item_info['price']} - Categoría: {item_info['category']}\n"
            return jsonify({
                "status": "success",
                "content": catalog_response,
                "recommendations": top_recommendations
            })
        elif mode == "product_info":
            catalog_response = "Aquí está nuestro catálogo de figuras disponibles:\n\n"
            for item in top_recommendations:
                item_info = item.copy()
                catalog_response += f"- {item_info['id']} - {item_info['name']} - ${item_info['price']} - Categoría: {item_info['category']}\n"
            return jsonify({
                "status": "success",
                "content": response['message']['content'],
                "mentioned_products": mentioned_products,
                "recommendations": top_recommendations
            })
        else:
            return jsonify({
                "status": "success",
                "content": response['message']['content'],
                "recommendations": top_recommendations
            })
        print(response)
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
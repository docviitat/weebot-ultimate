from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import ollama

app = Flask(__name__)
CORS(app)

# Product data
products = {
    101: {'name': 'Nendoroid Chainsaw Man Denji', 'price': 54.99, 'category': 'anime'},
    102: {'name': 'Figma Demon Slayer Tanjiro', 'price': 89.99, 'category': 'anime'},
    103: {'name': 'Pop Up Parade Vocaloid Miku', 'price': 239.99, 'category': 'anime'},
    104: {'name': 'Scale Figure Attack on Titan Eren', 'price': 189.99, 'category': 'anime'},
    105: {'name': 'Nendoroid Final Fantasy Cloud', 'price': 54.99, 'category': 'game'},
    106: {'name': 'Nendoroid Rem', 'price': 359.99, 'category': 'anime'},
    107: {'name': 'Figma Asuna Yuuki', 'price': 89.99, 'category': 'anime'},
    108: {'name': 'Scale Figure Mikasa Ackerman', 'price': 199.99, 'category': 'anime'}
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
        top_recommendations = recommendations[:8]  # Ajusta según tu necesidad
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
        context += f"- {rec['name']} (${rec['price']}) - {rec['category']}\n"

    return top_recommendations, context, prompt

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_id = data.get('userId', 1)
    message = data.get('message', '')

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

    # Determine mode based on message
    mode = "catalog" if "catalogo" in message.lower() else "default"

    # Generate context and prompt
    top_recommendations, context, prompt = generate_context_and_prompt(recommendations, message, mode)

    # Modified system prompt to ensure using provided catalog
    system_prompt = """Eres un asistente de compras de figuras de anime, manga y videojuegos coleccionables.
    IMPORTANTE: Debes usar ÚNICAMENTE los productos proporcionados en el contexto. NO inventes ni agregues productos adicionales.
    
    Si el usuario menciona 'catalogo', comparte exactamente los productos listados en el contexto, con sus nombres, precios y categorías exactos.
    Si el usuario no menciona 'catalogo', proporciona recomendaciones usando solo los productos mencionados en el contexto."""

    # Call chat model
    try:
        response = ollama.chat(
            model="qwen2.5:1.5b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        )

        # For catalog mode, ensure we return a structured response
        if mode == "catalog":
            catalog_response = "Aquí está nuestro catálogo de figuras disponibles:\n\n"
            for item in top_recommendations:
                catalog_response += f"- {item['name']} - ${item['price']} - Categoría: {item['category']}\n"
            return jsonify({
                "status": "success",
                "content": catalog_response,
                "recommendations": top_recommendations
            })
        
        return jsonify({
            "status": "success",
            "content": response['message']['content'],
            "recommendations": top_recommendations
        })
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
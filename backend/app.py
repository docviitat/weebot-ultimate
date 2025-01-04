from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
# from data.catalog import products
from sklearn.ensemble import RandomForestClassifier
import ollama

app = Flask(__name__)
CORS(app)

# Product data
products = {
    101: {'name': 'Nendoroid Chainsaw Man Denji', 'price': 54.99, 'category': 'anime'},
    102: {'name': 'Figma Demon Slayer Tanjiro', 'price': 89.99, 'category': 'anime'},
    103: {'name': 'Pop Up Parade Jujutsu Kaisen Gojo', 'price': 39.99, 'category': 'manga'},
    104: {'name': 'Scale Figure Attack on Titan Eren', 'price': 189.99, 'category': 'anime'},
    105: {'name': 'Nendoroid Final Fantasy Cloud', 'price': 54.99, 'category': 'game'}
}

# @app.route('/lol', methods=['GET'])
# def hello_world():
#     return products


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
    
    # Sort by probability
    recommendations.sort(key=lambda x: x['probability'], reverse=True)
    top_recommendations = recommendations[:2]

    # Create context for LLM
    context = f"Based on the user's interests, these items are recommended:\n"
    for rec in top_recommendations:
        context += f"- {rec['name']} (${rec['price']}) - {rec['category']}\n"
    
    prompt = f"""Context: {context}
User message: {message}
Respond helpfully about figures, incorporating the recommendations naturally if relevant."""

    try:
        response = ollama.chat(
            model="qwen2.5:1.5b",
            messages=[
                {"role": "system", "content": "Tu eres un asistente de compras de figuras de anime, manga y videojuegos coleccionables."},
                {"role": "user", "content": prompt}
            ]
        )
        return jsonify({
            "status": "success",
            "content": response['message']['content'],
            "recommendations": top_recommendations
        })
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
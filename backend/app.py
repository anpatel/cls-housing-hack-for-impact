from flask import Flask, jsonify, request
from flask_cors import CORS
from query_llama import initialize_query_engine

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/')
def home():
    return jsonify({"message": "Welcome to the API"})


@app.route('/api/data', methods=['GET'])
def get_data():
    # Example data - replace with your actual data logic
    data = {
        "items": [
            {"id": 1, "name": "Item 1"},
            {"id": 2, "name": "Item 2"}
        ]
    }
    return jsonify(data)


@app.route('/api/query', methods=['POST'])
def query_documents():
    print('query')
    query_engine = initialize_query_engine()
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "No question provided"}), 400

    question = data['question']
    response = query_engine.query(question)

    return jsonify({
        "question": question,
        "response": str(response)
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)

from flask import Flask, jsonify
from flask_cors import CORS  # For handling cross-origin requests

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


if __name__ == '__main__':
    app.run(debug=True, port=5000)

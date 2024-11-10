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

def get_file_names_and_paths_from_response(response):
    metadata = response.metadata
    file_info = []
    for key, value in metadata.items():
        file_dict = {}
        file_name = value['file_name']
        text_file_path = value['file_path']
        file_dict['text_file_path'] = text_file_path
        file_dict['file_name'] = file_name
        text_file_path = text_file_path.rsplit('.', 1)[0]
        text_file_path = text_file_path.replace('/output', '/input')
        file_dict['pdf_file_path'] = text_file_path
        file_info.append(file_dict)

    return file_info


@app.route('/api/query', methods=['POST'])
def query_documents():
    query_engine = initialize_query_engine()
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "No question provided"}), 400

    question = data['question']
    response = query_engine.query(question)
    files = get_file_names_and_paths_from_response(response)
    response_dict = {}
    response_dict['response'] = response.response
    response_dict['files'] = files

    return jsonify({
        "question": question,
        "response": response_dict
    })


# 0676333b-6a39-436e-a7c8-de88a0738a82
# : 
# creation_date
# : 
# "2024-11-09"
# file_name
# : 
# "Decision Franklin v WPC 20230001 and 20230002.pdf.md"
# file_path
# : 
# "/Users/swimmingcircle/Code/cls-housing-hack-for-impact/Data/output/Decision Franklin v WPC 20230001 and 20230002.pdf.md"
# file_size
# : 
# 10792
# last_modified_date
# : 
# "2024-11-09"
# [[Prototype]]
# : 
# Object
# d2fd2c09-1f59-4682-a61e-93f7ad7063ff
# : 
# creation_date
# : 
# "2024-11-09"
# file_name
# : 
# "Decision Franklin v WPC 20230001 and 20230002.pdf.md"
# file_path
# : 
# "/Users/swimmingcircle/Code/cls-housing-hack-for-impact/Data/output/Decision Franklin v WPC 20230001 and 20230002.pdf.md"
# file_size
# : 
# 10792
# last_modified_date
# : 
# "2024-11-09"


if __name__ == '__main__':
    app.run(debug=True, port=5000)


        #  {
        #       caseNumber:
        #         "Case #2023-054: Rosalene Nee vs. Woodland Park Communities",
        #       summary:
        #         "Rent reduction of 7.5% granted due to repeated roach infestations. Noise complaints were denied.",
        #       outcome:
        #         "✅ Rent reduction granted | ❌ Noise complaint dismissed",
        #       legalBasis:
        #         "California Civil Code Section 1941.1 (Warranty of Habitability)",
        #     },
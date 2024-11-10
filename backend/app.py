import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from query_llama import initialize_query_engine, initialize_document_index

app = Flask(__name__)
CORS(app)


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


def query_specific_documents(files):
    files_output = []
    for file in files:
        file_name = file['file_name']
        document_path = "../data/output/" + file_name
        dir_path = os.path.dirname(os.path.realpath(__file__))

        case_number = initialize_document_index('result_search', [document_path]).query(
            'Using the case and housing ordinance files, please provide me with the cases number').response
        summary = initialize_document_index('result_search', [document_path]).query(
            'Using the case and housing ordinance files, please provide me with the summary').response
        legal_basis = initialize_document_index('result_search', [document_path]).query(
            'Using the case and housing ordinance files, please provide me with the legal basis').response
        dict_response = {
            'case_number': case_number,
            'summary': summary,
            'legal_basis': legal_basis
        }
        dict_response['file_name'] = file_name
        files_output.append(dict_response)

    return files_output


def get_file_names_and_paths_from_response(response):
    metadata = response.metadata
    print('metadata', metadata)
    file_info = []
    for key, value in metadata.items():
        file_dict = {}
        file_name = value['file_name']
        text_file_path = value['file_path']
        file_dict['text_file_path'] = text_file_path
        file_dict['file_name'] = file_name
        pdf_filename = text_file_path.split('/')[-1].rsplit('.', 1)[0]
        file_dict['pdf_file_path'] = pdf_filename
        file_info.append(file_dict)
    return file_info


@app.route('/api/query', methods=['POST'])
def query_documents():
    query_engine = initialize_query_engine()
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "No question provided"}), 400

    question = 'pretend i am an attorney. help me make a legal argument for the new client, providing me with 1-2 of the most compelling, robust legal arguments. each of the 1-2 arguments should be fewer than 50 words. base your arguments off of the relevant local ordinances and the specifics about the client. ensure your 1-2 arguments are highly specific and cite previous relevant cases/stats in your knowledge base. client information: ' + \
        data['question']

    response = query_engine.query(question)
    # files = get_file_names_and_paths_from_response(response)
    response_dict = {}
    response_dict['legal_argument'] = response.response
    # response_dict['files'] = files
    response_dict['case_type'] = 'Habitability Issue -- Pest Infestation and Mold'

    # file_output = query_specific_documents(files)
    # response_dict['file_output'] = file_output

    return jsonify({
        "question": question,
        "response": response_dict
    })


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

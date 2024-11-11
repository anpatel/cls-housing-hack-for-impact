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


def query_specific_files_for_other_info(files):
    documents_to_query = []
    for file in files:
        file_name = file['file_name']
        document_path = "../data/output/" + file_name
        documents_to_query.append(document_path)
    print('documents_to_query', documents_to_query)

    legal_basis = initialize_document_index('argument_result_search', documents_to_query).query(
        'pretend i am an attorney starting to research a new case. based on the context you have in your knowledge base, please provide a legal basis citing relevant housing ordinances from East Palo Alto and Mountain View. please ensure citations are no longer than 100 words each, and include the citation sources case title and year.').response
    issue_type = initialize_document_index('argument_result_search', documents_to_query).query(
        'based on the context you have in your knowledge base, what is the issue type (such as "mold" or "water leak") of this case? please just provide a phrase.').response
    reasonable_outcomes = initialize_document_index('argument_result_search', documents_to_query).query(
        'based on relevant past cases, what are the reasonable outcomes of this case? select 1-3 options between: "File a Petition," "Issue Demand Letter," or "Seek Mediation")').response

    dict_response = {
        'legal_basis': legal_basis,
        'issue_type': issue_type,
        'reasonable_outcomes': reasonable_outcomes
    }
    return dict_response


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

    # a legal basis citing relevant housing ordinances from East Palo Alto and Mountain View in your knowledge base
    legal_argument = 'pretend i am an attorney. help me make a legal argument for the new client, providing me with 1-2 of the most compelling, robust legal arguments. each of the 1-2 arguments should be fewer than 50 words. base your arguments off of the relevant local ordinances and the specifics about the client. ensure your 1-2 arguments are highly specific and cite previous relevant cases/stats in your knowledge base. client information: ' + \
        data['question']

    response = query_engine.query(legal_argument)
    topic_response = 'please give me a title for a document for a client with client information: ' + \
        data['question']
    files = get_file_names_and_paths_from_response(response)

    response_dict = {}
    response_dict['legal_argument'] = response.response

    other_info = query_specific_files_for_other_info(files)

    response_dict['legal_basis'] = other_info['legal_basis']
    response_dict['issue_type'] = other_info['issue_type']
    response_dict['reasonable_outcomes'] = other_info['reasonable_outcomes']
    response_dict['files'] = files
    response_dict['topic'] = initialize_document_index(
        'argument_result_search', files).query(topic_response).response
    response_dict['case_type'] = 'Habitability Issue -- Pest Infestation and Mold'

    print('response_dict', response_dict)

    # file_output = query_specific_documents(files)
    # response_dict['file_output'] = file_output

    return jsonify({
        "question": legal_argument,
        "response": response_dict
    })


@app.route('/api/chat', methods=['POST'])
def chat_query():  # renamed function to avoid duplicate
    query_engine = initialize_query_engine()
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "No question provided"}), 400

    # Construct question with background info
    question_answer = (
        "I am an attorney. Please answer the user's questions about their case "
        "based on the following background information:\n"
        f"{data['info']}\n\nQuestion: {data['question']}"
    )

    response = query_engine.query(question_answer)
    print('response', response)

    return jsonify({
        "answer": response.response
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

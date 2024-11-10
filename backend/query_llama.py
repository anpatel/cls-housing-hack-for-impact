from flask import Flask, jsonify, request
from flask_cors import CORS
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
from llama_index.llms.openai import OpenAI
import os.path

app = Flask(__name__)
CORS(app)


def initialize_query_engine():
    llm = OpenAI(temperature=0, model="gpt-4")
    PERSIST_DIR = "../Data/storage"
    file_map = {}

    if not os.path.exists(PERSIST_DIR):
        documents = SimpleDirectoryReader(
            "/Users/swimmingcircle/Code/cls-housing-hack-for-impact/Data/output").load_data()
        index = VectorStoreIndex.from_documents(
            documents,
            llm=llm,
        )
        index.storage_context.persist(persist_dir=PERSIST_DIR)
    else:
        storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
        index = load_index_from_storage(storage_context)
    index.llm = llm

    return index.as_query_engine(
        dense_similarity_top_k=3,
        sparse_similarity_top_k=3,
        alpha=0.5,
        enable_reranking=True,
    )

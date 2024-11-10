#!/usr/bin/env python3

import argparse
import os
from openai import OpenAI
from llama_index import GPTVectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext, load_index_from_storage
from llama_index.llms import OpenAI
from llama_index.embeddings import OpenAIEmbedding, TextEmbeddingsInference

llm = OpenAI(api_key="",
             temperature=0.1, model="gpt-4-0125-preview")
embed_model = OpenAIEmbedding(model="text-embedding-3-large")
service_context = ServiceContext.from_defaults(
    llm=llm, embed_model=embed_model)

DOCUMENTS = [
    '/Users/swimmingcircle/Code/cls-housing-hack-for-impact/Data/output/Decision Franklin v WPC 20230001 and 20230002.pdf.md',
]

INDEX_PATH = "vector_store"


def get_constructed_index():
    documents = SimpleDirectoryReader(
        input_dir='./output', recursive=True, required_exts=[".txt"]).load_data()

    for document in DOCUMENTS:
        documents.extend(SimpleDirectoryReader(
            input_dir=document,
            recursive=True,
            required_exts=[".txt"]).load_data()
        )

    index = GPTVectorStoreIndex(documents, service_context=service_context)
    index.storage_context.persist(INDEX_PATH)
    return index


def get_index():
    is_file = os.path.exists(INDEX_PATH)
    if is_file is True:
        return load_index_from_storage(
            storage_context=StorageContext.from_defaults(
                persist_dir=INDEX_PATH),
            service_context=service_context
        )

    return get_constructed_index()


def query_docs(prompt):
    index = get_index()
    query_engine = index.as_query_engine()
    response = query_engine.query(
        prompt + ". Respond in succinct bullet points while including commands as relevant.")
    print(response)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", type=str)
    args = parser.parse_args()
    query_docs(args.prompt)

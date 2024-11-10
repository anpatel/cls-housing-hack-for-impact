import os.path
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
from llama_index.llms.openai import OpenAI

# Create OpenAI LLM with custom temperature
llm = OpenAI(temperature=0, model="gpt-4")

# check if storage already exists
PERSIST_DIR = "./Data/storage"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("output").load_data()
    index = VectorStoreIndex.from_documents(
        documents,
        llm=llm,  # Pass the LLM instance here
    )
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)
    # Update the LLM for the loaded index
    index.llm = llm

# Create query engine with the configured LLM
query_engine = index.as_query_engine(
    dense_similarity_top_k=3,
    sparse_similarity_top_k=3,
    alpha=0.5,
    enable_reranking=True,
)

# You can now ask questions about your documents
while True:
    question = input("what is the case")
    if question.lower() == 'quit':
        break
    response = query_engine.query(question)
    print("\nResponse:", response)
    print("\n" + "="*50 + "\n")

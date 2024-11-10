#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from llama_parse import LlamaParse
from llama_index.core import SimpleDirectoryReader

def set_api_key():
    os.environ['LLAMA_CLOUD_API_KEY'] = 'llx-FPkAQ4A0IJHzFrvjGEkjePjZUyMw7hbDA0CIEbMGIES7xE7Z'

def parse():
    # set up parser
    parser = LlamaParse(
        result_type="markdown"  # "markdown" and "text" are available
    )
    documents = SimpleDirectoryReader(
        input_dir='../input', 
        recursive=True, 
        num_files_limit=3,
        file_extractor={".pdf": parser}).load_data() 

    for doc in documents:
        # Create output filename based on document ID or other attributes
        output_filename = f"../output/{doc.metadata['file_name']}.txt" 

        with open(output_filename, "w") as f:
            f.write(doc.text)

if __name__ == "__main__":
    set_api_key()
    load_dotenv()
    parse()

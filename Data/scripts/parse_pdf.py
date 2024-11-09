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
        file_extractor={".pdf": parser}).load_data() 

    print(documents)

if __name__ == "__main__":
    set_api_key()
    load_dotenv()
    parse()


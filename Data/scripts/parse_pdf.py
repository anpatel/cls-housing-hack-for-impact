#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from llama_parse import LlamaParse
from llama_index.core import SimpleDirectoryReader


def set_api_key():
    os.environ['LLAMA_CLOUD_API_KEY'] = 'llx-UkLxMb9E3YBlRhgmE2PS5bW4VFbfwWRf6maOc1fE7qkxKMAL'


def parse():
    # set up parser
    parser = LlamaParse(
        result_type="markdown"  # "markdown" and "text" are available
    )
    documents = SimpleDirectoryReader(
        input_dir='../input/ordinances',
        recursive=True,
        num_files_limit=100,
        file_extractor={".pdf": parser}).load_data()

    for doc in documents:
        # Create output filename based on document ID or other attributes
        output_filename = f"../output/ordinances/{doc.metadata['file_name']}.txt"
        print('file_name', doc.metadata['file_name'])

        with open(output_filename, "w") as f:
            f.write(doc.text)


if __name__ == "__main__":
    set_api_key()
    load_dotenv()
    parse()

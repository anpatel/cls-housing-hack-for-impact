import PyPDF2


def pdf_to_text(pdf_path, output_txt_path):
    """
    Convert a PDF file to text and save it to a txt file

    Args:
        pdf_path (str): Path to the input PDF file
        output_txt_path (str): Path where the output text file will be saved
    """
    try:
        # Open the PDF file in read-binary mode
        with open(pdf_path, 'rb') as pdf_file:
            # Create a PDF reader object
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            # Extract text from all pages
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text()

            # Write the extracted text to a file
            with open(output_txt_path, 'w', encoding='utf-8') as txt_file:
                txt_file.write(text)

        return True
    except Exception as e:
        print(f"Error converting PDF to text: {str(e)}")
        return False


if __name__ == "__main__":
    # Example usage
    pdf_path = "path/to/your/pdf/file.pdf"
    output_txt_path = "path/to/output/text/file.txt"

    success = pdf_to_text(pdf_path, output_txt_path)
    if success:
        print("PDF successfully converted to text")
    else:
        print("Failed to convert PDF to text")

from pdf2image import convert_from_path
import pytesseract
from docx import Document
import os


def pdf_to_doc(pdf_path, output_doc_path):
    try:
        # Convert PDF to images
        print("Converting PDF to images...")
        images = convert_from_path(pdf_path)

        # Create a new Word document
        doc = Document()
        total_pages = len(images)

        for i, image in enumerate(images):
            print(f"Processing page {i+1} of {total_pages}...")
            page_text = pytesseract.image_to_string(image)

            # Add text to document, with page breaks between pages
            if i > 0:
                doc.add_page_break()
            doc.add_paragraph(page_text)

        # Save the document
        doc.save(output_doc_path)
        print(f"Successfully converted PDF to DOC format")
        return True

    except Exception as e:
        print(f"Error converting PDF to DOC: {str(e)}")
        return False


if __name__ == "__main__":
    # Update the output path to .docx
    pdf_path = "/Users/swimmingcircle/Code/cls-housing-hack-for-impact/Data/input/2023-01-23 Rent Boards Finding and Decisions Appeal Case 2021056 - 2070 Glen Way Apartment F (1).pdf"
    output_doc_path = "/Users/swimmingcircle/Code/cls-housing-hack-for-impact/Data/output/2023-01-23 Rent Boards Finding and Decisions Appeal Case 2021056 - 2070 Glen Way Apartment F (1).docx"

    success = pdf_to_doc(pdf_path, output_doc_path)
    if success:
        print("PDF successfully converted to DOC")
    else:
        print("Failed to convert PDF to DOC")

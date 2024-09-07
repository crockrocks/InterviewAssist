import fitz  
import re

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def parse_resume(text):
    parsed_data = {}

    # Extract Name
    name_match = re.search(r"^[A-Z][a-zA-Z]+\s[A-Z][a-zA-Z]+", text, re.MULTILINE)
    parsed_data["name"] = name_match.group(0) if name_match else "Not found."

    # Extract Phone Number
    phone_match = re.search(r"\+?\d[\d -]{8,}\d", text)
    parsed_data["phone"] = phone_match.group(0) if phone_match else "Not found."

    # Extract Email
    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    parsed_data["email"] = email_match.group(0) if email_match else "Not found."

    # Extract LinkedIn URL
    linkedin_match = re.search(r"(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9\-/]+", text)
    parsed_data["linkedin"] = linkedin_match.group(0) if linkedin_match else "Not found."

    # Extract Sections
    sections = {
        "skills": r"(Skills|Technical Skills|Key Skills|Core Competencies|Strengths)([\s\S]+?)(Experience|Certifications|Education|$)",
        "experience": r"(Experience|Work Experience|Employment History)([\s\S]+?)(Certifications|Skills|Education|$)",
        "certifications": r"(Certifications|Licenses|Certifications and Licenses)([\s\S]+?)(Experience|Skills|Education|$)",
        "education": r"(Education|Academic Background|Qualifications)([\s\S]+?)(Experience|Certifications|Skills|$)",
    }

    for section, pattern in sections.items():
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        parsed_data[section] = match.group(2).strip() if match else "Not found."

    return parsed_data

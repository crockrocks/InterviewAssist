import fitz  
import re
import os

def extract_text_from_pdf(pdf_path):
    """Extracts all the text from a given PDF."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def parse_resume(text):
    """Parses relevant sections like name, phone, email, LinkedIn, skills, experience, certifications, and education."""
    parsed_data = {}

    name_match = re.search(r"^[A-Z][a-zA-Z]+\s[A-Z][a-zA-Z]+", text, re.MULTILINE)
    parsed_data["name"] = name_match.group(0) if name_match else "Not found."

    phone_match = re.search(r"\+?\d[\d -]{8,}\d", text)
    parsed_data["phone"] = phone_match.group(0) if phone_match else "Not found."


    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    parsed_data["email"] = email_match.group(0) if email_match else "Not found."

    linkedin_match = re.search(r"(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9\-/]+", text)
    parsed_data["linkedin"] = linkedin_match.group(0) if linkedin_match else "Not found."

    # Extract skills
    skills_match = re.search(r"(Skills|Technical Skills|Key Skills|Core Competencies|Strengths|TECHNICAL SKILLS)(?::|\n+)([\s\S]+?)(?=\n\s*\n|Experience|Certifications|Education|$)", text, re.IGNORECASE)
    parsed_data["skills"] = skills_match.group(2).strip() if skills_match else "Not found."

    sections = {
        "experience": r"(Experience|Work Experience|Employment History)([\s\S]+?)(?=\n\s*\n|Certifications|Skills|Education|$)",
        "certifications": r"(Certifications|Licenses|Certifications and Licenses)([\s\S]+?)(?=\n\s*\n|Experience|Skills|Education|$)",
        "education": r"(Education|Academic Background|Qualifications)([\s\S]+?)(?=\n\s*\n|Experience|Certifications|Skills|$)",
    }

    for section, pattern in sections.items():
        match = re.search(pattern, text, re.IGNORECASE)
        parsed_data[section] = match.group(2).strip() if match else "Not found."

    return parsed_data

def save_parsed_resume(parsed_data):
    """Saves the parsed resume data to a .txt file."""
    name = parsed_data["name"]
    file_name = f"{name}.txt" if name != "Not found." else "parsed_resume.txt"
    
    with open(file_name, "w", encoding="utf-8") as file:
        for section, content in parsed_data.items():
            file.write(f"{section.capitalize()}:\n{content}\n\n")
    
    print(f"Resume details saved to {file_name}")

if __name__ == "__main__":
    pdf_path = 'latest_resume.pdf'
    
    if os.path.exists(pdf_path):
        text = extract_text_from_pdf(pdf_path)
        parsed_data = parse_resume(text)
        save_parsed_resume(parsed_data)
    else:
        print(f"File {pdf_path} not found.")

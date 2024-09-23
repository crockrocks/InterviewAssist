import fitz
import re
import os
import json
from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from config import Config

def extract_text_from_pdf(pdf_path):
    """Extracts all the text from a given PDF."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def initialize_llm():
    os.environ["GROQ_API_KEY"] = Config.GROQ_AI_KEY
    return ChatGroq(
        model="llama-3.1-70b-versatile",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

def create_prompt_template():
    prompt_template = """
    You are an expert resume parser. Your task is to extract relevant information from the given resume text and format it according to the specified structure. Resume text may vary in format, so please extract the information based on the following definitions.

    - Name: Usually the first line, typically a person’s name.
    - Email: Text containing '@'.
    - Phone: Typically a number starting with a '+' sign or a 10-digit number.
    - Position: Mentioned job title, if any.
    - LinkedIn URL: URL starting with 'linkedin.com'.
    - GitHub URL: URL starting with 'github.com'.
    - Skills: A list of skills, often under headings like 'Skills' or 'Technical Skills'.
    - Experiences: A list of professional experiences, often under headings like 'Experience', with details about company, duration, and responsibilities.
    - Education: A list of educational qualifications, often under 'Education' heading, with institution name, degree, and year.
    - Projects: A list of projects, typically with a name and brief description.
    - Certifications: Certifications or courses completed, if mentioned.

    Extract and format the following information:

    1. Name
    2. Email
    3. Phone
    4. Position (if mentioned, otherwise leave blank)
    5. LinkedIn URL
    6. GitHub URL
    7. Skills (as a list)
    8. Experiences (as a list of dictionaries with company, duration, and responsibilities)
    9. Education (as a list of dictionaries with institution, degree, and year)
    10. Projects (as a list of dictionaries with name and details)
    11. Certifications (as a string, each on a new line)
    12. Cover Letter (if present, otherwise leave blank)

    Please return the output as a JSON object that can be directly parsed by a web application. Ensure all fields are present, even if some are empty.

    Resume Text:
    {resume_text}

    """
    return PromptTemplate(
        template=prompt_template,
        input_variables=["resume_text"]
    )

def initialize_llm_chain(llm, prompt_template):
    return LLMChain(llm=llm, prompt=prompt_template, verbose=True)

import re

def parse_resume(text):
    llm = initialize_llm()
    prompt_template = create_prompt_template()
    llm_chain = initialize_llm_chain(llm, prompt_template)
    response = llm_chain.invoke({"resume_text": text})
    raw_response = response.get('text', '')
    if not raw_response:
        print("Error: LLM did not return any text.")
        return {}
    clean_response = re.sub(r'```(?:json)?', '', raw_response).strip()
    try:
        json_start = clean_response.find('{')
        json_end = clean_response.rfind('}') + 1

        if json_start == -1 or json_end == -1:
            raise ValueError("No valid JSON found in the response.")

        json_content = clean_response[json_start:json_end]
        parsed_data = json.loads(json_content)
        return parsed_data
    except (json.JSONDecodeError, ValueError) as e:
        print(f"JSON parsing failed: {e}")
    print("Unable to parse the response.")
    return {}


def save_parsed_resume(parsed_data):
    """Saves the parsed resume data to a JSON file."""
    name = parsed_data.get("name", "Unknown")
    file_name = f"{name}_parsed_resume.json" if name else "parsed_resume.json"

    with open(file_name, "w", encoding="utf-8") as file:
        json.dump(parsed_data, file, indent=2)

    print(f"Resume details saved to {file_name}")


if __name__ == "__main__":
    resume_text = """
    Random random
    Random
    Ó 182091283
    R random@gmail.com
    EXPERIENCE
    PharynxAI
    June 2024 – Present
    • Junior AI/ML Engineer, Designed Generative AI workflows using ComfyUI, enhancing tasks such as cloth inpainting, image
    upscaling, and video creation, leading to a 20% increase in processing efficiency.
    • Refined open-source projects by optimizing code, integrating state-of-the-art models, and implementing solutions on platforms
    like Runpod and Hugging Face, reducing deployment time by 30%.
    Deepmindz Innovations
    Jan 2024 – June 2024
    • AI/ML Intern, Contributed to developing and optimizing Generative AI workflows using ComfyUI and Automatic 1111, which
    improved image generation and upscaling quality.
    """

    parsed_resume = parse_resume(resume_text)
    save_parsed_resume(parsed_resume)

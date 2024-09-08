from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
import json
import re
import pymongo
import os
from bson import ObjectId
from config import Config
from langchain_groq import ChatGroq

# Initialize the LLM
def initialize_llm():
    os.environ["GROQ_API_KEY"] = Config.GROQ_AI_KEY
    return ChatGroq(
        model="llama-3.1-70b-versatile",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

# Create a prompt template for generating technical summaries
def create_prompt_template():
    prompt_template = """
    You are a hiring expert and your task is to create a concise technical summary of the candidate based on the following schema.

    Table schema: {table_schema}
    Schema Description: {schema_description}

    Here is the candidate's data:
    {candidate_data}

    Based on this information, create a technical summary highlighting their relevant skills, experience, certifications, and education for the position they are applying for.

    Return only the technical summary.
    """
    return PromptTemplate(
        template=prompt_template,
        input_variables=["candidate_data", "table_schema", "schema_description"]
    )

# Initialize the LLM Chain
def initialize_llm_chain(llm, prompt_template):
    return LLMChain(llm=llm, prompt=prompt_template, verbose=True)

# Convert MongoDB data to JSON serializable format
def make_serializable(data):
    if isinstance(data, dict):
        return {key: make_serializable(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [make_serializable(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Generate the technical summary for a given candidate
def generate_summary(candidate_data):
    llm = initialize_llm()
    prompt_template = create_prompt_template()
    llmchain = initialize_llm_chain(llm, prompt_template)

    # Convert the candidate data to a JSON-serializable format
    serializable_data = make_serializable(candidate_data)

    response = llmchain.invoke({
        "candidate_data": json.dumps(serializable_data, indent=2),
        "table_schema": Config.TABLE_SCHEMA,
        "schema_description": Config.SCHEMA_DESCRIPTION
    })

    # Clean up and return the response
    response_text = response['text'].replace("Output: ", "")
    return response_text.strip()

# Retrieve the candidate collection from MongoDB
def get_collection():
    client = pymongo.MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    return db[Config.COLLECTION_NAME]

# Fetch candidate data by name or any other query field
def get_candidate_data(query):
    collection = get_collection()
    candidate_data = collection.find_one(query)
    return candidate_data

if __name__ == "__main__":
    # Example usage
    query = {"name": {"$regex": "Harshit", "$options": "i"}}  # You can customize this query
    candidate_data = get_candidate_data(query)

    if candidate_data:
        summary = generate_summary(candidate_data)
        print("Technical Summary:\n", summary)
    else:
        print("Candidate not found.")

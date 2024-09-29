from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
import json
import os
from langchain_groq import ChatGroq
from config import Config
import pymongo 

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

# Create a prompt template for matching, scoring, and overall assessment with skill similarity understanding
def summary_and_scores():
    prompt_template = """

    You are an expert in assessing candidates and expert profiles. Your task is to provide a detailed matching score between a candidate, the expert's profile, and the job description.

    Job Description: {job_description}

    Candidate's Skills: {candidate_skills}

    Expert's Profile: {expert_profile}

    When calculating the scores, take into account synonyms, related terms, and skills that may be phrased differently but refer to the same or similar competencies. For example, if the candidate lists "AI/ML" but the job description or expert's profile mentions "Artificial Intelligence," consider these as similar skills. Similarly, consider synonyms and related concepts across technical skills (e.g., "Machine Learning" and "ML") and soft skills (e.g., "Leadership" and "Team Leadership").

    Calculate:
    - Matching Similarity Score (between candidate's skills and expert's profile, considering skill similarities and synonyms)
    - Relevancy Score (based on candidate's skills with the job description, factoring in related skills and terms)
    - Profile Score (overall suitability of the candidate for the job)
    - Overall Score (combination of expert match, job relevance, and candidate suitability)

    Provide these scores as follows:
    Matching Similarity Score: X/100
    Relevancy Score: Y/100
    Profile Score: Z/100
    Overall Score: O/100

    Additionally, provide a brief explanation detailing why the candidate is a good fit for the job, emphasizing the alignment of technical and soft skills with both the job description and the expert's domain. Finally, recommend which expert interview should be scheduled based on the candidate's profile and the expert's expertise.
    and return only the  Matching Similarity Score, Relevancy Score, Profile Score, Overall Score, the recommendation and the overall brief summary of why candidate is good for the job.
    """
    return PromptTemplate(
        template=prompt_template,
        input_variables=["job_description", "candidate_skills", "expert_profile"]


    )
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

# Initialize the LLMChain with the new prompt template
def initialize_llm_chain(llm, prompt_template):
    return LLMChain(llm=llm, prompt=prompt_template, verbose=True)

# Generate skills matching and relevancy explanation with scores
def summary_match(candidate_skills, job_description, expert_profile):
    llm = initialize_llm()
    prompt_template = summary_and_scores()
    llmchain = initialize_llm_chain(llm, prompt_template)

    # Call the LLM to generate the scores and summary
    response = llmchain.invoke({
        "candidate_skills": candidate_skills,
        "job_description": job_description,
        "expert_profile": expert_profile
    })

    # Clean up and return the response with scores and summary
    response_text = response['text']
    return response_text.strip()

#function to generate a match for a well-aligned candidate and expert profile
def generate_match(job_description, expert_profile, candidate_query):
    candidate_data = get_candidate_data(candidate_query)
    if not candidate_data:
        return "Candidate not found."
    candidate_skills = candidate_data.get('skills', '')
    match_summary = summary_match(json.dumps(candidate_skills, indent=2), job_description, expert_profile)
    return match_summary

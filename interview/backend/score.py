from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
import json
import os
from langchain_groq import ChatGroq
from config import Config
import traceback

def initialize_llm():
    os.environ["GROQ_API_KEY"] = Config.GROQ_AI_KEY
    return ChatGroq(
        model="llama-3.1-70b-versatile",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

def summary_and_scores():
    prompt_template = """
    You are an expert in assessing candidates and expert profiles. Your task is to provide a detailed matching score between a candidate, the expert's profile, and the job description.

    Job Description: {job_description}

    Candidate's Profile:
    {candidate_profile}

    Expert's Profile:
    {expert_profile}

    When calculating the scores, take into account synonyms, related terms, and skills that may be phrased differently but refer to the same or similar competencies. Consider both technical skills and soft skills.

    Calculate the following scores:
    1. Matching Similarity Score (0-100): Assess how well the candidate's skills and experience match the expert's profile.
    2. Relevancy Score (0-100): Evaluate how relevant the candidate's skills and experience are to the job description.
    3. Profile Score (0-100): Determine the overall strength of the candidate's profile for the job.
    4. Overall Score (0-100): Combine the above scores to give an overall assessment.

    Provide these scores as follows:
    Matching Similarity Score: X/100
    Relevancy Score: Y/100
    Profile Score: Z/100
    Overall Score: O/100

    Additionally, provide a brief explanation (2-3 sentences) detailing why the candidate is a good fit for the job, emphasizing the alignment of technical and soft skills with both the job description and the expert's domain.
    Finally, recommend which expert interview should be scheduled based on the candidate's profile and the expert's expertise.
    Return only the Matching Similarity Score, Relevancy Score, Profile Score, Overall Score, the recommendation, and the overall brief summary of why the candidate is good for the job.
    """
    return PromptTemplate(
        template=prompt_template,
        input_variables=["job_description", "candidate_profile", "expert_profile"]
    )

def initialize_llm_chain(llm, prompt_template):
    return LLMChain(llm=llm, prompt=prompt_template, verbose=True)

def format_profile(profile):
    try:
        formatted = f"""
        Name: {profile['name']}
        Email: {profile['email']}
        Phone: {profile['phone']}
        Position: {profile['position']}
        LinkedIn: {profile.get('linkedin', 'Not provided')}
        GitHub: {profile.get('github', 'Not provided')}
        Skills: {', '.join(profile['skills'])}
        Experience:
        {format_experiences(profile['experiences'])}
        Projects:
        {format_projects(profile['projects'])}
        Education:
        {format_education(profile['educations'])}
        Certifications: {', '.join(profile.get('certifications', []))}
        """
        return formatted.strip()
    except Exception as e:
        print(f"Error in format_profile: {str(e)}")
        print(f"Profile data: {profile}")
        raise

def format_experiences(experiences):
    return '\n'.join([f"- {exp['company']} ({exp['duration']}):\n  " + '\n  '.join(exp['responsibilities']) for exp in experiences])

def format_projects(projects):
    return '\n'.join([f"- {proj['name']}:\n  " + '\n  '.join(proj['details']) for proj in projects])

def format_education(educations):
    return '\n'.join([f"- {edu['degree']} from {edu['institution']} ({edu['year']})" for edu in educations])

def summary_match(candidate_profile, job_description, expert_profile):
    try:
        llm = initialize_llm()
        prompt_template = summary_and_scores()
        llmchain = initialize_llm_chain(llm, prompt_template)

        formatted_candidate_profile = format_profile(candidate_profile)
        formatted_expert_profile = format_profile(expert_profile) if expert_profile else "No expert profile provided"

        response = llmchain.invoke({
            "candidate_profile": formatted_candidate_profile,
            "job_description": job_description,
            "expert_profile": formatted_expert_profile
        })

        response_text = response['text']
        return response_text.strip()
    except Exception as e:
        print(f"Error in summary_match: {str(e)}")
        print(traceback.format_exc())
        raise

def parse_scores(match_result):
    scores = {}
    for line in match_result.split('\n'):
        if ':' in line:
            key, value = line.split(':')
            try:
                scores[key.strip()] = float(value.strip().split('/')[0])
            except ValueError:
                print(f"Error parsing score: {line}")
    return scores
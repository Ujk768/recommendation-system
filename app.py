from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process, fuzz
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter

app = FastAPI()

USER_DB = {}

class UserPreferences(BaseModel):
    email: str
    password: str
    interests: list[str]
    skillLevel: str
    timeCommitment: str
    learningGoal: str

class LoginRequest(BaseModel):
    email: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold model + data
df = None
cosine_sim = None
tfidf = None
tfidf_matrix = None
indices = None


# --------------------------
# Helper functions
# --------------------------
def find_best_match(query, titles, limit=1, threshold=60):
    matches = process.extract(query, titles, scorer=fuzz.token_sort_ratio, limit=limit)
    return [m[0] for m in matches if m[1] >= threshold]


import numpy as np
import pandas as pd

def recommend_for_user(inputs, n=10):
    global df, cosine_sim, tfidf, tfidf_matrix, indices

    # 1. Clean inputs
    clean_inputs = [text.strip() for text in inputs if text.strip()]
    if not clean_inputs:
        return []
    
    matched_courses = []
    candidate_lists = []

    # 2. Process each input INDIVIDUALLY
    for text in clean_inputs:
        # Reset scores for this specific input
        sim_scores = np.zeros(df.shape[0])
        input_found = False
        
        # Check Exact Match
        if text in indices:
            matched_courses.append(text)
            idx = indices[text]
            sim_scores = cosine_sim[idx] # No +=, just =
            input_found = True
            
        # Check Fuzzy Match
        elif not input_found:
            fuzzy_matches = find_best_match(text, df['course_title'].tolist(), limit=1)
            if fuzzy_matches:
                best_match = fuzzy_matches[0]
                matched_courses.append(best_match) # Track matches to exclude later
                idx = indices[best_match]
                sim_scores = cosine_sim[idx]
                input_found = True

        # Check Keyword/Topic Match
        if not input_found:
            query_vec = tfidf.transform([text])
            # flatten() is important to make it a 1D array
            sim_scores = cosine_similarity(query_vec, tfidf_matrix).flatten() 
            input_found = True

        # Apply Popularity Weighting to this specific input's scores
        sim_scores = sim_scores * (0.7 + 0.3 * df['popularity_weight'])

        # Get the indices of the top N courses for THIS input
        # We grab slightly more than n (n+5) to account for overlaps/duplicates
        top_indices = sim_scores.argsort()[::-1][:n+5]
        
        # Store the actual rows for this input
        candidate_lists.append(df.iloc[top_indices])

    # 3. Interleave (Round-Robin) the results
    final_results = []
    seen_titles = set(matched_courses) # Don't recommend inputs back to user
    
    # We loop enough times to try and fill 'n' recommendations
    max_len = max(len(c) for c in candidate_lists) if candidate_lists else 0
    
    for i in range(max_len):
        for candidates in candidate_lists:
            # Stop if we have enough
            if len(final_results) >= n:
                break
            
            # Check if this list has a candidate at index i
            if i < len(candidates):
                row = candidates.iloc[i]
                title = row['course_title']
                
                # Add if distinct
                if title not in seen_titles:
                    final_results.append(row.to_dict())
                    seen_titles.add(title)
        
        if len(final_results) >= n:
            break

    return final_results


# --------------------------
# Load dataset on startup
# --------------------------
@app.on_event("startup")
def load_model():
    global df, cosine_sim, tfidf, tfidf_matrix, indices

    df = pd.read_csv("udemy_courses.csv")

    df["combined_features"] = (
        df["course_title"].fillna('') + " " +
        df["subject"].fillna('') + " " +
        df["level"].fillna('')
    )

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(df["combined_features"])

    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    indices = pd.Series(df.index, index=df["course_title"]).drop_duplicates()

    df['popularity_weight'] = df['num_subscribers'] / df['num_subscribers'].max()

    print("Model Loaded Successfully!")


# --------------------------
# Request Model
# --------------------------
class RecommendInput(BaseModel):
    inputs: list[str]
    n: int = 10


# --------------------------
# Routes
# --------------------------

@app.post("/signup")
def signup_user(data: UserPreferences):
    USER_DB[data.email] = data.dict()   # Store preferences in memory
    return {"message": "User signed up successfully"}

@app.post("/login")
def login_user(data: LoginRequest):
    email = data.email
    if email not in USER_DB:
        return {"preferences": None}   # new user

    return {"preferences": USER_DB[email]}



# ✅ Route 1: GET ALL COURSES - simple return all courses
@app.get("/getAllCourses")
def get_all_courses():
    return {"courses": df.to_dict(orient="records")} 
# df[["course_id","course_title","url","is_paid","price","num_subscribers","num_reviews"]].to_dict(orient="records")


# ✅ Route 2: RECOMMEND COURSES
@app.post("/recommend")
def recommended_courses(data: RecommendInput):
    output = recommend_for_user(data.inputs, data.n)
    return {"recommendations": output}

# Route 3: Get All Courses with pagination

@app.get("/courses")
def get_all_courses(limit: int = 15, page: int = 1):
    """
    limit = how many courses to return (user can change this)
    page  = which batch to return
    """
    start = (page - 1) * limit
    end = start + limit

    data = df.iloc[start:end]

    return {
        "page": page,
        "limit": limit,
        "total_courses": len(df),
        "courses": data.to_dict(orient="records")
    }


def is_relevant(user_inputs, course_row):
    """
    Checks if the user's input exists in the Course Subject OR Title.
    Returns: Boolean (True/False)
    """
    # 1. Prepare data (lowercase for case-insensitive matching)
    subject = str(course_row.get('subject', '')).lower()
    title = str(course_row.get('course_title', '')).lower()
    
    # 2. Check each user input
    for keyword in user_inputs:
        term = keyword.lower().strip()
        
        # Check if keyword appears in Subject (Primary Check)
        if term in subject:
            return True
            
        # Check if keyword appears in Title (Secondary Check - Fallback)
        # This helps if the Subject is generic (e.g., "Development") but Title has "Python"
        if term in title:
            return True
            
    return False

class MetricsResponse(BaseModel):
    precision_score: float
    matches: int
    total_recommendations: int
    subject_distribution: dict
    diversity_score: float

@app.post("/get-metrics")
def get_recommendation_metrics(data: RecommendInput):
    """
    Calculates system performance for a specific set of inputs 
    without needing historical user data.
    """
    
    # 1. Run the recommendation logic 
    # (We re-run it here to analyze the output)
    recommendations = recommend_for_user(data.inputs, data.n)
    
    if not recommendations:
        return {
            "error": "No recommendations generated for these inputs."
        }

    # 2. Initialize Counters
    relevant_count = 0
    total_items = len(recommendations)
    subjects_found = []

    # 3. Analyze every recommendation
    for rec in recommendations:
        # Track the subject for distribution analysis
        subj = rec.get('subject', 'Unknown')
        subjects_found.append(subj)
        
        # Check if this specific recommendation matches the user's input
        if is_relevant(data.inputs, rec):
            relevant_count += 1

    # 4. Calculate Precision (Relevance Score)
    # Formula: Relevant Items / Total Recommended Items
    precision = round(relevant_count / total_items, 2) if total_items > 0 else 0.0

    # 5. Calculate Diversity Score (Unique Subjects / Total Items)
    # 1.0 means every course is from a different subject (High Diversity)
    # 0.1 means all courses are from the same subject (Low Diversity)
    unique_subjects = len(set(subjects_found))
    diversity = round(unique_subjects / total_items, 2) if total_items > 0 else 0.0

    return {
        "input_keywords": data.inputs,
        "metrics": {
            "precision_score": precision,  # Closer to 1.0 is better
            "matches": relevant_count,
            "total_recommendations": total_items,
            "diversity_score": diversity   # Context dependent (Usually 0.2-0.5 is good)
        },
        "subject_distribution": dict(Counter(subjects_found))
    }
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process, fuzz
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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


def recommend_for_user(inputs, n=10):
    global df, cosine_sim, tfidf, tfidf_matrix, indices

    sim_scores = np.zeros(df.shape[0])
    matched_courses = []
    valid_inputs = 0

    for text in inputs:
        text = text.strip()
        if not text:
            continue

        if text in indices:
            matched_courses.append(text)
            idx = indices[text]
            sim_scores += cosine_sim[idx]
            valid_inputs += 1
            continue

        fuzzy_matches = find_best_match(text, df['course_title'].tolist(), limit=1)
        if fuzzy_matches:
            best_match = fuzzy_matches[0]
            idx = indices[best_match]
            sim_scores += cosine_sim[idx]
            valid_inputs += 1
            continue

        query_vec = tfidf.transform([text])
        topic_sim = cosine_similarity(query_vec, tfidf_matrix).flatten()
        sim_scores += topic_sim
        valid_inputs += 1

    if valid_inputs == 0:
        return []

    sim_scores /= valid_inputs
    sim_scores = sim_scores * (0.7 + 0.3 * df['popularity_weight'])

    sorted_idx = sim_scores.argsort()[::-1]
    result = df.iloc[sorted_idx]

    result = result[~result['course_title'].isin(matched_courses)]
    result = result.head(n)

    return result.to_dict(orient="records")


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

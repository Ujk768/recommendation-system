import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process, fuzz   # faster fuzzy string matching

# Load dataset
df = pd.read_csv('udemy_courses.csv')

print(df.head())

# Combine text fields for TF-IDF feature
df['combined_features'] = (
    df['course_title'].fillna('') + ' ' +
    df['subject'].fillna('') + ' ' +
    df['level'].fillna('')
)

# TF-IDF vectorization
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])

# Cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
indices = pd.Series(df.index, index=df['course_title']).drop_duplicates()
df['popularity_weight'] = df['num_subscribers'] / df['num_subscribers'].max()


# ---------------------------
# Helper: fuzzy matching
# ---------------------------
def find_best_match(query, titles, limit=1, threshold=60):
    matches = process.extract(query, titles, scorer=fuzz.token_sort_ratio, limit=limit)
    # Return matches that are above threshold (out of 100)
    return [m[0] for m in matches if m[1] >= threshold]


# ---------------------------
# Main recommendation logic
# ---------------------------

def recommend_for_user(inputs, n=10):
    """Recommend new courses based on multiple user inputs (titles or topics)."""
    sim_scores = np.zeros(df.shape[0])
    matched_courses = []
    valid_inputs = 0

    for text in inputs:
        text = text.strip()
        if not text:
            continue

        # 1️⃣ Exact match
        if text in indices:
            matched_courses.append(text)
            idx = indices[text]
            sim_scores += cosine_sim[idx]
            valid_inputs += 1
            continue

        # 2️⃣ Fuzzy match (partial title)
        fuzzy_matches = find_best_match(text, df['course_title'].tolist(), limit=1)
        if fuzzy_matches:
            best_match = fuzzy_matches[0]
            print(f"🔍 '{text}' matched with course title: '{best_match}'")
            matched_courses.append(best_match)
            idx = indices[best_match]
            sim_scores += cosine_sim[idx]
            valid_inputs += 1
            continue

        # 3️⃣ Treat as topic query
        print(f"💡 Treating '{text}' as a topic...")
        query_vec = tfidf.transform([text])
        topic_sim = cosine_similarity(query_vec, tfidf_matrix).flatten()
        sim_scores += topic_sim
        valid_inputs += 1

    if valid_inputs == 0:
        print("❌ No valid inputs or matches found.")
        return pd.DataFrame()

    # Average similarity only for valid inputs
    sim_scores /= valid_inputs

    # Optional: add popularity weighting
    sim_scores = sim_scores * (0.7 + 0.3 * df['popularity_weight'])

    # Rank results
    sorted_idx = sim_scores.argsort()[::-1]
    result = df.iloc[sorted_idx]

    # Filter out already matched courses
    result = result[~result['course_title'].isin(matched_courses)]
    result = result[['course_title', 'subject', 'price', 'num_subscribers']].head(n)

    return result.reset_index(drop=True)



# ---------------------------
# Interactive interface
# ---------------------------
print("🎓 Personalized Course Recommendation System")
print("You can enter course titles or general topics (e.g. 'python', 'data science').")
print("Type 'done' when finished.\n")

user_inputs = []
while True:
    entry = input("Enter a course title or topic: ").strip()
    if entry.lower() == 'done':
        break
    user_inputs.append(entry)

print("\n📘 You entered:")
print(user_inputs)

recommendations = recommend_for_user(user_inputs, n=10)

if recommendations.empty:
    print("\n❌ No recommendations found.")
else:
    print("\n🎯 Recommended Courses:")
    print(recommendations)

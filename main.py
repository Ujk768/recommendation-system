import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
df = pd.read_csv('udemy_courses.csv')

# Combine relevant text features
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

# Map title to index
indices = pd.Series(df.index, index=df['course_title']).drop_duplicates()

df['popularity_weight'] = df['num_subscribers'] / df['num_subscribers'].max()

# Recommendation function
def recommend(query, n=5):
    # CASE 1: If query matches a course title
    if query in indices:
        idx = indices[query]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:n+1]
        course_indices = [i[0] for i in sim_scores]
        result = df[['course_title', 'subject', 'price', 'num_subscribers']].iloc[course_indices]
        return result.reset_index(drop=True)
    
    # CASE 2: If query is a general topic (e.g. "python", "data science")
    else:
        query_vec = tfidf.transform([query])
        sim_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()
        top_indices = sim_scores.argsort()[-n:][::-1]
        result = df[['course_title', 'subject', 'price', 'num_subscribers']].iloc[top_indices]
        result['similarity'] = sim_scores[top_indices]
        return result.reset_index(drop=True)

# ---------------------------
# Interactive user interface
# ---------------------------
print("🎓 Welcome to the Course Recommendation System!")
print("You can enter either a course title or a topic (e.g. 'Python', 'Machine Learning').")
print("Type 'exit' to quit.\n")

while True:
    topic = input("Enter a course title or topic: ").strip()
    if topic.lower() == 'exit':
        print("\n👋 Exiting the system. Goodbye!")
        break
    
    recommendations = recommend(topic, 5)
    if recommendations.empty:
        print("\n❌ No recommendations found.")
    else:
        print("\n📚 Recommended Courses:")
        print(recommendations[['course_title', 'subject', 'price', 'num_subscribers']])
    print("\n" + "-"*60 + "\n")

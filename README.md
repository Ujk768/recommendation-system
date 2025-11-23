**📚 Course Recommendation System**

A personalized course-recommendation platform built with FastAPI (Python) and React + Vite (TypeScript).
The system recommends Udemy courses based on user preferences, free-text inputs, fuzzy matching, keyword matching, and TF-IDF similarity.






**🚀 Features**




**🔐 Authentication & User Preferences**

- Login / Signup support

- User preferences stored in backend (in-memory DB for now)

- Auto-fetch user preferences on login

- Personalized recommendations based on:

- Interests

- Skill level

- Time commitment

- Learning goal

**🎯 Recommendation Engine**
- TF-IDF vectorization on course title + subject + level

- Cosine similarity ranking

- Fuzzy matching using RapidFuzz

- Keyword search fallback

- Popularity-weighted scoring

- Round-robin merging for diverse recommendations

**💻 Frontend (React + TypeScript)**

- Home Page (Login / Signup)

- Interactive Preference Questionnaire

- Personalized Recommendation Dashboard

- Clear user flow & state management

  
**🏗️ Tech Stack**
- Backend (FastAPI)

- FastAPI

- Pydantic

- pandas / numpy

- scikit-learn (TF-IDF + cosine similarity)

- rapidfuzz

- CORS enabled

Frontend (React + Vite)

- React (TypeScript)

- Axios for API communication

- TailwindCSS for UI

- lucide-react icons

**⚙️ Backend Setup (FastAPI)**

**1. Create & Activate Virtual Environment**

python -m venv venv
source venv/bin/activate       # macOS / Linux
venv\Scripts\activate          # Windows

**2. Install Dependencies**

fastapi
uvicorn
pandas
numpy
scikit-learn
rapidfuzz
python-multipart

**3. Start FastAPI Backend**

**uvicorn main:app --reload**

**Backend will run on:
http://127.0.0.1:8000**

**🧠 API Documentation**

**POST /signup**

Stores user preferences.

Body

{
  "email": "abc@mail.com",
  "password": "123456",
  "interests": ["Web Development", "Python"],
  "skillLevel": "beginner",
  "timeCommitment": "5-10",
  "learningGoal": "skill-upgrade"
}
**
POST /login**

Fetch saved user preferences.

Body

{
  "email": "abc@mail.com"
}


**POST /recommend**

Returns personalized course recommendations.

Body

{
  "inputs": ["python", "machine learning"],
  "n": 10
}


**GET /getAllCourses**

Returns the full course dataset.

**GET /courses?limit=15&page=2**

Paginated courses.


Frontend Setup (React + Vite)
1. Install dependencies
npm install

2. Start app
npm run dev


**Frontend runs at:
http://127.0.0.1:5173**

**🔗 Connecting Frontend & Backend**

The frontend uses Axios to call FastAPI:

await axios.post("http://127.0.0.1:8000/login", { email });


Ensure backend is running before opening the React app.

**🧪 How the Recommendation Algorithm Works**

1. User inputs or stored preferences are processed

2. System tries 3 matching strategies in order:

✔ Exact match by title

✔ Fuzzy match using RapidFuzz

✔ Keyword search using TF-IDF

3. Similarity scores are weighted by course popularity

4. Multiple input queries generate separate lists

5. All lists are combined using round-robin interleaving

6. Final unique top-N recommendations returned


**📸 Screenshots**

**Login Screen**

<img width="1915" height="921" alt="image" src="https://github.com/user-attachments/assets/cd2caea1-c722-42f4-8355-ef4826971560" />

**Sign Up Screen**

<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/8616604f-75a2-4624-adec-194cf93ca9e8" />

**Questionnaire Page**

<img width="1918" height="917" alt="image" src="https://github.com/user-attachments/assets/27348532-f265-4069-a539-fd2200853326" />

<img width="1913" height="915" alt="image" src="https://github.com/user-attachments/assets/400b6147-5a4a-4b39-9c9a-85fef7dedd6f" />

<img width="1918" height="917" alt="image" src="https://github.com/user-attachments/assets/786116d4-c101-4d5f-88c7-5500614317d9" />

<img width="1918" height="918" alt="image" src="https://github.com/user-attachments/assets/06b8be1e-61fa-4d24-9a7a-abcfd72a588f" />




**Recommendation Page**

<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/537ad48a-b649-41f2-b33f-b7b0e2ea0de2" />


**🚧 Future Improvements**

- Store user accounts in a real database (MongoDB / PostgreSQL)

- JWT-based authentication

- Improve recommendation model using:

-> Word embeddings

-> Collaborative filtering

-> Hybrid scoring

- Deploy backend + frontend using Docker

- Add search functionality on frontend






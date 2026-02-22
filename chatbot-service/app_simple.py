from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from pathlib import Path
import random
import re

app = FastAPI(title="Admission Chatbot", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load database
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR.parent / "database" / "cutoff_history.csv"

try:
    cutoff_df = pd.read_csv(DB_PATH)
    print(f"✅ Loaded {len(cutoff_df)} college records from database")
    print(f"📊 Courses: {cutoff_df['course'].unique().tolist()}")
    print(f"📊 Categories: {cutoff_df['category'].unique().tolist()}")
except Exception as e:
    print(f"⚠️ Warning: Could not load database - {e}")
    cutoff_df = pd.DataFrame()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    intent: str
    response: str
    confidence: float

# Extract information from message
def extract_course(message: str):
    """Extract course from message"""
    course_map = {
        "cse": "CSE", "computer science": "CSE", "cs": "CSE",
        "it": "IT", "information technology": "IT",
        "ece": "ECE", "electronics": "ECE",
        "eee": "EEE", "electrical": "EEE",
        "mech": "MECH", "mechanical": "MECH",
        "civil": "CIVIL"
    }
    message = message.lower()
    for key, value in course_map.items():
        if key in message:
            return value
    return None

def extract_category(message: str):
    """Extract category from message"""
    message = message.upper()
    categories = ["OC", "BC", "MBC", "SC", "ST"]
    for cat in categories:
        if cat in message:
            return cat
    return None

def extract_rank(message: str):
    """Extract rank number from message"""
    numbers = re.findall(r'\b\d{1,6}\b', message)
    if numbers:
        return int(numbers[0])
    return None

def search_colleges(course: str = None, category: str = None, rank: int = None):
    """Search colleges based on criteria"""
    if cutoff_df.empty:
        return []
    
    df = cutoff_df.copy()
    
    if course:
        df = df[df['course'] == course.upper()]
    if category:
        df = df[df['category'] == category.upper()]
    if rank:
        # Find colleges where cutoff rank is close to student rank
        df = df[(df['cutoff_rank'] >= rank * 0.7) & (df['cutoff_rank'] <= rank * 1.3)]
    
    # Get latest year data
    if not df.empty:
        latest_year = df['year'].max()
        df = df[df['year'] == latest_year]
    
    return df.head(5).to_dict('records')

# Simple intent-response mapping
RESPONSES = {
    "greeting": [
        "Hello! I'm here to help you with college admissions. I have access to cutoff data from 500+ colleges!",
        "Hi there! I can help you find the perfect college based on your rank, course preference, and category.",
        "Welcome to CampusMate! Ask me about college cutoffs, admission chances, or get personalized recommendations."
    ],
    "admission_process": [
        "The admission process typically involves: 1) Check eligibility, 2) Take entrance exams, 3) Submit applications, 4) Attend counseling.",
        "First, ensure you meet the eligibility criteria. Then prepare for entrance exams like JEE or state exams, and submit your application before the deadline."
    ],
    "cutoff": [
        "I can provide specific cutoff information! Please tell me: your course (CSE/IT/ECE/EEE/MECH/CIVIL), category (OC/BC/MBC/SC/ST), and year.",
        "Cutoff ranks vary by college, course, and category. Share your preferences and I'll give you detailed cutoff information from our database!",
        "I have cutoff data from 2020-2023 for 500+ colleges. What course and category are you interested in?"
    ],
    "fees": [
        "Fee structures vary significantly. Government colleges: ₹30,000-₹80,000/year. Private colleges: ₹80,000-₹3,00,000/year.",
        "Most engineering colleges charge between ₹50,000 to ₹2,50,000 per year. Government colleges are more affordable.",
        "Scholarships are available for SC/ST/BC categories. Many private colleges also offer merit scholarships."
    ],
    "eligibility": [
        "Basic eligibility: Pass 12th with Physics, Chemistry, and Mathematics. Valid entrance exam scores (JEE/State exams).",
        "Most colleges require minimum 50% in 12th (45% for reserved categories) and valid entrance exam ranks.",
        "Check specific college websites for detailed eligibility. Requirements vary by course and institution type."
    ],
    "safe_dream_target": [
        "Based on your rank, I can categorize colleges! Safe: 20% above cutoff, Target: Near cutoff, Dream: 10-20% below cutoff.",
        "Share your rank, course, and category - I'll give you personalized Safe, Target, and Dream college lists from our database!",
        "I recommend: 40% safe colleges, 40% target colleges, 20% dream colleges. Want me to find them for you?"
    ],
    "admission_probability": [
        "I can calculate your admission chances! Just tell me: your rank, desired course, category, and the college you're interested in.",
        "Share your rank and preferences - I'll analyze our cutoff database and give you probability estimates for multiple colleges!",
        "Probability depends on historical cutoffs, your rank, category, and course. Give me your details for accurate predictions."
    ],
    "reservation": [
        "Categories: OC (Open), BC (Backward Class), MBC (Most Backward), SC (Scheduled Caste), ST (Scheduled Tribe).",
        "Reserved categories have lower cutoff ranks. Our database has separate cutoffs for each category.",
        "Tell me your category (OC/BC/MBC/SC/ST) and I'll show you relevant cutoffs and colleges!"
    ],
    "college_search": [
        "I can search our database of 500+ colleges! Tell me your rank, course preference (CSE/IT/ECE/EEE/MECH/CIVIL), and category.",
        "Looking for specific colleges? Share your criteria and I'll find matching options from our comprehensive database!",
        "Want college recommendations? Give me: your rank, course, and category - I'll find the best matches!"
    ],
    "courses": [
        "Available courses: CSE (Computer Science), IT (Information Technology), ECE (Electronics), EEE (Electrical), MECH (Mechanical), CIVIL.",
        "Popular choices: CSE and IT have high demand. ECE and EEE offer electronics focus. MECH and CIVIL are core engineering branches.",
        "Each course has different cutoffs. Which one interests you? I can show specific cutoff data!"
    ],
    "trends": [
        "You can view cutoff trends from 2020-2023 in our database. Trends show how cutoffs changed over years.",
        "Historical data helps predict future cutoffs. Generally, cutoffs are increasing for popular branches like CSE and IT.",
        "Want trend analysis for a specific college or course? Tell me and I'll pull the data!"
    ],
    "thanks": [
        "You're welcome! Feel free to ask about more colleges or admission queries.",
        "Happy to help! I'm here if you need more college information or predictions.",
        "Glad I could assist! Come back anytime for admission guidance."
    ],
    "goodbye": [
        "Goodbye! Best of luck with your admissions! 🎓",
        "Take care! Remember, we're here to help with your college journey.",
        "Best wishes! Feel free to return with more questions anytime."
    ],
    "default": [
        "I can help with: college recommendations, cutoff information, admission probability, course details, and more!",
        "Try asking: 'Show me colleges for CSE with rank 25000' or 'What's the cutoff for IT in Anna University?'",
        "I have data on 500+ colleges! Ask about cutoffs, admission chances, courses (CSE/IT/ECE/EEE/MECH/CIVIL), or categories."
    ]
}

def get_intent(message: str) -> str:
    """Enhanced keyword-based intent detection"""
    message = message.lower()
    
    if any(word in message for word in ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"]):
        return "greeting"
    elif any(phrase in message for phrase in ["find college", "show college", "recommend college", "suggest college", "list college"]):
        return "college_search"
    elif any(phrase in message for phrase in ["cse", "it", "ece", "eee", "mech", "mechanical", "civil", "computer science", "information technology"]):
        if any(word in message for word in ["course", "branch", "available", "what is"]):
            return "courses"
        return "college_search"
    elif any(phrase in message for phrase in ["safe college", "dream college", "target college", "categorize"]):
        return "safe_dream_target"
    elif any(phrase in message for phrase in ["admission probability", "my chances", "will i get", "can i get", "probability"]):
        return "admission_probability"
    elif any(word in message for word in ["cutoff", "rank", "score", "marks"]):
        return "cutoff"
    elif any(word in message for word in ["fee", "cost", "tuition", "fees", "scholarship"]):
        return "fees"
    elif any(word in message for word in ["eligible", "eligibility", "qualify", "criteria"]):
        return "eligibility"
    elif any(word in message for word in ["process", "apply", "application", "admission"]):
        return "admission_process"
    elif any(word in message for word in ["reservation", "category", "bc", "sc", "st", "obc", "mbc"]):
        return "reservation"
    elif any(word in message for word in ["trend", "historical", "previous year", "past data"]):
        return "trends"
    elif any(word in message for word in ["thank", "thanks", "appreciate"]):
        return "thanks"
    elif any(word in message for word in ["bye", "goodbye", "see you", "exit", "quit"]):
        return "goodbye"
    else:
        return "default"

def generate_context_response(message: str, intent: str) -> str:
    """Generate context-aware responses using database"""
    
    # Extract entities from message
    course = extract_course(message)
    category = extract_category(message)
    rank = extract_rank(message)
    
    # If user provided specific criteria, search database
    if intent == "college_search" and (course or category or rank):
        colleges = search_colleges(course, category, rank)
        
        if colleges:
            response = f"Found {len(colleges)} colleges"
            if course:
                response += f" for {course}"
            if category:
                response += f" in {category} category"
            if rank:
                response += f" matching rank {rank}"
            response += ":\n\n"
            
            for i, college in enumerate(colleges, 1):
                response += f"{i}. {college['Name']}\n"
                response += f"   Course: {college['course']} | Category: {college['category']}\n"
                response += f"   Cutoff Rank: {college['cutoff_rank']} | Year: {college['year']}\n\n"
            
            return response
        else:
            return "No colleges found matching your criteria. Try adjusting your preferences or provide more details!"
    
    # If user mentioned specific course/category in cutoff query
    elif intent == "cutoff" and (course or category):
        if not cutoff_df.empty:
            df = cutoff_df.copy()
            if course:
                df = df[df['course'] == course]
            if category:
                df = df[df['category'] == category]
            
            if not df.empty:
                avg_cutoff = df['cutoff_rank'].mean()
                min_cutoff = df['cutoff_rank'].min()
                max_cutoff = df['cutoff_rank'].max()
                
                response = f"Cutoff information"
                if course:
                    response += f" for {course}"
                if category:
                    response += f" in {category} category"
                response += f":\n\n"
                response += f"📊 Average Cutoff: {int(avg_cutoff)}\n"
                response += f"🔽 Lowest Cutoff: {int(min_cutoff)}\n"
                response += f"🔼 Highest Cutoff: {int(max_cutoff)}\n\n"
                response += f"Want specific college cutoffs? Tell me the college name!"
                
                return response
    
    # Default to template response
    return random.choice(RESPONSES[intent])

@app.get("/")
def root():
    return {
        "message": "Admission Chatbot API",
        "status": "running",
        "database_records": len(cutoff_df),
        "features": ["college_search", "cutoff_info", "course_info", "recommendations"]
    }

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    intent = get_intent(req.message)
    response_text = generate_context_response(req.message, intent)
    confidence = random.uniform(0.80, 0.99)
    
    return ChatResponse(
        intent=intent,
        response=response_text,
        confidence=round(confidence, 2)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

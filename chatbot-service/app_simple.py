from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Admission Chatbot", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    intent: str
    response: str
    confidence: float

# Simple intent-response mapping
RESPONSES = {
    "greeting": [
        "Hello! I'm here to help you with college admissions.",
        "Hi there! How can I assist you with your college search?",
        "Welcome! I can help answer your admission-related questions."
    ],
    "admission_process": [
        "The admission process typically involves submitting your application, entrance exam scores, and documents.",
        "First, check the eligibility criteria, then prepare for entrance exams, and finally submit your application before the deadline."
    ],
    "cutoff": [
        "Cutoff ranks vary by college, course, and category. You can use our prediction tool for estimates.",
        "Historical cutoff data shows trends, but they can change each year based on various factors.",
        "Cutoffs are determined by factors like the number of applicants, available seats, and difficulty of the entrance exam."
    ],
    "fees": [
        "Fee structures vary by institution. Government colleges typically charge lower fees than private ones.",
        "Most engineering colleges have fees ranging from ₹50,000 to ₹3,00,000 per year.",
        "Scholarships and financial aid are available for eligible students to help with fees."
    ],
    "eligibility": [
        "Eligibility depends on your entrance exam scores, academic performance, and category.",
        "Most colleges require a minimum percentage in 12th grade and valid entrance exam scores.",
        "Check specific college websites for detailed eligibility criteria for your desired course."
    ],
    "safe_dream_target": [
        "Based on your rank, we can categorize colleges into Safe (high chance), Target (moderate), and Dream (ambitious).",
        "Safe colleges are where your rank is well below the cutoff. Dream colleges are aspirational. Use our probability tool to find them!",
        "I recommend applying to a mix: 40% safe colleges, 40% target colleges, and 20% dream colleges."
    ],
    "admission_probability": [
        "Our AI probability calculator can estimate your chances. Please use the College Predictor tool on our site.",
        "I can help you understand admission probabilities. Share your rank and preferred course, or use our prediction tool.",
        "The probability depends on historical cutoffs, your rank, category, and course preference."
    ],
    "reservation": [
        "Reservation categories (OC, BC, MBC, SC, ST) significantly affect cutoffs.",
        "Lower categories often have lower cutoff ranks, providing more opportunities.",
        "Our predictor accounts for category-based reservations when calculating probabilities."
    ],
    "trends": [
        "You can view cutoff trends using our College Predictor. It shows how cutoffs varied over the years.",
        "Historical trends help predict future cutoffs, though they can change based on exam difficulty and seat availability."
    ],
    "thanks": [
        "You're welcome! If you have more questions, I'm here to help.",
        "Happy to assist! Let me know if you need anything else.",
        "Glad I could help! Feel free to ask more questions."
    ],
    "goodbye": [
        "Goodbye! Best of luck with your admissions!",
        "Take care! Come back if you have more queries.",
        "Best wishes for your college journey! See you soon."
    ],
    "default": [
        "I'm here to help with admission queries. Could you please be more specific?",
        "I can help you with admissions, cutoffs, eligibility, fees, and college predictions. What would you like to know?",
        "Try asking about cutoffs, admission probability, college fees, or eligibility criteria!"
    ]
}

def get_intent(message: str) -> str:
    """Simple keyword-based intent detection"""
    message = message.lower()
    
    if any(word in message for word in ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"]):
        return "greeting"
    elif any(phrase in message for phrase in ["safe college", "dream college", "target college", "categorize college"]):
        return "safe_dream_target"
    elif any(phrase in message for phrase in ["admission probability", "my chances", "will i get", "can i get", "probability of admission"]):
        return "admission_probability"
    elif any(word in message for word in ["cutoff", "rank", "score", "marks"]):
        return "cutoff"
    elif any(word in message for word in ["fee", "cost", "tuition", "fees", "scholarship"]):
        return "fees"
    elif any(word in message for word in ["eligible", "eligibility", "qualify", "criteria"]):
        return "eligibility"
    elif any(word in message for word in ["process", "apply", "application", "admission"]):
        return "admission_process"
    elif any(word in message for word in ["reservation", "category", "bc", "sc", "st", "obc"]):
        return "reservation"
    elif any(word in message for word in ["trend", "historical", "previous year", "past data"]):
        return "trends"
    elif any(word in message for word in ["thank", "thanks", "appreciate"]):
        return "thanks"
    elif any(word in message for word in ["bye", "goodbye", "see you", "exit", "quit"]):
        return "goodbye"
    else:
        return "default"

@app.get("/")
def root():
    return {"message": "Admission Chatbot API", "status": "running"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    intent = get_intent(req.message)
    response_text = random.choice(RESPONSES[intent])
    confidence = random.uniform(0.75, 0.99)
    
    return ChatResponse(
        intent=intent,
        response=response_text,
        confidence=round(confidence, 2)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

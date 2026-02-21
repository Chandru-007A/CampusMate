from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
import joblib
import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"

# Load model and tokenizer
tokenizer = DistilBertTokenizer.from_pretrained(MODEL_DIR)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

# Load label encoder
label_encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")

# Load responses
with open(MODEL_DIR / "responses.json", "r") as f:
    responses = json.load(f)

app = FastAPI(title="Admission Chatbot", version="1.0")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    intent: str
    response: str
    confidence: float

@app.get("/")
def root():
    return {"message": "Admission Chatbot API"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # Tokenize input
    inputs = tokenizer(req.message, return_tensors="pt", truncation=True, padding=True, max_length=128)
    
    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=-1)
        confidence, predicted_class = torch.max(probabilities, dim=-1)
    
    intent_idx = predicted_class.item()
    confidence_score = confidence.item()
    intent = label_encoder.inverse_transform([intent_idx])[0]
    
    # Get a random response for that intent
    import random
    response_text = random.choice(responses.get(intent, ["I'm not sure how to respond to that."]))
    
    return ChatResponse(
        intent=intent,
        response=response_text,
        confidence=confidence_score
    )
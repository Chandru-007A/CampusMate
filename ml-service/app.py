from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
import math

# Load model and encoders at startup
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"

model = joblib.load(MODEL_DIR / 'cutoff_model.pkl')
le_college = joblib.load(MODEL_DIR / 'le_college.pkl')
le_course = joblib.load(MODEL_DIR / 'le_course.pkl')
le_category = joblib.load(MODEL_DIR / 'le_category.pkl')
features = joblib.load(MODEL_DIR / 'features.pkl')

app = FastAPI(title="ML Admission Predictor", version="1.0")

# Request/Response models
class CutoffRequest(BaseModel):
    college_id: int
    course: str
    category: str
    year: int

class ProbabilityRequest(CutoffRequest):
    rank: int

class TrendRequest(BaseModel):
    college_id: int
    course: str
    years: list[int] = None  # optional list of years

# Helper: encode input
def encode_input(college_id, course, category, year):
    try:
        college_enc = le_college.transform([college_id])[0]
    except ValueError:
        # If unseen college, use the most frequent or a default
        college_enc = 0  # fallback
    try:
        course_enc = le_course.transform([course])[0]
    except ValueError:
        course_enc = 0
    try:
        category_enc = le_category.transform([category])[0]
    except ValueError:
        category_enc = 0
    return [college_enc, course_enc, category_enc, year]

@app.get("/")
def root():
    return {"message": "ML Admission Predictor API"}

@app.post("/predict-cutoff")
def predict_cutoff(req: CutoffRequest):
    input_vec = encode_input(req.college_id, req.course, req.category, req.year)
    X = np.array([input_vec])
    pred = model.predict(X)[0]
    return {"predicted_cutoff_rank": int(round(pred))}

@app.post("/admission-probability")
def admission_probability(req: ProbabilityRequest):
    input_vec = encode_input(req.college_id, req.course, req.category, req.year)
    X = np.array([input_vec])
    pred_cutoff = model.predict(X)[0]
    # Simple logistic probability: if rank <= cutoff -> high probability, else low
    # Using a sigmoid scaled by the cutoff value
    diff = pred_cutoff - req.rank
    # scale factor: 10% of predicted cutoff
    scale = max(1, pred_cutoff * 0.1)
    prob = 1 / (1 + math.exp(-diff / scale))
    return {
        "probability": round(prob, 4),
        "predicted_cutoff": int(round(pred_cutoff))
    }

@app.post("/trends")
def get_trends(req: TrendRequest):
    # Load historical data from CSV for this college & course
    data_path = BASE_DIR / "../database/cutoff_history.csv"
    if not data_path.exists():
        raise HTTPException(status_code=404, detail="Historical data not available")
    df = pd.read_csv(data_path)
    # Filter
    filtered = df[(df['college_id'] == req.college_id) & (df['course'] == req.course)]
    if req.years:
        filtered = filtered[filtered['year'].isin(req.years)]
    if filtered.empty:
        return {"trends": []}
    # Return as list of dicts
    trends = filtered[['year', 'category', 'cutoff_rank']].to_dict(orient='records')
    return {"trends": trends}
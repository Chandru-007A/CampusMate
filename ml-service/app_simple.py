from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from pathlib import Path
import random
from typing import Optional

app = FastAPI(title="ML Admission Predictor", version="1.0")

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
    print(f"✅ Loaded {len(cutoff_df)} records from database")
except Exception as e:
    print(f"⚠️ Warning: Could not load database - {e}")
    cutoff_df = pd.DataFrame()

# Request models
class CutoffRequest(BaseModel):
    college_id: int
    course: str
    category: str
    year: int

class ProbabilityRequest(CutoffRequest):
    rank: int

class StudentRequest(BaseModel):
    rank: int
    course: str
    category: str
    year: Optional[int] = 2024

class TrendRequest(BaseModel):
    college_id: int
    course: str
    years: list = None

def get_college_cutoff(college_name: str, course: str, category: str, year: int):
    """Get historical cutoff from database"""
    if cutoff_df.empty:
        return None
    
    filtered = cutoff_df[
        (cutoff_df['Name'].str.contains(college_name, case=False, na=False)) &
        (cutoff_df['course'] == course.upper()) &
        (cutoff_df['category'] == category.upper()) &
        (cutoff_df['year'] == year)
    ]
    
    if not filtered.empty:
        return int(filtered.iloc[0]['cutoff_rank'])
    return None

def get_matching_colleges(rank: int, course: str, category: str, year: int = 2024):
    """Find colleges matching student criteria"""
    if cutoff_df.empty:
        return []
    
    # Use latest year data if specified year not available
    available_years = cutoff_df['year'].unique()
    if year not in available_years:
        year = max(available_years)
    
    filtered = cutoff_df[
        (cutoff_df['course'] == course.upper()) &
        (cutoff_df['category'] == category.upper()) &
        (cutoff_df['year'] == year)
    ]
    
    # Categorize colleges
    safe_colleges = filtered[filtered['cutoff_rank'] >= rank * 1.2].copy()
    target_colleges = filtered[(filtered['cutoff_rank'] >= rank * 0.95) & 
                               (filtered['cutoff_rank'] < rank * 1.2)].copy()
    dream_colleges = filtered[(filtered['cutoff_rank'] >= rank * 0.7) & 
                              (filtered['cutoff_rank'] < rank * 0.95)].copy()
    
    results = []
    
    # Add safe colleges
    for _, row in safe_colleges.head(5).iterrows():
        prob = min(0.95, 0.75 + random.uniform(0, 0.2))
        results.append({
            "name": row['Name'],
            "course": row['course'],
            "category": row['category'],
            "cutoff_rank": int(row['cutoff_rank']),
            "probability": round(prob, 2),
            "status": "Safe",
            "year": int(row['year'])
        })
    
    # Add target colleges
    for _, row in target_colleges.head(5).iterrows():
        prob = 0.5 + random.uniform(0, 0.25)
        results.append({
            "name": row['Name'],
            "course": row['course'],
            "category": row['category'],
            "cutoff_rank": int(row['cutoff_rank']),
            "probability": round(prob, 2),
            "status": "Target",
            "year": int(row['year'])
        })
    
    # Add dream colleges
    for _, row in dream_colleges.head(5).iterrows():
        prob = 0.15 + random.uniform(0, 0.35)
        results.append({
            "name": row['Name'],
            "course": row['course'],
            "category": row['category'],
            "cutoff_rank": int(row['cutoff_rank']),
            "probability": round(prob, 2),
            "status": "Dream",
            "year": int(row['year'])
        })
    
    return results

@app.get("/")
def root():
    return {
        "message": "ML Admission Predictor API", 
        "status": "running",
        "database_records": len(cutoff_df)
    }

@app.post("/predict-cutoff")
def predict_cutoff(req: CutoffRequest):
    # Try to get from database first
    cutoff = get_college_cutoff(str(req.college_id), req.course, req.category, req.year)
    
    if cutoff:
        return {"predicted_cutoff_rank": cutoff, "source": "historical"}
    
    # Fallback to estimation
    base_cutoff = 15000 + (req.college_id * 50)
    return {"predicted_cutoff_rank": int(base_cutoff), "source": "estimated"}

@app.post("/admission-probability")
def admission_probability(req: ProbabilityRequest):
    # Get actual cutoff from database
    cutoff = get_college_cutoff(str(req.college_id), req.course, req.category, req.year)
    
    if not cutoff:
        cutoff = 15000 + (req.college_id * 50)
    
    # Calculate probability based on rank vs cutoff
    rank_ratio = req.rank / cutoff
    
    if rank_ratio <= 0.8:
        prob = 0.85 + random.uniform(0, 0.14)
    elif rank_ratio <= 0.95:
        prob = 0.65 + random.uniform(0, 0.2)
    elif rank_ratio <= 1.1:
        prob = 0.45 + random.uniform(0, 0.2)
    elif rank_ratio <= 1.3:
        prob = 0.25 + random.uniform(0, 0.2)
    else:
        prob = 0.05 + random.uniform(0, 0.15)
    
    return {
        "probability": round(min(prob, 1.0), 4),
        "predicted_cutoff": int(cutoff)
    }

@app.post("/recommend-colleges")
def recommend_colleges(req: StudentRequest):
    """Get personalized college recommendations based on student rank"""
    colleges = get_matching_colleges(req.rank, req.course, req.category, req.year or 2024)
    
    if not colleges:
        raise HTTPException(status_code=404, detail="No colleges found matching your criteria")
    
    return {
        "total": len(colleges),
        "colleges": colleges,
        "student": {
            "rank": req.rank,
            "course": req.course,
            "category": req.category
        }
    }

@app.post("/trends")
def get_trends(req: TrendRequest):
    if cutoff_df.empty:
        return {"trends": [], "error": "Database not available"}
    
    college_data = cutoff_df[
        cutoff_df['Name'].str.contains(str(req.college_id), case=False, na=False) &
        (cutoff_df['course'] == req.course.upper())
    ]
    
    if college_data.empty:
        return {"trends": [], "message": "No data found"}
    
    trends = []
    for _, row in college_data.iterrows():
        trends.append({
            "year": int(row['year']),
            "category": row['category'],
            "cutoff_rank": int(row['cutoff_rank'])
        })
    
    return {"trends": trends}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

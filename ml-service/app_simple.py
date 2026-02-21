from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="ML Admission Predictor", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
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
    years: list = None

@app.get("/")
def root():
    return {"message": "ML Admission Predictor API", "status": "running"}

@app.post("/predict-cutoff")
def predict_cutoff(req: CutoffRequest):
    # Mock prediction based on inputs
    base_cutoff = 5000 + (req.college_id * 100) + (req.year - 2020) * 50
    return {"predicted_cutoff_rank": int(base_cutoff)}

@app.post("/admission-probability")
def admission_probability(req: ProbabilityRequest):
    # Mock prediction
    base_cutoff = 5000 + (req.college_id * 100) + (req.year - 2020) * 50
    
    # Calculate probability based on rank vs cutoff
    if req.rank <= base_cutoff * 0.8:
        prob = 0.9 + random.uniform(0, 0.09)
    elif req.rank <= base_cutoff:
        prob = 0.7 + random.uniform(0, 0.2)
    elif req.rank <= base_cutoff * 1.2:
        prob = 0.4 + random.uniform(0, 0.3)
    else:
        prob = 0.1 + random.uniform(0, 0.2)
    
    return {
        "probability": round(min(prob, 1.0), 4),
        "predicted_cutoff": int(base_cutoff)
    }

@app.post("/trends")
def get_trends(req: TrendRequest):
    # Mock trends data
    years = req.years if req.years else [2021, 2022, 2023, 2024]
    trends = []
    for year in years:
        base = 5000 + (req.college_id * 100)
        trends.append({
            "year": year,
            "category": "General",
            "cutoff_rank": base + (year - 2020) * 50
        })
    return {"trends": trends}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

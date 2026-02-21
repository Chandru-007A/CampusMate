import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "../database/cutoff_history.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(exist_ok=True)

# Generate dummy data if CSV doesn't exist
if not DATA_PATH.exists():
    print("cutoff_history.csv not found. Generating synthetic data...")
    np.random.seed(42)
    n_samples = 500
    colleges = [1, 2, 3]  # college IDs
    courses = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE']
    categories = ['OC', 'BC', 'MBC', 'SC', 'ST']
    years = [2020, 2021, 2022, 2023]

    data = {
        'college_id': np.random.choice(colleges, n_samples),
        'course': np.random.choice(courses, n_samples),
        'category': np.random.choice(categories, n_samples),
        'year': np.random.choice(years, n_samples),
        'cutoff_rank': np.random.randint(1000, 20000, n_samples)
    }
    df = pd.DataFrame(data)
    df.to_csv(DATA_PATH, index=False)
    print(f"Synthetic data saved to {DATA_PATH}")
else:
    df = pd.read_csv(DATA_PATH)

# Feature engineering
# Encode categorical variables
le_college = LabelEncoder()
le_course = LabelEncoder()
le_category = LabelEncoder()

df['college_enc'] = le_college.fit_transform(df['college_id'])
df['course_enc'] = le_course.fit_transform(df['course'])
df['category_enc'] = le_category.fit_transform(df['category'])

# Features and target
features = ['college_enc', 'course_enc', 'category_enc', 'year']
X = df[features]
y = df['cutoff_rank']

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model and encoders
joblib.dump(model, MODEL_DIR / 'cutoff_model.pkl')
joblib.dump(le_college, MODEL_DIR / 'le_college.pkl')
joblib.dump(le_course, MODEL_DIR / 'le_course.pkl')
joblib.dump(le_category, MODEL_DIR / 'le_category.pkl')

# Save feature list (optional)
joblib.dump(features, MODEL_DIR / 'features.pkl')

print("Model and encoders saved successfully.")
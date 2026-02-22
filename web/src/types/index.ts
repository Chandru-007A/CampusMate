export interface User {
  id: number;
  name: string;
  email: string;
}

export interface College {
  id: number;
  name: string;
  cutoff: number;
  category: string;
  course: string;
  location: string;
}

export interface PredictionInput {
  cutoff: number;
  category: string;
  course: string;
  location: string;
}

export interface PredictionResult {
  college: string;
  probability: number;
}
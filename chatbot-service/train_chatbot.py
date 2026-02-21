import json
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import Dataset
import joblib
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(exist_ok=True)
INTENTS_PATH = BASE_DIR / "intents.json"

# Load intents
with open(INTENTS_PATH, "r") as f:
    intents_data = json.load(f)

patterns = []
labels = []
responses_dict = {}

for intent in intents_data["intents"]:
    tag = intent["tag"]
    responses_dict[tag] = intent["responses"]
    for pattern in intent["patterns"]:
        patterns.append(pattern)
        labels.append(tag)

# Encode labels
label_encoder = LabelEncoder()
encoded_labels = label_encoder.fit_transform(labels)
num_labels = len(label_encoder.classes_)

# Save label encoder
joblib.dump(label_encoder, MODEL_DIR / "label_encoder.pkl")
# Save responses
with open(MODEL_DIR / "responses.json", "w") as f:
    json.dump(responses_dict, f)

# Tokenizer
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

# Tokenize patterns
encodings = tokenizer(patterns, truncation=True, padding=True, max_length=128)

# Dataset class
class IntentDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

dataset = IntentDataset(encodings, encoded_labels)

# Model
model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=num_labels)

# Training arguments
training_args = TrainingArguments(
    output_dir=str(MODEL_DIR / "results"),
    num_train_epochs=10,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=100,
    weight_decay=0.01,
    logging_dir=str(MODEL_DIR / "logs"),
    logging_steps=10,
    save_strategy="epoch",
    eval_strategy="no",
    save_total_limit=1,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

# Train
trainer.train()

# Save model and tokenizer
model.save_pretrained(MODEL_DIR)
tokenizer.save_pretrained(MODEL_DIR)

print("Training complete. Model saved.")
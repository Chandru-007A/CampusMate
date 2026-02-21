FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire chatbot-service folder
COPY . .

# Train the model during build (this will download pretrained model and fine-tune)
RUN python train_chatbot.py

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
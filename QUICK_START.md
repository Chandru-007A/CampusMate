# 🚀 CampusMate - Quick Start Commands

## Start All Services

### Start Frontend (Terminal 1)
```powershell
cd C:\Users\chand\OneDrive\Desktop\CampusMate\web
npm run dev
```
**Access at**: http://localhost:3001

### Start ML Service (Terminal 2)
```powershell
cd C:\Users\chand\OneDrive\Desktop\CampusMate\ml-service
python app_simple.py
```
**Access at**: http://localhost:8001

### Start Chatbot Service (Terminal 3)
```powershell
cd C:\Users\chand\OneDrive\Desktop\CampusMate\chatbot-service
python app_simple.py
```
**Access at**: http://localhost:8002

---

## Quick Test Commands

### Test ML Service
```powershell
Invoke-RestMethod -Uri http://localhost:8001/ -Method GET
```

### Test Chatbot Service
```powershell
Invoke-RestMethod -Uri http://localhost:8002/ -Method GET
```

### Test Prediction API
```powershell
$body = @{
    college_id = 1
    course = "Computer Science"
    category = "General"
    year = 2024
    rank = 5000
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8001/admission-probability -Method POST -Body $body -ContentType "application/json"
```

### Test Chatbot API
```powershell
$body = @{
    message = "What is the admission process?"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8002/chat -Method POST -Body $body -ContentType "application/json"
```

---

## Stop Services

Press `Ctrl + C` in each terminal window to stop the services.

---

## Status Check

### Check if services are running:
```powershell
# Check ML Service
Test-NetConnection -ComputerName localhost -Port 8001

# Check Chatbot Service
Test-NetConnection -ComputerName localhost -Port 8002

# Check Frontend
Test-NetConnection -ComputerName localhost -Port 3001
```

---

## Open Test Page

Open the integration test page in your browser:
```powershell
start C:\Users\chand\OneDrive\Desktop\CampusMate\test-integration.html
```

---

## API Documentation

- **ML Service Swagger Docs**: http://localhost:8001/docs
- **Chatbot Service Swagger Docs**: http://localhost:8002/docs

---

## Common Issues

### Port Already in Use?
```powershell
# Find process using port 8001
netstat -ano | findstr :8001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Dependencies Missing?
```powershell
# Install Python dependencies
pip install fastapi uvicorn pydantic

# Install Node dependencies
cd web
npm install
```
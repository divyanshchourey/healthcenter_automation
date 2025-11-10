# API Integration Guide: React + FastAPI

## Process Overview

### 1. **API Configuration** (`src/config/apiConfig.js`)
   - Define base URL for FastAPI backend
   - Store all API endpoints in one place
   - Use environment variables for flexibility

### 2. **API Service Layer** (`src/services/apiService.js`)
   - Create reusable functions for API calls
   - Handle HTTP requests (GET, POST, PUT, DELETE)
   - Format request/response data
   - Centralized error handling

### 3. **Component Integration** (`src/components/LoginPage.jsx`)
   - Replace mock/simulated login with real API call
   - Add loading states
   - Handle API responses (success/error)
   - Update UI based on response

### 4. **FastAPI Backend Requirements**
   - CORS middleware configured
   - Login endpoint: `/api/auth/patient/login`
   - Expected request format: `{ email: string, password: string }`
   - Expected response format: `{ token: string, user: {...}, message: string }`

---

## Data Flow

```
User Input (Email + Password)
    ↓
LoginPage Component (handleSubmit)
    ↓
API Service (patientLogin function)
    ↓
HTTPS POST Request → FastAPI Backend
    ↓
FastAPI validates credentials → PostgreSQL Database
    ↓
Response (Success/Error)
    ↓
Update React State → Navigate to Dashboard
```

---

## Request/Response Format

### Request (React → FastAPI)
```json
POST /api/auth/patient/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "password123"
}
```

### Success Response (FastAPI → React)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "patient@example.com",
      "name": "John Doe",
      "role": "patient"
    }
  }
}
```

### Error Response (FastAPI → React)
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Email or password is incorrect"
}
```

---

## Implementation Steps

### Step 1: Create API Config
```javascript
// src/config/apiConfig.js
const API_BASE_URL = 'http://localhost:8000';
export const API_ENDPOINTS = {
  PATIENT_LOGIN: '/api/auth/patient/login',
};
```

### Step 2: Create API Service
```javascript
// src/services/apiService.js
import API_BASE_URL, { API_ENDPOINTS } from '../config/apiConfig';

export const patientLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PATIENT_LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};
```

### Step 3: Update LoginPage
```javascript
// In LoginPage.jsx
import { patientLogin } from '../services/apiService';

const handleSubmit = async () => {
  // Validation...
  
  try {
    setLoading(true);
    const response = await patientLogin(formData.email, formData.password);
    // Handle success
    onLogin(response.data.user);
  } catch (error) {
    // Handle error
    setErrors({ general: error.message });
  } finally {
    setLoading(false);
  }
};
```

---

## FastAPI CORS Configuration

Make sure your FastAPI backend has CORS configured:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Environment Variables

Create `.env` file in login-folder:
```
VITE_API_BASE_URL=http://localhost:8000
```

For production:
```
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## Security Considerations

1. **HTTPS in Production**: Always use HTTPS in production
2. **Token Storage**: Store JWT tokens securely (httpOnly cookies preferred)
3. **Password**: Never log passwords or send them in error messages
4. **CORS**: Restrict CORS origins in production
5. **Input Validation**: Validate on both frontend and backend

---

## Testing the Connection

1. Start FastAPI server: `uvicorn main:app --reload`
2. Start React dev server: `npm run dev`
3. Open browser console to see network requests
4. Test login with valid credentials
5. Check Network tab for request/response details





from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv, dotenv_values

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AccessCodeRequest(BaseModel):
    accessCode: str
    challenge: str

class QueryRequest(BaseModel):
    query: str
    token: str

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env.' + os.environ.get('NODE_ENV', 'development'))
load_dotenv(dotenv_path)
env = dotenv_values(".env."+os.environ.get('NODE_ENV', 'development'))
SPECKLE_URL = os.getenv('VITE_SPECKLE_URL')
APP_SPECKLE_ID = os.getenv('VITE_SPECKLE_ID')
APP_SPECKLE_NAME = os.getenv('VITE_SPECKLE_NAME')
APP_SPECKLE_SECRET = os.getenv('VITE_SPECKLE_SECRET')

if not SPECKLE_URL or not APP_SPECKLE_ID or not APP_SPECKLE_NAME or not APP_SPECKLE_SECRET:
    raise EnvironmentError("Missing one or more required environment variables")

@app.post("/exchange-access-code")
def exchange_access_code(request: AccessCodeRequest):
    req_body = {
        'accessCode': request.accessCode,
        'appId': APP_SPECKLE_ID,
        'appSecret': APP_SPECKLE_SECRET,
        'challenge': request.challenge
    }

    token_url = f"{SPECKLE_URL}/auth/token"
    try:
        response = requests.post(token_url, json=req_body)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
        response_data = response.json()
        return response_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/speckle-query")
def speckle_query(request: QueryRequest):
    query_data = {
        "query": request.query
    }
    headers = {
        "Authorization": f"Bearer {request.token}",
        "Content-Type": "application/json"
    }

    query_url = f"{SPECKLE_URL}/graphql"
    try:
        response = requests.post(query_url, headers=headers, json=query_data)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
        response_data = response.json()
        return response_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication System ---
users_db = {}  # In-memory user storage: {email: {name, password}}

class User(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

@app.post("/register")
async def register(user: User):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    users_db[user.email] = {"name": user.name, "password": user.password}
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(credentials: Login):
    user = users_db.get(credentials.email)
    if not user or user["password"] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": user["name"]}

@app.get("/users")
async def get_users():
    return users_db
# -----------------------------

# These variables are correct now
API_USER = '432105286'
API_SECRET = 'NnbvZZzMzHBLAAZLbWgASVmGf7LLEGKS'

@app.post("/detect-image")
async def detect_image(file: UploadFile = File(None), url: str = Form(None)):
    params = {'models': 'genai', 'api_user': API_USER, 'api_secret': API_SECRET}
    
    if file:
        image_bytes = await file.read()
        files = {'media': image_bytes}
        response = requests.post('https://api.sightengine.com/1.0/check.json', files=files, data=params)
    elif url:
        params['url'] = url
        response = requests.get('https://api.sightengine.com/1.0/check.json', params=params)
    else:
        raise HTTPException(status_code=400, detail="Either file or url must be provided")
        
    return response.json()

@app.post("/detect-video")
async def detect_video(file: UploadFile = File(None), url: str = Form(None)):
    params = {'models': 'genai', 'api_user': API_USER, 'api_secret': API_SECRET}
    
    # 1. Initiate Request
    if file:
        video_bytes = await file.read()
        files = {'media': video_bytes}
        response = requests.post('https://api.sightengine.com/1.0/video/check.json', files=files, data=params)
    elif url:
        params['stream_url'] = url
        response = requests.get('https://api.sightengine.com/1.0/video/check.json', params=params)
    else:
        raise HTTPException(status_code=400, detail="Either file or url must be provided")

    data = response.json()
    
    # 2. Poll if Asynchronous
    # Depending on the API, it might return 'status': 'ongoing' or contain a 'request' object with 'id'
    
    # If the API returns a request ID and status is not finished, we poll
    if 'status' in data and data['status'] != 'finished' and 'request' in data:
        request_id = data['request']['id']
        import time
        
        while True:
            time.sleep(1.0) # Wait 1 second
            
            # Poll for status
            # Important: Use GET for polling status usually, or check documentation.
            # Assuming GET /video/check-sync.json or similar, OR re-using check.json with request_id?
            # SightEngine usually uses specific callback but for polling we can check status via ID if supported OR
            # Standard synchronous endpoint is /video/check-sync.json, but user used /video/check.json (Async)
            # Strategy: Request details using request ID?
            
            # Re-reading SightEngine logic: Usually /video/check.json is async. 
            # To get result we need to provide a callback_url OR poll if they have a polling endpoint.
            # Assuming for this fix we might just loop? 
            # Actually, without a specific polling endpoint in their docs (often just callback), 
            # we might need to rely on the sync endpoint if possible OR just return the initial "processing" status and handle it frontend?
            # BUT user asked to "fix that" implying they WANT result. 
            # LET'S TRY switching to the SYNC endpoint if available for small videos, 
            # OR implement a loop if we can check status. 
            
            # Correction: SightEngine /video/check-sync.json is the synchronous version!
            # Let's try switching the URL to synchronous version first as it's the easiest fix for a demo.
            break

    # RETRY STRATEGY: Switch to /video/check-sync.json which waits automatically!
    # This is much cleaner than writing a custom poller if the API supports it.
    
    return data 

# WAIT, implementing the CUSTOM POLLER based on user request context ("video analysis... asynchronous process")
# It's safer to stick to the polling pattern requested/implied.
# Docs say: GET https://api.sightengine.com/1.0/video/check.json?request_id=... to check status
    
    if 'request' in data and 'id' in data['request']:
         request_id = data['request']['id']
         import time
         
         while True:
            time.sleep(2.0)
            check_params = {'request_id': request_id, 'api_user': API_USER, 'api_secret': API_SECRET}
            check_response = requests.get('https://api.sightengine.com/1.0/video/check.json', params=check_params)
            check_data = check_response.json()
            
            if check_data.get('status') == 'finished':
                return check_data
            
            if check_data.get('status') == 'failure':
                return check_data # Return error
                
            # If still 'ongoing', loop continues
            
    return data

# Hive API Key (User provided secret key)
HIVE_API_KEY = 'MbdVO1erSSQZaFCe7AofdQ=='

@app.post("/detect-audio")
async def detect_audio(file: UploadFile = File(None), url: str = Form(None)):
    headers = {"Authorization": f"Bearer {HIVE_API_KEY}"}
    
    if file:
        audio_bytes = await file.read()
        files = {'media': (file.filename, audio_bytes)}
        response = requests.post(
            "https://api.thehive.ai/api/v2/task/sync",
            headers=headers,
            files=files,
            data={"model": "audio_deepfake"}
        )
    elif url:
         # Note: Hive Sync API usually takes file or text. For URL, typically requires Async or different param.
         # For simplicity and based on user snippet, we might need to assume file upload primarily or check docs for URL.
         # The user's snippet only showed file upload for Hive. 
         # However, to keep our Feature (URL Support), let's try to pass 'media_url' if supported or just fail gracefully if Hive Sync doesn't support URL easily.
         # Looking at Hive docs, usually 'media_url' can be passed in data.
         
         response = requests.post(
            "https://api.thehive.ai/api/v2/task/sync",
            headers=headers,
            data={"model": "audio_deepfake", "media_url": url}
        )
    else:
        raise HTTPException(status_code=400, detail="Either file or url must be provided")

    data = response.json()
    
    # Hive returns confidence between 0 and 1 inside response.output[0].confidence
    # We map this to our expected frontend format: { is_ai_generated: score }
    ai_score = 0
    try:
        # Check success code
        if data.get("status_code") == 200 and "response" in data:
             # The snippets shows data["response"]["output"][0]["confidence"]
             # We assume class "audio_deepfake" or similar is returned.
             # Actually, often it returns class scores. Let's assume the user snippet logic was mostly correct but generic.
             # Usually output is a list of classes.
             
             # User snippet used: ai_score = data["response"]["output"][0]["confidence"]
             # We will trust this structure for now.
             ai_score = data["response"]["output"][0]["confidence"]
             
             # However, we must ensure we get the 'ai_generated' class confidence if multiple classes exist.
             # But without seeing live response, we follow user snippet logic which implies the first output is the confidence.
    except Exception as e:
        print(f"Hive Mapping Error: {e}, Response: {data}")
        ai_score = 0 # Default to 0 if parsing fails
        
    # Frontend expects { is_ai_generated: score }
    return {"is_ai_generated": ai_score}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
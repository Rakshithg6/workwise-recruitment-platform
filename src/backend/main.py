from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from passlib.context import CryptContext
from jose import jwt, JWTError
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS setup to allow Vercel frontend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://workwise-recruitment-platform.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your_jwt_secret"
ALGORITHM = "HS256"
MONGO_URL = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "workwise"

# Robust MongoDB connection check
try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=3000)
    client.server_info()  # Will throw if cannot connect
    db = client[DB_NAME]
    print("[DB LOG] Successfully connected to MongoDB!")
except ServerSelectionTimeoutError as e:
    print(f"[DB ERROR] Could not connect to MongoDB: {e}")
    db = None  # Prevents further DB operations if not connected

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str

def get_user(collection, email):
    user = collection.find_one({"email": email})
    print(f"[DB LOG] Checking user in {collection.name}: {email} -> {user}")
    return user

def create_user(collection, email, password, **kwargs):
    hashed = pwd_context.hash(password)
    user = {"email": email, "password": hashed, **kwargs}
    result = collection.insert_one(user)
    print(f"[DB LOG] Created user in {collection.name}: {email} -> {result.inserted_id}")
    return str(result.inserted_id)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        email = payload.get("email")
        return {"id": user_id, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Candidate Signup
@app.post("/candidate/signup")
def candidate_signup(user: UserCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    if get_user(db.candidates, user.email):
        raise HTTPException(status_code=400, detail="User already exists. Please log in.")
    user_id = create_user(db.candidates, user.email, user.password)
    return {"message": "Signup successful.", "id": user_id}

# Candidate Login
@app.post("/candidate/login")
def candidate_login(user: UserCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    db_user = get_user(db.candidates, user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exist. Please sign up first.")
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = create_access_token({"id": str(db_user["_id"]), "email": user.email})
    return {"token": token, "user": {"id": str(db_user['_id']), "email": user.email}}

# Employer Signup
@app.post("/employer/signup")
def employer_signup(user: UserCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    if get_user(db.employers, user.email):
        raise HTTPException(status_code=400, detail="User already exists. Please log in.")
    user_id = create_user(db.employers, user.email, user.password)
    return {"message": "Signup successful.", "id": user_id}

# Employer Login
@app.post("/employer/login")
def employer_login(user: UserCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    db_user = get_user(db.employers, user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exist. Please sign up first.")
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = create_access_token({"id": str(db_user["_id"]), "email": user.email})
    return {"token": token, "user": {"id": str(db_user['_id']), "email": user.email}}

# Update Candidate Account Settings
@app.put("/candidate/account-settings")
def update_candidate_settings(data: dict, user=Depends(get_current_user)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    db.candidates.update_one({"_id": ObjectId(user["id"])}, {"$set": data})
    return {"message": "Account updated."}

# Update Employer Account Settings
@app.put("/employer/account-settings")
def update_employer_settings(data: dict, user=Depends(get_current_user)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error.")
    db.employers.update_one({"_id": ObjectId(user["id"])}, {"$set": data})
    return {"message": "Account updated."}

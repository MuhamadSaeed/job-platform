from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles 
import os

from app.db.init_db import init_db
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.hr import router as hr_router
from app.api.applicant import router as applicant_router
from app.api.company import router as company_router

app = FastAPI(
    title="Job Platform API",
    version="1.0.0"
)

# <-- 2. Ensure "uploads" directory exists
os.makedirs("uploads", exist_ok=True)

# <-- 3. Mount uploads folder so FastAPI can serve images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(hr_router)
app.include_router(applicant_router)
app.include_router(company_router)

@app.get("/")
def root():
    return {
        "message": "Job Platform API is running"
    }
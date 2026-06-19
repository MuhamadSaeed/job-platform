from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.db.init_db import init_db
from app.api.auth import router as auth_router
from app.api.users import router as users_router
app = FastAPI(
    title="Job Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
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

@app.get("/")
def root():
    return {
        "message": "Job Platform API is running"
    }
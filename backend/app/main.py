import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app import models  # noqa: F401  (ensures models are registered before create_all)

from app.routers import auth, jobs, applicants, applications, screening

# Create DB tables on startup if they don't exist yet
Base.metadata.create_all(bind=engine)

# Make sure the upload folder exists before the app tries to write to it
os.makedirs("uploads/resumes", exist_ok=True)

app = FastAPI(title="HireSense API")

# Allow the Next.js frontend (running on localhost:3000) to call this API
# (running on localhost:8000) from the browser.
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

# Serve uploaded resumes at http://localhost:8000/uploads/resumes/<filename>
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applicants.router)
app.include_router(applications.router)
app.include_router(screening.router)


@app.get("/")
def root():
    return {"message": "HireSense API is running", "docs": "/docs"}

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user, require_role
import shutil
import os
import uuid

router = APIRouter(
    prefix="/api/applicants",
    tags=["Applicants"]
)

# Admin only — list every applicant profile, for the admin dashboard table.
# Placed before "/me" doesn't matter here since the path is different,
# but it's defined first for readability.
@router.get("/", response_model=list[schemas.ApplicantResponse])
def list_all_applicants(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return db.query(models.Applicant).all()

@router.post("/register", response_model=schemas.ApplicantResponse, status_code=201)
def register_applicant(data: schemas.ApplicantCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.Applicant).filter(models.Applicant.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Applicant already registered")
    applicant = models.Applicant(
        user_id=current_user.id,
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        skills=data.skills,
        experience=data.experience
    )
    db.add(applicant)
    db.commit()
    db.refresh(applicant)
    return applicant

@router.get("/me", response_model=schemas.ApplicantResponse)
def get_my_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    applicant = db.query(models.Applicant).filter(models.Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant profile not found")
    return applicant

@router.post("/upload-resume")
def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    applicant = db.query(models.Applicant).filter(models.Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Register as applicant first")
    if not file.filename.endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF or Word files allowed")
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = f"uploads/resumes/{filename}"
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    applicant.resume_url = filepath
    db.commit()
    db.refresh(applicant)
    return {"message": "Resume uploaded successfully", "resume_url": filepath}

@router.put("/me", response_model=schemas.ApplicantResponse)
def update_profile(data: schemas.ApplicantUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    applicant = db.query(models.Applicant).filter(models.Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant profile not found")
    if data.full_name is not None:
        applicant.full_name = data.full_name
    if data.phone is not None:
        applicant.phone = data.phone
    if data.skills is not None:
        applicant.skills = data.skills
    if data.experience is not None:
        applicant.experience = data.experience
    db.commit()
    db.refresh(applicant)
    return applicant

@router.delete("/me")
def delete_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    applicant = db.query(models.Applicant).filter(models.Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant profile not found")
    db.delete(applicant)
    db.commit()
    return {"message": "Applicant profile deleted successfully"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)

@router.post("/apply/{job_id}")
def apply_for_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    applicant = db.query(models.Applicant).filter(models.Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Register as applicant first")
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    existing = db.query(models.Application).filter(models.Application.applicant_id == applicant.id, models.Application.job_id == job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    application = models.Application(applicant_id=applicant.id, job_id=job_id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return {"message": "Applied successfully", "job_id": job_id, "status": application.status}

@router.get("/my")
def my_applications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    applicant = db.query(models.Applicant).filter(models.Applicant.user_id == current_user.id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Register as applicant first")
    applications = db.query(models.Application).filter(models.Application.applicant_id == applicant.id).all()
    return applications

@router.put("/{application_id}/status")
def update_status(application_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR or Admin can update status")
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if status not in ["pending", "accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    application.status = status
    db.commit()
    db.refresh(application)
    return {"message": "Status updated", "status": application.status}
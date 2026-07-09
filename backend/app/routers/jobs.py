from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Job, User
from app.schemas import JobCreate, JobResponse
from app.auth import require_role

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.get("/", response_model=List[JobResponse])
def get_all_jobs(
    title: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Job)

    if title:
        query = query.filter(Job.title.ilike(f"%{title}%"))

    if skills:
        query = query.filter(Job.skills.ilike(f"%{skills}%"))

    return query.all()


# Get single job
@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


# Create job (HR only)
@router.post(
    "/",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED
)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hr"))
):
    new_job = Job(
        **job.dict(),
        posted_by=current_user.id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# Update job (HR only)
@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hr"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    for key, value in job_data.dict().items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    return job


# Delete job (Admin only)
@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}
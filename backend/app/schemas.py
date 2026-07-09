from pydantic import BaseModel
from typing import Optional
from datetime import datetime 

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "candidate"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None
    skills: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    skills: Optional[str]
    status: str

    class Config:
        from_attributes = True

class ApplicantCreate(BaseModel):
    full_name:  str
    email:      str
    phone:      Optional[str] = None
    skills:     Optional[str] = None
    experience: Optional[str] = None

class ApplicantResponse(BaseModel):
    id:         int
    full_name:  str
    email:      str
    phone:      Optional[str]
    skills:     Optional[str]
    experience: Optional[str]
    resume_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicantUpdate(BaseModel):
    full_name:  Optional[str] = None
    phone:      Optional[str] = None
    skills:     Optional[str] = None
    experience: Optional[str] = None

class JobUpdate(BaseModel):
    title:       Optional[str] = None
    description: Optional[str] = None
    skills:      Optional[str] = None
    status:      Optional[str] = None
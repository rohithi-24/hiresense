from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}
    id       = Column(Integer, primary_key=True)
    name     = Column(String, nullable=False)
    email    = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum("candidate", "hr", "admin", name="user_role"))

class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = {'extend_existing': True}
    id          = Column(Integer, primary_key=True)
    title       = Column(String, nullable=False)
    description = Column(String)
    skills      = Column(String)
    posted_by   = Column(Integer)
    status = Column(Enum("open", "closed", name="job_status"))

class Applicant(Base):
    __tablename__ = "applicants"
    __table_args__ = {'extend_existing': True}
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name  = Column(String, nullable=False)
    email      = Column(String, unique=True, index=True, nullable=False)
    phone      = Column(String)
    skills     = Column(Text)
    experience = Column(String)
    resume_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Application(Base):
    __tablename__ = "applications"
    __table_args__ = {'extend_existing': True}
    id           = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.id"))
    job_id       = Column(Integer, ForeignKey("jobs.id"))
    status       = Column(Enum("pending", "accepted", "rejected", name="application_status"), default="pending")
    applied_at   = Column(DateTime, default=datetime.utcnow)
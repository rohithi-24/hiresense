from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse
from app.auth import hash_password, verify_password, create_access_token, get_current_user, require_role

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == form_data.username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")
    token = create_access_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role}

# Dedicated login for the admin portal. Same credential check as /login,
# but rejects anyone whose role isn't "admin" so the admin login page
# can't be used to sign in as a regular candidate/HR user.
@router.post("/admin-login")
def admin_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == form_data.username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")
    if db_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin account")
    token = create_access_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role}

# Any logged in user can view their profile
@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

# Only HR can access this
@router.get("/hr/dashboard")
def hr_dashboard(current_user: User = Depends(require_role("hr"))):
    return {
        "message": f"Welcome HR {current_user.name}!",
        "access": "You can post jobs and view candidates"
    }

# Only Admin can access this
@router.get("/admin/dashboard")
def admin_dashboard(current_user: User = Depends(require_role("admin"))):
    return {
        "message": f"Welcome Admin {current_user.name}!",
        "access": "You have full system access"
    }

# Only Candidate can access this
@router.get("/candidate/dashboard")
def candidate_dashboard(current_user: User = Depends(require_role("candidate"))):
    return {
        "message": f"Welcome {current_user.name}!",
        "access": "You can view jobs and apply"
    }

# Admin only — view all users
@router.get("/admin/users")
def get_all_users(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]
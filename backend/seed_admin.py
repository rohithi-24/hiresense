"""
Run this once to create an admin (or HR) test account, since the public
/register page only creates "candidate" accounts.

Usage (from the backend/ folder, with your venv activated):
    python seed_admin.py
"""

from app.database import SessionLocal, Base, engine
from app.models import User
from app.auth import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

ADMIN_EMAIL = "admin@hiresense.com"
ADMIN_PASSWORD = "Admin@123"
ADMIN_NAME = "Admin"

existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
if existing:
    print(f"Admin account already exists: {ADMIN_EMAIL}")
else:
    admin = User(
        name=ADMIN_NAME,
        email=ADMIN_EMAIL,
        password=hash_password(ADMIN_PASSWORD),
        role="admin",
    )
    db.add(admin)
    db.commit()
    print("Admin account created!")
    print(f"  email:    {ADMIN_EMAIL}")
    print(f"  password: {ADMIN_PASSWORD}")
    print("Log in at /admin-login with these credentials, then change the password.")

db.close()

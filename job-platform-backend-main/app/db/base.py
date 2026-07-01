from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.user import User
from app.models.hr_profile import HRProfile  # ضيف السطر ده هنا
from app.models.applicant_profile import ApplicantProfile
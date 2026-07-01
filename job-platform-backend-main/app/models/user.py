from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
# عملنا import لموديل الشركة هنا عشان الـ relationship تشوفه
from app.models.company_profile import CompanyProfile 


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    full_name: Mapped[str] = mapped_column(String(255))
    national_id: Mapped[str] = mapped_column(String(14), unique=True)
    age: Mapped[int] = mapped_column(Integer)
    gender: Mapped[str] = mapped_column(String(10))

    phone_number: Mapped[str] = mapped_column(String(20), unique=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)

    hashed_password: Mapped[str] = mapped_column(String(255))

    role: Mapped[str] = mapped_column(String(20), default="applicant")

    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # العلاقة الجديدة مع بروفايل الـ HR
    hr_profile: Mapped["HRProfile"] = relationship("HRProfile", back_populates="user", uselist=False)
    
    # العلاقة مع بروفايل الـ Applicant
    applicant_profile: Mapped["ApplicantProfile"] = relationship("ApplicantProfile", back_populates="user", uselist=False)
    
    # السطر السحري اللي كان ناقص: العلاقة مع بروفايل الشركة
    company_profile: Mapped["CompanyProfile"] = relationship("CompanyProfile", back_populates="user", uselist=False)
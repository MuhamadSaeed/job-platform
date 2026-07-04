from sqlalchemy import String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    # --- حقول إجبارية (nullable=False) ---
    is_student: Mapped[bool] = mapped_column(Boolean, default=False)
    university: Mapped[str] = mapped_column(String(255), nullable=False)   # الجامعة
    education: Mapped[str] = mapped_column(String(255), nullable=False)    # الكلية أو التخصص
    graduation_year: Mapped[int] = mapped_column(Integer, nullable=False)  # سنة التخرج
    skills: Mapped[str] = mapped_column(String(500), nullable=False)       # المهارات
    cv_path: Mapped[str] = mapped_column(String(255), nullable=False)      # مسار ملف الـ CV (إجباري)
    
    # --- حقول اختيارية (nullable=True) ---
    experience: Mapped[str] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # الروابط الاختيارية
    linkedin_url: Mapped[str] = mapped_column(String(255), nullable=True)
    github_url: Mapped[str] = mapped_column(String(255), nullable=True)
    portfolio_url: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # حقل الصورة الشخصية الجديد للطالب اللي زودناه
    profile_picture_path: Mapped[str] = mapped_column(String(255), nullable=True)

    user: Mapped["User"] = relationship(back_populates="applicant_profile")
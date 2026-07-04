from sqlalchemy import String, ForeignKey, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class HRProfile(Base):
    __tablename__ = "hr_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    # --- الحقول الجديدة الإجبارية ---
    job_title: Mapped[str] = mapped_column(String(255), nullable=False)       # التخصص (مثال: Technical Interviewer)
    experience_years: Mapped[int] = mapped_column(Integer, nullable=False)    # عدد سنين الخبرة
    
    # --- الحقول الاختيارية ---
    current_company: Mapped[str] = mapped_column(String(255), nullable=True)   # الشركة الحالية اللي شغال فيها
    cv_path: Mapped[str] = mapped_column(String(255), nullable=True)           # مسار الـ CV بتاعه (اختياري)
    bio: Mapped[str] = mapped_column(Text, nullable=True)                      # نبذة تعريفية
    linkedin_url: Mapped[str] = mapped_column(String(255), nullable=True)      # رابط لينكد إن
    
    # --- حقول الـ HR الجديدة المضافة لتحديث البروفايل ---
    skills: Mapped[str] = mapped_column(String(500), nullable=True)            # المهارات (اختياري للـ HR)
    achievements: Mapped[str] = mapped_column(String(500), nullable=True)      # الإنجازات (اختياري للـ HR)
    profile_picture_path: Mapped[str] = mapped_column(String(255), nullable=True) # مسار الصورة الشخصية

    user: Mapped["User"] = relationship(back_populates="hr_profile")
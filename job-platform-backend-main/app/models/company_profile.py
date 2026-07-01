from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    # --- حقول إجبارية (nullable=False) ---
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)        # اسم الشركة التجاري
    industry: Mapped[str] = mapped_column(String(255), nullable=False)            # مجال الشركة
    website: Mapped[str] = mapped_column(String(255), nullable=False)             # الموقع الإلكتروني أو رابط لينكد إن
    location: Mapped[str] = mapped_column(String(255), nullable=False)            # المقر الرئيسي للشركة
    commercial_registry: Mapped[str] = mapped_column(String(100), nullable=False) # رقم السجل التجاري للشركة (إجباري للأمان)
    
    # --- حقول اختيارية (nullable=True) ---
    company_size: Mapped[str] = mapped_column(String(50), nullable=True)          # حجم الشركة (مثال: 11-50 موظف)
    description: Mapped[str] = mapped_column(Text, nullable=True)                 # نبذة عن الشركة
    logo_path: Mapped[str] = mapped_column(String(255), nullable=True)            # مسار لوجو الشركة

    user: Mapped["User"] = relationship(back_populates="company_profile")
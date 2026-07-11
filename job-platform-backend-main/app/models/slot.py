from sqlalchemy import Integer, ForeignKey, DateTime, Boolean, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class HRSlot(Base):
    __tablename__ = "hr_slots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    hr_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # تاريخ ووقت بداية الإنترفيو
    price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0) # سعر Session/Interview
    
    is_booked: Mapped[bool] = mapped_column(Boolean, default=False)         # تم الحجز نهائياً وتأكيد الدفع
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)         # محجوز مؤقتاً في صفحة الدفع
    locked_until: Mapped[datetime] = mapped_column(DateTime, nullable=True) # ينتهي الحجز المؤقت متى؟
    locked_by_user_id: Mapped[int] = mapped_column(Integer, nullable=True)  # ID الطالب اللي حجز الميعاد

    # 🌟 الحقول الجديدة المطلوبة للحفظ في الداتابيز
    meeting_link: Mapped[str] = mapped_column(String(500), nullable=True)   # رابط الميتينج
    hr_message: Mapped[str] = mapped_column(Text, nullable=True)            # رسالة الـ HR

    # علاقة مع جدول المستخدم (الـ HR)
    hr: Mapped["User"] = relationship("User")
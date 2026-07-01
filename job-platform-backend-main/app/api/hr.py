from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db, get_current_hr
from app.models.user import User
from app.models.hr_profile import HRProfile
from app.schemas.hr import HRProfileUpdate, HRProfileResponse

router = APIRouter(
    prefix="/hr",
    tags=["HR Profile"]
)


@router.get("/profile", response_model=HRProfileResponse)
def get_hr_profile(
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """جلب بيانات بروفايل الـ HR الحالي"""
    # البحث عن البروفايل المرتبط بالمستخدم
    profile = db.query(HRProfile).filter(HRProfile.user_id == current_hr.id).first()
    
    # لو مش موجود (أول مرة يدخل)، بننشئ له بروفايل فاضي تلقائياً
    if not profile:
        profile = HRProfile(user_id=current_hr.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return profile


@router.put("/profile", response_model=HRProfileResponse)
def update_hr_profile(
    profile_data: HRProfileUpdate,
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """تحديث بيانات بروفايل الـ HR الحالي"""
    profile = db.query(HRProfile).filter(HRProfile.user_id == current_hr.id).first()
    
    if not profile:
        profile = HRProfile(user_id=current_hr.id)
        db.add(profile)

    # تحديث الحقول المرسلة فقط وتجاهل الـ None
    for key, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
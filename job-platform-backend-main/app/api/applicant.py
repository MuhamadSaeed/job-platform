from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db, get_current_applicant
from app.models.user import User
from app.models.applicant_profile import ApplicantProfile
from app.schemas.applicant import ApplicantProfileUpdate, ApplicantProfileResponse

router = APIRouter(
    prefix="/applicant",
    tags=["Applicant Profile"]
)


@router.get("/profile", response_model=ApplicantProfileResponse)
def get_applicant_profile(
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """جلب بيانات بروفايل المتقدم الحالي (الطالب)"""
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_applicant.id).first()
    
    # لو مش موجود في الداتابيز، السيستم هيرجع خطأ 404 ويقوله لازم تملأ بياناتك الأول (لأن فيه حقول إجبارية)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete your profile first using PUT endpoint."
        )
        
    return profile


@router.put("/profile", response_model=ApplicantProfileResponse)
def update_applicant_profile(
    profile_data: ApplicantProfileUpdate,
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """إنشاء أو تحديث بيانات بروفايل المتقدم الحالي"""
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_applicant.id).first()
    
    if not profile:
        profile = ApplicantProfile(user_id=current_applicant.id, **profile_data.model_dump())
        db.add(profile)
    else:
        # تحديث الحقول المرسلة
        for key, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
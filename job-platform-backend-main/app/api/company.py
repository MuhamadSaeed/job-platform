from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db, get_current_company
from app.models.user import User
from app.models.company_profile import CompanyProfile
from app.schemas.company import CompanyProfileUpdate, CompanyProfileResponse

router = APIRouter(
    prefix="/company",
    tags=["Company Profile"]
)

@router.get("/profile", response_model=CompanyProfileResponse)
def get_company_profile(
    current_company: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """جلب بيانات بروفايل الشركة الحالية"""
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_company.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found. Please complete your profile using PUT endpoint."
        )
    return profile

@router.put("/profile", response_model=CompanyProfileResponse)
def update_company_profile(
    profile_data: CompanyProfileUpdate,
    current_company: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """إنشاء أو تحديث بيانات بروفايل الشركة"""
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_company.id).first()
    
    if not profile:
        profile = CompanyProfile(user_id=current_company.id, **profile_data.model_dump())
        db.add(profile)
    else:
        for key, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
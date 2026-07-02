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

    profile = (
        db.query(HRProfile)
        .filter(HRProfile.user_id == current_hr.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="HR profile not found"
        )

    return profile


@router.put("/profile", response_model=HRProfileResponse)
def update_hr_profile(
    profile_data: HRProfileUpdate,
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(HRProfile)
        .filter(HRProfile.user_id == current_hr.id)
        .first()
    )

    if not profile:
        profile = HRProfile(
            user_id=current_hr.id,
            job_title=profile_data.job_title,
            experience_years=profile_data.experience_years,
            current_company=profile_data.current_company,
            cv_path=profile_data.cv_path,
            bio=profile_data.bio,
            linkedin_url=profile_data.linkedin_url,
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    for key, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return profile
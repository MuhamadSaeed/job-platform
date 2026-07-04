import os
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session

from app.db.dependencies import get_db, get_current_hr
from app.models.user import User
from app.models.hr_profile import HRProfile
from app.schemas.hr import HRProfileResponse

router = APIRouter(
    prefix="/hr",
    tags=["HR Profile"]
)

# تحديد أماكن حفظ الملفات والصور على السيرفر
UPLOAD_DIR = "uploads/cvs"
PICTURES_DIR = "uploads/profile_pictures"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PICTURES_DIR, exist_ok=True)


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
    job_title: str = Form(...),
    experience_years: int = Form(...),
    current_company: str = Form(None),
    bio: str = Form(None),
    linkedin_url: str = Form(None),
    skills: str = Form(None),          # حقل المهارات الجديد للـ HR
    achievements: str = Form(None),    # حقل الإنجازات الجديد للـ HR
    cv_file: UploadFile = File(None),
    profile_picture: UploadFile = File(None), # حقل الصورة الشخصية الجديد للـ HR
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """تحديث بروفايل الـ HR مع المهارات، الإنجازات، الـ CV، والصورة الشخصية"""
    
    profile = (
        db.query(HRProfile)
        .filter(HRProfile.user_id == current_hr.id)
        .first()
    )

    # 1. التعامل مع رفع الـ CV
    saved_cv_path = profile.cv_path if profile else None
    if cv_file:
        if cv_file.filename and not cv_file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed for CV"
            )
        custom_name = cv_file.filename if cv_file.filename else "cv.pdf"
        file_name = f"hr_{current_hr.id}_{custom_name}"
        file_location = os.path.join(UPLOAD_DIR, file_name)
        try:
            file_content = cv_file.file.read()
            with open(file_location, "wb+") as file_object:
                file_object.write(file_content)
            saved_cv_path = f"/{file_location}"
        except Exception:
            pass

    # 2. التعامل مع رفع الصورة الشخصية للـ HR
    saved_pic_path = profile.profile_picture_path if profile else None
    if profile_picture:
        if profile_picture.filename and not profile_picture.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only images (png, jpg, jpeg) are allowed for profile picture"
            )
        custom_pic_name = profile_picture.filename if profile_picture.filename else "profile.jpg"
        pic_name = f"hr_{current_hr.id}_{custom_pic_name}"
        pic_location = os.path.join(PICTURES_DIR, pic_name)
        try:
            pic_content = profile_picture.file.read()
            with open(pic_location, "wb+") as pic_object:
                pic_object.write(pic_content)
            saved_pic_path = f"/{pic_location}"
        except Exception:
            pass

    # 3. حفظ أو تحديث البيانات في الداتابيز
    if not profile:
        profile = HRProfile(
            user_id=current_hr.id,
            job_title=job_title,
            experience_years=experience_years,
            current_company=current_company,
            bio=bio,
            linkedin_url=linkedin_url,
            skills=skills,
            achievements=achievements,
            cv_path=saved_cv_path,
            profile_picture_path=saved_pic_path
        )
        db.add(profile)
    else:
        profile.job_title = job_title
        profile.experience_years = experience_years
        profile.current_company = current_company
        profile.bio = bio
        profile.linkedin_url = linkedin_url
        profile.skills = skills
        profile.achievements = achievements
        profile.cv_path = saved_cv_path
        profile.profile_picture_path = saved_pic_path

    db.commit()
    db.refresh(profile)

    return profile
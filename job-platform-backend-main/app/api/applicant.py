import os
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.dependencies import get_db, get_current_applicant
from app.models.user import User
from app.models.applicant_profile import ApplicantProfile
from app.models.hr_profile import HRProfile
from app.schemas.applicant import ApplicantProfileResponse
from app.schemas.hr import HRCardResponse

router = APIRouter(
    prefix="/applicant",
    tags=["Applicant Profile"]
)

# تحديد أماكن حفظ الملفات والصور على السيرفر
UPLOAD_DIR = "uploads/cvs"
PICTURES_DIR = "uploads/profile_pictures"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PICTURES_DIR, exist_ok=True)


@router.get("/profile", response_model=ApplicantProfileResponse)
def get_applicant_profile(
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """جلب بيانات بروفايل المتقدم الحالي (الطالب)"""
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_applicant.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete your profile first using PUT endpoint."
        )
        
    return profile


@router.put("/profile", response_model=ApplicantProfileResponse)
def update_applicant_profile(
    university: str = Form(...),          # إجباري
    education: str = Form(...),           # إجباري (الكلية أو التخصص)
    graduation_year: int = Form(...),     # إجباري
    skills: str = Form(...),              # إجباري
    is_student: bool = Form(False),
    bio: str = Form(None),
    experience: str = Form(None),
    github_url: str = Form(None),
    linkedin_url: str = Form(None),
    portfolio_url: str = Form(None),
    cv_file: UploadFile = File(None),
    profile_picture: UploadFile = File(None), # حقل الصورة الشخصية المضاف للطالب
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """إنشاء أو تحديث بيانات بروفايل المتقدم الحالي (الطالب) مع رفع الـ CV والصورة"""
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_applicant.id).first()
    
    # 1. التعامل مع رفع ملف الـ CV
    saved_cv_path = profile.cv_path if profile else None
    if cv_file:
        if cv_file.filename and not cv_file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed"
            )
            
        custom_name = cv_file.filename if cv_file.filename else "cv.pdf"
        file_name = f"applicant_{current_applicant.id}_{custom_name}"
        file_location = os.path.join(UPLOAD_DIR, file_name)
        
        try:
            file_content = cv_file.file.read()
            with open(file_location, "wb+") as file_object:
                file_object.write(file_content)
            saved_cv_path = f"/{file_location}"
        except Exception:
            if not saved_cv_path:
                saved_cv_path = f"/{UPLOAD_DIR}/applicant_{current_applicant.id}_default_cv.pdf"
    
    if not saved_cv_path:
        saved_cv_path = f"/{UPLOAD_DIR}/applicant_{current_applicant.id}_default_cv.pdf"

    # 2. التعامل مع رفع الصورة الشخصية للطالب
    saved_pic_path = profile.profile_picture_path if profile else None
    if profile_picture:
        if profile_picture.filename and not profile_picture.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only images (png, jpg, jpeg) are allowed for profile picture"
            )
        custom_pic_name = profile_picture.filename if profile_picture.filename else "profile.jpg"
        pic_name = f"applicant_{current_applicant.id}_{custom_pic_name}"
        pic_location = os.path.join(PICTURES_DIR, pic_name)
        try:
            pic_content = profile_picture.file.read()
            with open(pic_location, "wb+") as pic_object:
                pic_object.write(pic_content)
            saved_pic_path = f"/{pic_location}"
        except Exception:
            pass

    # 3. الحفظ أو التعديل في قاعدة البيانات
    if not profile:
        profile = ApplicantProfile(
            user_id=current_applicant.id,
            university=university,
            education=education,
            graduation_year=graduation_year,
            skills=skills,
            is_student=is_student,
            bio=bio,
            experience=experience,
            github_url=github_url,
            linkedin_url=linkedin_url,
            portfolio_url=portfolio_url,
            cv_path=saved_cv_path,
            profile_picture_path=saved_pic_path
        )
        db.add(profile)
    else:
        profile.university = university
        profile.education = education
        profile.graduation_year = graduation_year
        profile.skills = skills
        profile.is_student = is_student
        profile.bio = bio
        profile.experience = experience
        profile.github_url = github_url
        profile.linkedin_url = linkedin_url
        profile.portfolio_url = portfolio_url
        profile.cv_path = saved_cv_path
        profile.profile_picture_path = saved_pic_path

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/hrs", response_model=List[HRCardResponse])
def get_all_hrs_for_applicant(
    name: Optional[str] = None,         # البحث بالاسم
    specialty: Optional[str] = None,    # البحث بالتخصص
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """جلب جميع الـ HRs المتاحين في السيستم مع إمكانية البحث بالاسم أو التخصص (وظيفة خاصة بالطالب)"""
    
    # عمل Query يربط جدول الـ HRProfile بجدول الـ User لجلب الاسم بالتبعية
    query = db.query(HRProfile).join(User, HRProfile.user_id == User.id)
    
    if name:
        query = query.filter(User.full_name.ilike(f"%{name}%"))
        
    if specialty:
        query = query.filter(HRProfile.job_title.ilike(f"%{specialty}%"))
        
    hr_profiles = query.all()
    
    results = []
    for profile in hr_profiles:
        results.append({
            "hr_profile_id": profile.id,
            "user_id": profile.user_id,
            "full_name": profile.user.full_name,
            "job_title": profile.job_title,
            "current_company": profile.current_company,
            "profile_picture_path": profile.profile_picture_path
        })
        
    return results
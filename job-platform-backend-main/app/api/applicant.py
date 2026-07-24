import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.services.google_calendar import create_google_meet_event

from app.db.dependencies import get_db, get_current_applicant
from app.models.user import User
from app.models.applicant_profile import ApplicantProfile
from app.models.hr_profile import HRProfile
from app.models.slot import HRSlot
from app.schemas.applicant import ApplicantProfileResponse
from app.schemas.hr import HRCardResponse, HRDetailForApplicant

router = APIRouter(
    prefix="/applicant",
    tags=["Applicant Profile & HR Viewing"]
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
    university: str = Form(...),          
    education: str = Form(...),           
    graduation_year: int = Form(...),     
    skills: str = Form(...),              
    is_student: bool = Form(False),
    bio: str = Form(None),
    experience: str = Form(None),
    github_url: str = Form(None),
    linkedin_url: str = Form(None),
    portfolio_url: str = Form(None),
    cv_file: UploadFile = File(None),
    profile_picture: UploadFile = File(None), 
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
    name: Optional[str] = None,         
    specialty: Optional[str] = None,    
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """جلب جميع الـ HRs المتاحين في السيستم مع إمكانية البحث بالاسم أو التخصص"""
    
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


# 🌟 Endpoint عرض صفحة الـ HR التفصيلية للطالب مع المواعيد المتاحة فقط
@router.get("/hrs/{hr_user_id}", response_model=HRDetailForApplicant)
def get_hr_detail_for_applicant(
    hr_user_id: int,
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """عرض بيانات الـ HR التفصيلية للطالب مع قائمة المواعيد المتاحة فقط للحجز"""
    
    hr_user = db.query(User).filter(User.id == hr_user_id, User.role == "hr").first()
    if not hr_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="HR not found"
        )

    hr_profile = db.query(HRProfile).filter(HRProfile.user_id == hr_user_id).first()

    available_slots = (
        db.query(HRSlot)
        .filter(
            HRSlot.hr_id == hr_user_id,
            HRSlot.is_booked == False,
            HRSlot.is_locked == False,
            HRSlot.start_time > datetime.now()
        )
        .all()
    )

    return HRDetailForApplicant(
        id=hr_user.id,
        full_name=hr_user.full_name,
        job_title=hr_profile.job_title if hr_profile else None,
        experience_years=hr_profile.experience_years if hr_profile else None,
        current_company=hr_profile.current_company if hr_profile else None,
        bio=hr_profile.bio if hr_profile else None,
        linkedin_url=hr_profile.linkedin_url if hr_profile else None,
        skills=hr_profile.skills if hr_profile else None,
        achievements=hr_profile.achievements if hr_profile else None,
        profile_picture_path=hr_profile.profile_picture_path if hr_profile else None,
        available_slots=available_slots
    )


# 🔒 Endpoint قفل الميعاد مؤقتاً للطالب (Temporary Lock)
@router.post("/slots/{slot_id}/lock")
def lock_slot(
    slot_id: int,
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """قفل الميعاد مؤقتاً لمدة 10 دقائق أثناء وجود الطالب في صفحة الدفع"""
    slot = db.query(HRSlot).filter(HRSlot.id == slot_id).first()
    
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
        
    if slot.is_booked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slot is already booked")
        
    if slot.is_locked and hasattr(slot, "locked_until") and slot.locked_until:
        if slot.locked_until > datetime.now():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slot is temporarily locked by another user")

    slot.is_locked = True
    
    for attr in ["locked_by_user_id", "applicant_id", "user_id"]:
        if hasattr(slot, attr):
            setattr(slot, attr, current_applicant.id)
            
    if hasattr(slot, "locked_until"):
        slot.locked_until = datetime.now() + timedelta(minutes=10)

    db.commit()
    db.refresh(slot)

    return {
        "message": "Slot locked successfully for 10 minutes",
        "slot_id": slot.id,
        "is_locked": slot.is_locked
    }


# 💳 Endpoint تأكيد الدفع التجريبي والتأكيد النهائي للحجز وتوليد رابط Google Meet
# 💳 Endpoint تأكيد الدفع التجريبي والتأكيد النهائي للحجز وتوليد رابط Google Meet
@router.post("/slots/{slot_id}/confirm-payment")
def confirm_payment(
    slot_id: int,
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """تأكيد الدفع التجريبي وتحويل حالة الميعاد إلى محجوز نهائياً وتوليد رابط Google Meet تلقائياً"""
    slot = db.query(HRSlot).filter(HRSlot.id == slot_id).first()

    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    # 🔒 حماية: يمنع إعادة حجز الميعاد لو محجوز بالفعل!
    if slot.is_booked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This slot is already booked by another applicant!"
        )

    hr_user = db.query(User).filter(User.id == slot.hr_id).first()

    slot.is_booked = True
    slot.is_locked = False

    for attr in ["locked_by_user_id", "applicant_id", "user_id"]:
        if hasattr(slot, attr):
            setattr(slot, attr, current_applicant.id)

    # 🚀 توليد رابط Google Meet تلقائياً
    try:
        student_email = getattr(current_applicant, "email", "applicant@example.com")
        hr_name = hr_user.full_name if hr_user else "HR"

        start_iso = slot.start_time.isoformat() if hasattr(slot.start_time, "isoformat") else str(slot.start_time)
        end_time_dt = slot.start_time + timedelta(minutes=30) if hasattr(slot.start_time, "__add__") else datetime.now() + timedelta(minutes=30)
        end_iso = end_time_dt.isoformat() if hasattr(end_time_dt, "isoformat") else str(end_time_dt)

        meet_result = create_google_meet_event(
            summary=f"HR Interview - {hr_name} & {current_applicant.full_name}",
            start_time=start_iso,
            end_time=end_iso,
            applicant_email=student_email
        )

        if meet_result and meet_result.get("meet_link"):
            for attr in ["meeting_link", "link", "zoom_link"]:
                if hasattr(slot, attr):
                    setattr(slot, attr, meet_result["meet_link"])

    except Exception as e:
        print(f"Calendar Error: {str(e)}")

    db.commit()
    db.refresh(slot)

    generated_link = (
        getattr(slot, "meeting_link", None) or 
        getattr(slot, "link", None) or 
        getattr(slot, "zoom_link", None)
    )

    return {
        "message": "Payment confirmed and slot booked successfully!",
        "slot_id": slot.id,
        "is_booked": slot.is_booked,
        "is_locked": slot.is_locked,
        "meeting_link": generated_link
    }
    


# 🔔 📅 صندوق إشعارات وحجوزات الطالب مع العداد التنازلي ورابط الميتينج
# 🔔 📅 صندوق إشعارات وحجوزات الطالب الحالي فقط مع العداد التنازلي ورابط الميتينج
@router.get("/my-notifications")
def get_applicant_notifications(
    current_applicant: User = Depends(get_current_applicant),
    db: Session = Depends(get_db)
):
    """صندوق الإشعارات والمواعيد القادمة الخاصة بالطالب الحالي فقط"""
    
    # 🔒 فلترة المواعيد المحجوزة لتظهر فقط للطالب الذي قام بالحجز!
    bookings = (
        db.query(HRSlot)
        .filter(
            HRSlot.is_booked == True,
            HRSlot.locked_by_user_id == current_applicant.id  # يجيب حجوزات الطالب الحالي فقط
        )
        .all()
    )
    
    notifications = []
    now = datetime.now()
    
    for slot in bookings:
        hr_user = db.query(User).filter(User.id == slot.hr_id).first()
        hr_profile = db.query(HRProfile).filter(HRProfile.user_id == slot.hr_id).first()
        
        time_diff = slot.start_time - now
        if time_diff.total_seconds() > 0:
            hours_left = int(time_diff.total_seconds() // 3600)
            minutes_left = int((time_diff.total_seconds() % 3600) // 60)
            countdown_status = f"متبقي {hours_left} ساعة و {minutes_left} دقيقة"
            is_upcoming = True
        else:
            countdown_status = "الميعاد حان الآن أو انتهى"
            is_upcoming = False

        meeting_link = (
            getattr(slot, "meeting_link", None) or 
            getattr(slot, "link", None) or 
            getattr(slot, "zoom_link", None)
        )

        notifications.append({
            "slot_id": slot.id,
            "hr_name": hr_user.full_name if hr_user else "HR",
            "hr_company": hr_profile.current_company if hr_profile else None,
            "start_time": slot.start_time,
            "time_remaining": countdown_status,
            "is_upcoming": is_upcoming,
            "meeting_link": meeting_link
        })
        
    return notifications
import os
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session

from app.db.dependencies import get_db, get_current_hr
from app.models.user import User
from app.models.hr_profile import HRProfile
from app.models.applicant_profile import ApplicantProfile
from app.models.slot import HRSlot
from app.schemas.hr import HRProfileResponse
from app.schemas.slot import SlotCreate, SlotResponse

router = APIRouter(
    prefix="/hr",
    tags=["HR Profile & Slots"]
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


# ==========================================
# 🕒 قسم إدارة المواعيد المتاحة (HR Slots)
# ==========================================

@router.post("/slots", response_model=SlotResponse, status_code=status.HTTP_201_CREATED)
def create_slot(
    slot_data: SlotCreate,
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """إضافة ميعاد إنترفيو جديد متاح للـ HR"""
    
    # التأكد إن الميعاد في المستقبل مش في الماضي
    if slot_data.start_time <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add a slot time in the past"
        )

    new_slot = HRSlot(
        hr_id=current_hr.id,
        start_time=slot_data.start_time,
        price=slot_data.price
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot


@router.get("/slots", response_model=List[SlotResponse])
def get_my_slots(
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """عرض جميع المواعيد الخاصة بالـ HR الحالي"""
    slots = db.query(HRSlot).filter(HRSlot.hr_id == current_hr.id).all()
    return slots


@router.delete("/slots/{slot_id}", status_code=status.HTTP_200_OK)
def delete_slot(
    slot_id: int,
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """حذف ميعاد (مسموح فقط لو الميعاد غير محجوز ومفيش عليه حجز مؤقت)"""
    slot = (
        db.query(HRSlot)
        .filter(HRSlot.id == slot_id, HRSlot.hr_id == current_hr.id)
        .first()
    )
    
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found"
        )

    if slot.is_booked or slot.is_locked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a slot that is already booked or currently locked"
        )

    db.delete(slot)
    db.commit()
    return {"message": "Slot deleted successfully"}


# 📅 Endpoint عرض المواعيد المحجوزة للـ HR مع حساب الوقت المتبقي
@router.get("/my-schedule")
def get_hr_schedule(
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """عرض أجندة المواعيد المحجوزة الخاصة بالـ HR مع تفاصيل الطالب والوقت المتبقي"""
    
    booked_slots = (
        db.query(HRSlot)
        .filter(
            HRSlot.hr_id == current_hr.id,
            HRSlot.is_booked == True
        )
        .all()
    )
    
    now = datetime.now()
    results = []
    
    for slot in booked_slots:
        student_user = db.query(User).filter(User.id == slot.locked_by_user_id).first()
        student_profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == slot.locked_by_user_id).first()
        
        # حساب الوقت المتبقي
        time_diff = slot.start_time - now
        if time_diff.total_seconds() > 0:
            hours_left = int(time_diff.total_seconds() // 3600)
            minutes_left = int((time_diff.total_seconds() % 3600) // 60)
            countdown_status = f"متبقي {hours_left} ساعة و {minutes_left} دقيقة"
        else:
            countdown_status = "الميعاد حان الآن أو انتهى"

        results.append({
            "slot_id": slot.id,
            "start_time": slot.start_time,
            "time_remaining": countdown_status,
            "price": slot.price,
            "student_id": slot.locked_by_user_id,
            "student_name": student_user.full_name if student_user else "Unknown Student",
            "student_university": student_profile.university if student_profile else None,
            "student_cv": student_profile.cv_path if student_profile else None,
            "meeting_link": getattr(slot, "meeting_link", None),
            "message_sent": getattr(slot, "hr_message", None)
        })
        
    return results


# 📩 🌟 Endpoint إرسال رابط الميتينج والرسالة للطالب
@router.post("/slots/{slot_id}/send-meeting")
def send_meeting_details(
    slot_id: int,
    meeting_link: str = Form(...),
    message: Optional[str] = Form(None),
    current_hr: User = Depends(get_current_hr),
    db: Session = Depends(get_db)
):
    """الـ HR يبعت رابط الميتينج ورسالة للطالب المحدد لهذا الميعاد"""
    slot = db.query(HRSlot).filter(HRSlot.id == slot_id, HRSlot.hr_id == current_hr.id).first()
    
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
        
    if not slot.is_booked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot send meeting link for an unbooked slot")

    # حفظ رابط الميتينج والرسالة
    slot.meeting_link = meeting_link
    slot.hr_message = message

    db.commit()
    
    return {
        "message": "Meeting link and message sent successfully to student!",
        "slot_id": slot.id,
        "meeting_link": slot.meeting_link,
        "hr_message": message
    }
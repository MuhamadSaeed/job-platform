from pydantic import BaseModel, Field
from typing import Optional

class ApplicantProfileUpdate(BaseModel):
    is_student: bool = Field(False, description="هل أنت طالب حالياً؟")
    university: str = Field(..., max_length=255, description="الجامعة")
    education: str = Field(..., max_length=255, description="المؤهل التعليمي أو الكلية")
    graduation_year: int = Field(..., description="سنة التخرج الفعلية أو المتوقعة")
    skills: str = Field(..., max_length=500, description="المهارات (افصل بينها بفواصل)")
    cv_path: str = Field(..., max_length=255, description="مسار ملف الـ CV المرفوع")
    
    # حقول اختيارية
    experience: Optional[str] = Field(None, max_length=500, description="الخبرات السابقة")
    bio: Optional[str] = Field(None, max_length=500, description="نبذة تعريفية")
    linkedin_url: Optional[str] = Field(None, max_length=255, description="رابط لينكد إن")
    github_url: Optional[str] = Field(None, max_length=255, description="رابط جيت هاب")
    portfolio_url: Optional[str] = Field(None, max_length=255, description="رابط معرض الأعمال")

class ApplicantProfileResponse(BaseModel):
    id: int
    user_id: int
    is_student: bool
    university: str
    education: str
    graduation_year: int
    skills: str
    cv_path: str
    experience: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    profile_picture_path: Optional[str] = None # حقل الصورة الشخصية الجديد للطالب

    class Config:
        from_attributes = True
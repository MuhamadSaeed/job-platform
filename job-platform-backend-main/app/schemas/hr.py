from pydantic import BaseModel, Field
from typing import Optional

class HRProfileUpdate(BaseModel):
    job_title: str = Field(..., max_length=255, description="المسمى الوظيفي أو التخصص")
    experience_years: int = Field(..., ge=0, description="عدد سنين الخبرة")
    
    # حقول اختيارية
    current_company: Optional[str] = Field(None, max_length=255, description="الشركة الحالية")
    cv_path: Optional[str] = Field(None, max_length=255, description="مسار ملف الـ CV")
    bio: Optional[str] = Field(None, description="نبذة تعريفية")
    linkedin_url: Optional[str] = Field(None, max_length=255, description="رابط حساب لينكد إن")

class HRProfileResponse(BaseModel):
    id: int
    user_id: int
    job_title: str
    experience_years: int
    current_company: Optional[str] = None
    cv_path: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None

    class Config:
        from_attributes = True
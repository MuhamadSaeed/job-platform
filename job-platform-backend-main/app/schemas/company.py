from pydantic import BaseModel, Field
from typing import Optional

# البيانات المطلوبة لإنشاء أو تحديث بروفايل الشركة
class CompanyProfileUpdate(BaseModel):
    company_name: str = Field(..., max_length=255, description="اسم الشركة التجاري")
    industry: str = Field(..., max_length=255, description="مجال عمل الشركة")
    website: str = Field(..., max_length=255, description="الموقع الإلكتروني أو رابط لينكد إن")
    location: str = Field(..., max_length=255, description="المقر الرئيسي (المحافظة/المنطقة)")
    commercial_registry: str = Field(..., max_length=100, description="رقم السجل التجاري للشركة")
    
    # حقول اختيارية
    company_size: Optional[str] = Field(None, max_length=50, description="حجم الشركة (مثال: 11-50 موظف)")
    description: Optional[str] = Field(None, description="نبذة تعريفية عن الشركة")
    logo_path: Optional[str] = Field(None, max_length=255, description="مسار لوجو الشركة")

# شكل البيانات اللي هيرجع من السيرفر بعد الحفظ
class CompanyProfileResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    industry: str
    website: str
    location: str
    commercial_registry: str
    company_size: Optional[str] = None
    description: Optional[str] = None
    logo_path: Optional[str] = None

    class Config:
        from_attributes = True
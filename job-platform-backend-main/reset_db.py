from app.db.session import engine
from app.db.base import Base
# بنعمل استيراد للموديلات عشان الـ Base يشوفهم
from app.models.user import User
from app.models.company_profile import CompanyProfile
from app.models.hr_profile import HRProfile
from app.models.applicant_profile import ApplicantProfile

def reset_database():
    print("⏳ جاري حذف الجداول القديمة المسببة للمشاكل...")
    Base.metadata.drop_all(bind=engine)
    
    print("🚀 جاري إعادة إنشاء الجداول بالحقول الجديدة كاملة...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ الداتابيز بقت جاهزة ونضيفة 100%!")

if __name__ == "__main__":
    reset_database()
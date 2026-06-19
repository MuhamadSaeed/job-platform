from fastapi import APIRouter, Depends

from app.db.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "national_id": current_user.national_id,
        "age": current_user.age,
        "gender": current_user.gender,
        "email_verified": current_user.email_verified,
        "phone_verified": current_user.phone_verified
    }

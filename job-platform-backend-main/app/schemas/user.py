from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class UserRole(str, Enum):
    applicant = "applicant"
    hr = "hr"
    company = "company"


class UserRegister(BaseModel):
    full_name: str = Field(min_length=3, max_length=255)
    age: int
    gender: str

    national_id: str
    phone_number: str

    email: EmailStr
    password: str = Field(min_length=8)

    role: UserRole


class UserLogin(BaseModel):
    email: EmailStr
    password: str
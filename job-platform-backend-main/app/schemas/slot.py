from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# البيانات اللي الـ HR بيبعتها لما يضيف ميعاد جديد
class SlotCreate(BaseModel):
    start_time: datetime = Field(..., description="تاريخ ووقت بداية الإنترفيو YYYY-MM-DD HH:MM:SS")
    price: float = Field(..., ge=0, description="سعر الجلسة بالجنيه")

# البيانات اللي بترجع من الـ API للطالب أو الـ HR
class SlotResponse(BaseModel):
    id: int
    hr_id: int
    start_time: datetime
    price: float
    is_booked: bool
    is_locked: bool

    class Config:
        from_attributes = True
"""
Pydantic схемы для API календаря
"""

from pydantic import BaseModel
from typing import Dict, Any

class CalendarDate(BaseModel):
    """
    Схема для представления даты в календаре
    """
    year: int
    month: int
    day: int
    month_name: str
    day_name: str
    total_days: int

class TimeSpeed(BaseModel):
    """
    Схема для управления скоростью времени
    """
    speed: float
class AdvanceDaysRequest(BaseModel):
    """
    Схема для запроса на пропуск дней
    """
    days: int
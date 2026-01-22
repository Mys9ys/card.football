"""
API роуты для управления календарем и временем
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from .models import WorldCalendar
from .schemas import CalendarDate, TimeSpeed, AdvanceDaysRequest

# Глобальный экземпляр календаря (в реальном приложении это будет храниться в состоянии мира)
# В будущем нужно будет связать с конкретным миром
world_calendar = WorldCalendar()

calendar_router = APIRouter(
    prefix="/calendar",
    tags=["calendar"],
    responses={404: {"description": "Not found"}}
)

@calendar_router.get("/date", response_model=CalendarDate)
async def get_current_date() -> Dict[str, Any]:
    """
    Получить текущую дату в мире
    """
    return world_calendar.get_current_date()

@calendar_router.post("/advance_day", response_model=CalendarDate)
async def advance_day() -> Dict[str, Any]:
    """
    Перейти к следующему дню (кнопка "прожить день")
    """
    return world_calendar.advance_day()

@calendar_router.post("/advance_days", response_model=Dict[str, Any])
async def advance_days(request: AdvanceDaysRequest) -> Dict[str, Any]:
    """
    Прожить указанное количество дней
    
    Args:
        request (AdvanceDaysRequest): Запрос с количеством дней для пропуска
    """
    if request.days <= 0:
        raise HTTPException(status_code=400, detail="Количество дней должно быть положительным")
    
    if request.days > 1000:
        raise HTTPException(status_code=400, detail="Нельзя пропустить более 1000 дней за раз")
    
    date_history = world_calendar.advance_days(request.days)
    return {
        "message": f"Прожито {request.days} дней",
        "start_date": date_history[0],
        "end_date": date_history[-1],
        "total_days_advanced": request.days
    }

@calendar_router.get("/time_speed", response_model=TimeSpeed)
async def get_time_speed() -> Dict[str, float]:
    """
    Получить текущую скорость течения времени
    """
    return {"speed": world_calendar.get_time_speed()}

@calendar_router.post("/time_speed", response_model=TimeSpeed)
async def set_time_speed(speed: TimeSpeed) -> Dict[str, float]:
    """
    Установить скорость течения времени
    
    Args:
        speed (TimeSpeed): Новая скорость времени
    """
    if speed.speed <= 0:
        raise HTTPException(status_code=400, detail="Скорость времени должна быть положительной")
    
    world_calendar.set_time_speed(speed.speed)
    return {"speed": world_calendar.get_time_speed()}

@calendar_router.get("/info")
async def get_calendar_info() -> Dict[str, Any]:
    """
    Получить информацию о структуре календаря
    """
    return {
        "months_count": world_calendar.get_months_in_year(),
        "days_per_month": world_calendar.get_days_in_month(),
        "month_names": world_calendar.month_names,
        "day_names": world_calendar.day_names,
        "current_date": world_calendar.get_current_date()
    }
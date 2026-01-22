"""
Pydantic схемы для API человечков
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any

class HumanCreate(BaseModel):
    """
    Схема для создания нового человечка
    """
    name: str
    age: int = 0
    gender: str  # "male" или "female"
    x: float = 0.0
    y: float = 0.0
    health: float = 100.0
    energy: float = 100.0
    mood: float = 50.0
    state: str = "awake"

class HumanUpdate(BaseModel):
    """
    Схема для обновления данных человечка
    """
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    health: Optional[float] = None
    energy: Optional[float] = None
    mood: Optional[float] = None
    state: Optional[str] = None

class HumanStatus(BaseModel):
    """
    Схема для статуса человечка
    """
    name: str
    age: int
    gender: str
    position: Dict[str, float]
    health: float
    energy: float
    mood: float
    state: str
    days_lived: int
    total_sleep_hours: float

class HumanAction(BaseModel):
    """
    Схема для выполнения действия
    """
    action: str  # "sleep", "work", "eat", "idle", "move"
    params: Dict[str, Any] = {}
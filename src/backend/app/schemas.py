# schemas.py
# Pydantic модели для валидации данных

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class WorldState(BaseModel):
    """Состояние мира"""
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    parameters: Dict[str, Any]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class WorldCreate(BaseModel):
    """Данные для создания нового мира"""
    name: str
    description: Optional[str] = None
    parameters: Dict[str, Any]

class WorldUpdate(BaseModel):
    """Данные для обновления мира"""
    name: Optional[str] = None
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
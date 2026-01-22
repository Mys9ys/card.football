# models.py
# SQLAlchemy модели для базы данных

from sqlalchemy import Column, String, Text, JSON, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class World(Base):
    """Модель для хранения состояния мира"""
    __tablename__ = "worlds"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    parameters = Column(JSON, nullable=False)
    calendar_state = Column(JSON, nullable=False, default=lambda: {
        "current_year": 1,
        "current_month": 1,
        "current_day": 1,
        "time_speed": 1.0,
        "total_days": 0
    })
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
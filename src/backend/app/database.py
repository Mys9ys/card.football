# database.py
# Настройка базы данных

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
import os

# Определяем URL базы данных
# В продакшене нужно использовать PostgreSQL или MySQL
SQLALCHEMY_DATABASE_URL = "sqlite:///./world_simulation.db"

# Создаем engine для базы данных
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # Только для SQLite
    poolclass=StaticPool  # Для тестирования
)

# Создаем SessionLocal для создания сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Создаем Base для моделей
Base = declarative_base()

def init_db():
    """Инициализация базы данных"""
    Base.metadata.create_all(bind=engine)
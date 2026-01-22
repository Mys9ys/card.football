# crud.py
# Операции CRUD для работы с данными

from sqlalchemy.orm import Session
import uuid
from . import models, schemas
from datetime import datetime

def get_world(db: Session, world_id: str):
    """Получить мир по ID"""
    return db.query(models.World).filter(models.World.id == world_id).first()

def get_worlds(db: Session, skip: int = 0, limit: int = 100):
    """Получить список миров"""
    return db.query(models.World).offset(skip).limit(limit).all()

def create_world(db: Session, world: schemas.WorldCreate):
    """Создать новый мир"""
    db_world = models.World(
        id=str(uuid.uuid4()),
        name=world.name,
        description=world.description,
        parameters=world.parameters
    )
    db.add(db_world)
    db.commit()
    db.refresh(db_world)
    return db_world

def update_world(db: Session, world_id: str, world_update: schemas.WorldUpdate):
    """Обновить существующий мир"""
    db_world = db.query(models.World).filter(models.World.id == world_id).first()
    if db_world is None:
        return None
    
    if world_update.name is not None:
        db_world.name = world_update.name
    if world_update.description is not None:
        db_world.description = world_update.description
    if world_update.parameters is not None:
        db_world.parameters = world_update.parameters
    
    db_world.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_world)
    return db_world

def delete_world(db: Session, world_id: str):
    """Удалить мир"""
    db_world = db.query(models.World).filter(models.World.id == world_id).first()
    if db_world is None:
        return False
    db.delete(db_world)
    db.commit()
    return True
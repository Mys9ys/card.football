# api.py
# Роутеры API

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from . import schemas, crud, database

# Создаем роутер
router = APIRouter()

# Зависимость для получения сессии базы данных
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/worlds", response_model=List[schemas.WorldState])
def read_worlds(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Получить список всех миров"""
    worlds = crud.get_worlds(db, skip=skip, limit=limit)
    return worlds

@router.get("/worlds/{world_id}", response_model=schemas.WorldState)
def read_world(world_id: str, db: Session = Depends(get_db)):
    """Получить конкретный мир по ID"""
    db_world = crud.get_world(db, world_id=world_id)
    if db_world is None:
        raise HTTPException(status_code=404, detail="Мир не найден")
    return db_world

@router.post("/worlds", response_model=schemas.WorldState)
def create_world(world: schemas.WorldCreate, db: Session = Depends(get_db)):
    """Создать новый мир"""
    return crud.create_world(db=db, world=world)

@router.put("/worlds/{world_id}", response_model=schemas.WorldState)
def update_world(world_id: str, world_update: schemas.WorldUpdate, db: Session = Depends(get_db)):
    """Обновить существующий мир"""
    db_world = crud.update_world(db, world_id=world_id, world_update=world_update)
    if db_world is None:
        raise HTTPException(status_code=404, detail="Мир не найден")
    return db_world

@router.delete("/worlds/{world_id}")
def delete_world(world_id: str, db: Session = Depends(get_db)):
    """Удалить мир"""
    success = crud.delete_world(db, world_id=world_id)
    if not success:
        raise HTTPException(status_code=404, detail="Мир не найден")
    return {"message": "Мир успешно удален"}
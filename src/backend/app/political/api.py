"""
Роутеры API для политических систем
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from . import schemas, crud, models

# Создаем роутер
router = APIRouter(prefix="/political", tags=["political"])

# Зависимость для получения сессии базы данных
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/countries", response_model=List[schemas.CountryResponse])
def read_countries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Получить список всех стран
    """
    countries = crud.get_countries(db, skip=skip, limit=limit)
    return countries

@router.get("/countries/{country_id}", response_model=schemas.CountryResponse)
def read_country(country_id: str, db: Session = Depends(get_db)):
    """
    Получить конкретную страну по ID
    """
    db_country = crud.get_country(db, country_id=country_id)
    if db_country is None:
        raise HTTPException(status_code=404, detail="Страна не найдена")
    return db_country

@router.post("/countries", response_model=schemas.CountryResponse)
def create_country(country: schemas.CountryCreate, db: Session = Depends(get_db)):
    """
    Создать новую страну
    """
    return crud.create_country(db=db, country=country)

@router.put("/countries/{country_id}", response_model=schemas.CountryResponse)
def update_country(country_id: str, country_update: schemas.CountryUpdate, db: Session = Depends(get_db)):
    """
    Обновить существующую страну
    """
    db_country = crud.update_country(db, country_id=country_id, country_update=country_update)
    if db_country is None:
        raise HTTPException(status_code=404, detail="Страна не найдена")
    return db_country

@router.delete("/countries/{country_id}")
def delete_country(country_id: str, db: Session = Depends(get_db)):
    """
    Удалить страну
    """
    success = crud.delete_country(db, country_id=country_id)
    if not success:
        raise HTTPException(status_code=404, detail="Страна не найдена")
    return {"message": "Страна успешно удалена"}

# API для регионов
@router.get("/regions", response_model=List[schemas.RegionResponse])
def read_regions(country_id: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Получить список регионов, опционально фильтруя по стране
    """
    regions = crud.get_regions(db, country_id=country_id, skip=skip, limit=limit)
    return regions

@router.get("/regions/{region_id}", response_model=schemas.RegionResponse)
def read_region(region_id: str, db: Session = Depends(get_db)):
    """
    Получить конкретный регион по ID
    """
    db_region = crud.get_region(db, region_id=region_id)
    if db_region is None:
        raise HTTPException(status_code=404, detail="Регион не найден")
    return db_region

@router.post("/regions", response_model=schemas.RegionResponse)
def create_region(region: schemas.RegionCreate, db: Session = Depends(get_db)):
    """
    Создать новый регион
    """
    return crud.create_region(db=db, region=region)

@router.put("/regions/{region_id}", response_model=schemas.RegionResponse)
def update_region(region_id: str, region_update: schemas.RegionUpdate, db: Session = Depends(get_db)):
    """
    Обновить существующий регион
    """
    db_region = crud.update_region(db, region_id=region_id, region_update=region_update)
    if db_region is None:
        raise HTTPException(status_code=404, detail="Регион не найден")
    return db_region

@router.delete("/regions/{region_id}")
def delete_region(region_id: str, db: Session = Depends(get_db)):
    """
    Удалить регион
    """
    success = crud.delete_region(db, region_id=region_id)
    if not success:
        raise HTTPException(status_code=404, detail="Регион не найден")
    return {"message": "Регион успешно удален"}

# API для городов
@router.get("/cities", response_model=List[schemas.CityResponse])
def read_cities(country_id: str = None, region_id: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Получить список городов, опционально фильтруя по стране или региону
    """
    cities = crud.get_cities(db, country_id=country_id, region_id=region_id, skip=skip, limit=limit)
    return cities

@router.get("/cities/{city_id}", response_model=schemas.CityResponse)
def read_city(city_id: str, db: Session = Depends(get_db)):
    """
    Получить конкретный город по ID
    """
    db_city = crud.get_city(db, city_id=city_id)
    if db_city is None:
        raise HTTPException(status_code=404, detail="Город не найден")
    return db_city

@router.post("/cities", response_model=schemas.CityResponse)
def create_city(city: schemas.CityCreate, db: Session = Depends(get_db)):
    """
    Создать новый город
    """
    return crud.create_city(db=db, city=city)

@router.put("/cities/{city_id}", response_model=schemas.CityResponse)
def update_city(city_id: str, city_update: schemas.CityUpdate, db: Session = Depends(get_db)):
    """
    Обновить существующий город
    """
    db_city = crud.update_city(db, city_id=city_id, city_update=city_update)
    if db_city is None:
        raise HTTPException(status_code=404, detail="Город не найден")
    return db_city

@router.delete("/cities/{city_id}")
def delete_city(city_id: str, db: Session = Depends(get_db)):
    """
    Удалить город
    """
    success = crud.delete_city(db, city_id=city_id)
    if not success:
        raise HTTPException(status_code=404, detail="Город не найден")
    return {"message": "Город успешно удален"}
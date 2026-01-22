"""
Операции CRUD для работы с политическими данными
"""

from sqlalchemy.orm import Session
import uuid
from . import models, schemas
from datetime import datetime

def get_country(db: Session, country_id: str):
    """
    Получить страну по ID
    """
    return db.query(models.Country).filter(models.Country.id == country_id).first()

def get_countries(db: Session, skip: int = 0, limit: int = 100):
    """
    Получить список стран
    """
    return db.query(models.Country).offset(skip).limit(limit).all()

def create_country(db: Session, country: schemas.CountryCreate):
    """
    Создать новую страну
    """
    db_country = models.Country(
        id=str(uuid.uuid4()),
        name=country.name,
        color=country.color,
        population=country.population,
        area=country.area,
        government_type=country.government_type
    )
    db.add(db_country)
    db.commit()
    db.refresh(db_country)
    return db_country
def update_country(db: Session, country_id: str, country_update: schemas.CountryUpdate):
    """
    Обновить существующую страну
    """
    db_country = db.query(models.Country).filter(models.Country.id == country_id).first()
    if db_country is None:
        return None
    
    if country_update.name is not None:
        db_country.name = country_update.name
    if country_update.color is not None:
        db_country.color = country_update.color
    if country_update.population is not None:
        db_country.population = country_update.population
    if country_update.area is not None:
        db_country.area = country_update.area
    if country_update.government_type is not None:
        db_country.government_type = country_update.government_type
    
    db_country.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_country)
    return db_country
def delete_country(db: Session, country_id: str):
    """
    Удалить страну
    """
    db_country = db.query(models.Country).filter(models.Country.id == country_id).first()
    if db_country is None:
        return False
    db.delete(db_country)
    db.commit()
    return True
# CRUD операции для регионов
def get_region(db: Session, region_id: str):
    """
    Получить регион по ID
    """
    return db.query(models.Region).filter(models.Region.id == region_id).first()

def get_regions(db: Session, country_id: str = None, skip: int = 0, limit: int = 100):
    """
    Получить список регионов, опционально фильтруя по стране
    """
    query = db.query(models.Region)
    if country_id:
        query = query.filter(models.Region.country_id == country_id)
    return query.offset(skip).limit(limit).all()

def create_region(db: Session, region: schemas.RegionCreate):
    """
    Создать новый регион
    """
    db_region = models.Region(
        id=str(uuid.uuid4()),
        name=region.name,
        country_id=region.country_id,
        area=region.area,
        population=region.population,
        coordinates=region.coordinates
    )
    db.add(db_region)
    db.commit()
    db.refresh(db_region)
    return db_region
def update_region(db: Session, region_id: str, region_update: schemas.RegionUpdate):
    """
    Обновить существующий регион
    """
    db_region = db.query(models.Region).filter(models.Region.id == region_id).first()
    if db_region is None:
        return None
    
    if region_update.name is not None:
        db_region.name = region_update.name
    if region_update.area is not None:
        db_region.area = region_update.area
    if region_update.population is not None:
        db_region.population = region_update.population
    if region_update.coordinates is not None:
        db_region.coordinates = region_update.coordinates
    
    db.commit()
    db.refresh(db_region)
    return db_region
def delete_region(db: Session, region_id: str):
    """
    Удалить регион
    """
    db_region = db.query(models.Region).filter(models.Region.id == region_id).first()
    if db_region is None:
        return False
    db.delete(db_region)
    db.commit()
    return True
# CRUD операции для городов
def get_city(db: Session, city_id: str):
    """
    Получить город по ID
    """
    return db.query(models.City).filter(models.City.id == city_id).first()

def get_cities(db: Session, country_id: str = None, region_id: str = None, skip: int = 0, limit: int = 100):
    """
    Получить список городов, опционально фильтруя по стране или региону
    """
    query = db.query(models.City)
    if country_id:
        query = query.filter(models.City.country_id == country_id)
    if region_id:
        query = query.filter(models.City.region_id == region_id)
    return query.offset(skip).limit(limit).all()

def create_city(db: Session, city: schemas.CityCreate):
    """
    Создать новый город
    """
    db_city = models.City(
        id=str(uuid.uuid4()),
        name=city.name,
        population=city.population,
        x=city.x,
        y=city.y,
        city_type=city.city_type,
        region_id=city.region_id,
        country_id=city.country_id,
        is_capital=city.is_capital
    )
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city
def update_city(db: Session, city_id: str, city_update: schemas.CityUpdate):
    """
    Обновить существующий город
    """
    db_city = db.query(models.City).filter(models.City.id == city_id).first()
    if db_city is None:
        return None
    
    if city_update.name is not None:
        db_city.name = city_update.name
    if city_update.population is not None:
        db_city.population = city_update.population
    if city_update.x is not None:
        db_city.x = city_update.x
    if city_update.y is not None:
        db_city.y = city_update.y
    if city_update.city_type is not None:
        db_city.city_type = city_update.city_type
    if city_update.region_id is not None:
        db_city.region_id = city_update.region_id
    if city_update.is_capital is not None:
        db_city.is_capital = city_update.is_capital
    
    db.commit()
    db.refresh(db_city)
    return db_city
def delete_city(db: Session, city_id: str):
    """
    Удалить город
    """
    db_city = db.query(models.City).filter(models.City.id == city_id).first()
    if db_city is None:
        return False
    db.delete(db_city)
    db.commit()
    return True
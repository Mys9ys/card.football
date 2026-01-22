"""
Pydantic модели для валидации данных политических систем
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Базовые модели

class CountryBase(BaseModel):
    name: str
    color: str
    population: Optional[int] = 0
    area: Optional[float] = 0.0
    government_type: Optional[str] = None


class RegionBase(BaseModel):
    name: str
    country_id: str
    area: Optional[float] = 0.0
    population: Optional[int] = 0
    coordinates: List[List[float]]  # Массив координат [[x1,y1], [x2,y2], ...]


class CityBase(BaseModel):
    name: str
    population: Optional[int] = 0
    x: float
    y: float
    city_type: Optional[str] = "city"
    region_id: Optional[str] = None
    country_id: str
    is_capital: Optional[int] = 0

# Модели для создания

class CountryCreate(CountryBase):
    pass


class RegionCreate(RegionBase):
    pass


class CityCreate(CityBase):
    pass

# Модели для обновления

class CountryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    population: Optional[int] = None
    area: Optional[float] = None
    government_type: Optional[str] = None


class RegionUpdate(BaseModel):
    name: Optional[str] = None
    area: Optional[float] = None
    population: Optional[int] = None
    coordinates: Optional[List[List[float]]] = None


class CityUpdate(BaseModel):
    name: Optional[str] = None
    population: Optional[int] = None
    x: Optional[float] = None
    y: Optional[float] = None
    city_type: Optional[str] = None
    region_id: Optional[str] = None
    is_capital: Optional[int] = None

# Полные модели с ID и временными метками

class Country(CountryBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    capital_id: Optional[str] = None
    
    class Config:
        orm_mode = True


class Region(RegionBase):
    id: str
    
    class Config:
        orm_mode = True


class City(CityBase):
    id: str
    
    class Config:
        orm_mode = True

# Модели для ответов API

class CountryResponse(Country):
    regions: List[Region] = []
    cities: List[City] = []
    

class RegionResponse(Region):
    country: CountryBase
    cities: List[City] = []
    

class CityResponse(City):
    country: CountryBase
    region: Optional[RegionBase] = None
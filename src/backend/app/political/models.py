"""
Модели для политических систем и административных единиц
"""

from sqlalchemy import Column, String, Integer, Float, JSON, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Country(Base):
    """
    Модель страны (государства)
    """
    __tablename__ = "countries"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    color = Column(String, nullable=False)  # Цвет для отображения на карте (в формате HEX)
    population = Column(Integer, default=0)
    area = Column(Float, default=0.0)  # Площадь в условных единицах
    government_type = Column(String, nullable=True)  # Тип правления
    capital_id = Column(String, ForeignKey("cities.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    regions = relationship("Region", back_populates="country")
    cities = relationship("City", back_populates="country")
    capital = relationship("City", foreign_keys=[capital_id])
    

class Region(Base):
    """
    Модель региона (административной единицы внутри страны)
    """
    __tablename__ = "regions"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    country_id = Column(String, ForeignKey("countries.id"), nullable=False)
    area = Column(Float, default=0.0)
    population = Column(Integer, default=0)
    coordinates = Column(JSON, nullable=False)  # Координаты границ региона
    
    # Связи
    country = relationship("Country", back_populates="regions")
    cities = relationship("City", back_populates="region")
    

class City(Base):
    """
    Модель города или поселения
    """
    __tablename__ = "cities"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    population = Column(Integer, default=0)
    x = Column(Float, nullable=False)  # Координата X на карте
    y = Column(Float, nullable=False)  # Координата Y на карте
    city_type = Column(String, default="city")  # city, town, village
    region_id = Column(String, ForeignKey("regions.id"), nullable=True)
    country_id = Column(String, ForeignKey("countries.id"), nullable=False)
    is_capital = Column(Integer, default=0)  # 1 если столица страны, 2 если столица региона
    
    # Связи
    country = relationship("Country", back_populates="cities")
    region = relationship("Region", back_populates="cities")
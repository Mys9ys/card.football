# main.py
# Основной файл приложения FastAPI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router
from .political.api import router as political_router
from .calendar.api import calendar_router
from .human.api.router import router as human_router

app = FastAPI(title="Мир эмуляции", description="Backend для эмуляции мира")

# Настраиваем CORS для разрешения запросов с frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене нужно указать конкретный домен frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(router, prefix="/api")
app.include_router(political_router, prefix="/api")
app.include_router(calendar_router, prefix="/api")
app.include_router(human_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в эмуляцию мира!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

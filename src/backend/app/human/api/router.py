"""
Маршруты API для управления человечками
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ..models import Human
from ..schemas import HumanCreate, HumanUpdate, HumanStatus, HumanAction

# Глобальное хранилище человечков (в реальном приложении будет база данных)
human_storage = {}
current_id = 1

class HumanAPI:
    """
    Класс для управления API человечков
    """
    
    def __init__(self):
        self.router = APIRouter(
            prefix="/human",
            tags=["human"],
            responses={404: {"description": "Not found"}}
        )
        self.setup_routes()
    
    def setup_routes(self):
        """
        Настройка маршрутов API
        """
        @self.router.get("/", response_model=List[HumanStatus])
        async def get_humans() -> List[Dict[str, Any]]:
            """
            Получить список всех человечков
            """
            return [human.get_status() for human in human_storage.values()]

        @self.router.get("/{human_id}", response_model=HumanStatus)
        async def get_human(human_id: int) -> Dict[str, Any]:
            """
            Получить информацию о конкретном человечке
            
            Args:
                human_id: ID человечка
            """
            if human_id not in human_storage:
                raise HTTPException(status_code=404, detail="Human not found")
            return human_storage[human_id].get_status()
            
        @self.router.post("/", response_model=HumanStatus)
        async def create_human(human_data: HumanCreate) -> Dict[str, Any]:
            """
            Создать нового человечка
            
            Args:
                human_data: Данные для создания человечка
            """
            global current_id
            
            human = Human(
                name=human_data.name,
                age=human_data.age,
                gender=human_data.gender,
                x=human_data.x,
                y=human_data.y,
                health=human_data.health,
                energy=human_data.energy,
                mood=human_data.mood,
                state=human_data.state
            )
            
            human_storage[current_id] = human
            human_status = human.get_status()
            human_status["id"] = current_id
            
            current_id += 1
            return human_status
        
        @self.router.put("/{human_id}", response_model=HumanStatus)
        async def update_human(human_id: int, human_data: HumanUpdate) -> Dict[str, Any]:
            """
            Обновить данные человечка
            
            Args:
                human_id: ID человечка
                human_data: Новые данные для обновления
            """
            if human_id not in human_storage:
                raise HTTPException(status_code=404, detail="Human not found")
            
            human = human_storage[human_id]
            
            # Обновляем только переданные поля
            if human_data.name is not None:
                human.name = human_data.name
            if human_data.age is not None:
                human.age = human_data.age
            if human_data.gender is not None:
                human.gender = human_data.gender
            if human_data.x is not None:
                human.x = human_data.x
            if human_data.y is not None:
                human.y = human_data.y
            if human_data.health is not None:
                human.health = human_data.health
            if human_data.energy is not None:
                human.energy = human_data.energy
            if human_data.mood is not None:
                human.mood = human_data.mood
            if human_data.state is not None:
                human.state = human_data.state
            
            return human.get_status()
            
        @self.router.delete("/{human_id}")
        async def delete_human(human_id: int) -> Dict[str, str]:
            """
            Удалить человечка
            
            Args:
                human_id: ID человечка для удаления
            """
            if human_id not in human_storage:
                raise HTTPException(status_code=404, detail="Human not found")
            
            del human_storage[human_id]
            return {"message": f"Human {human_id} deleted successfully"}
            
        @self.router.post("/{human_id}/action")
        async def perform_action(human_id: int, action_data: HumanAction) -> Dict[str, Any]:
            """
            Выполнить действие с человечком
            
            Args:
                human_id: ID человечка
                action_data: Данные действия
            """
            if human_id not in human_storage:
                raise HTTPException(status_code=404, detail="Human not found")
            
            human = human_storage[human_id]
            action = action_data.action
            params = action_data.params
            
            # Выполняем действие в зависимости от типа
            if action == "sleep":
                hours = params.get("hours", 8)
                human.sleep(hours)
            elif action == "work":
                hours = params.get("hours", 8)
                human.work(hours)
            elif action == "eat":
                food_quality = params.get("food_quality", 1.0)
                human.eat(food_quality)
            elif action == "idle":
                human.idle()
            elif action == "move":
                dx = params.get("dx", 0)
                dy = params.get("dy", 0)
                human.move(dx, dy)
            else:
                raise HTTPException(status_code=400, detail=f"Unknown action: {action}")
            
            # Добавляем ID в статус
            human_status = human.get_status()
            human_status["id"] = human_id
            return human_status

# Создаем экземпляр API
human_api = HumanAPI()

# Экспортируем роутер
router = human_api.router
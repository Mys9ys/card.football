"""
Модели для человечков в эмуляции мира
"""

class Human:
    """
    Базовый класс для человечков в симуляции
    """
    
    def __init__(
        self,
        name: str = "",
        age: int = 0,
        gender: str = "",
        x: float = 0.0,
        y: float = 0.0,
        health: float = 100.0,
        energy: float = 100.0,
        mood: float = 50.0,
        state: str = "awake"
    ):
        """
        Инициализация человечка
        
        Args:
            name: Имя человечка
            age: Возраст
            gender: Пол ("male", "female")
            x, y: Позиция на карте
            health: Уровень здоровья (0-100)
            energy: Уровень энергии (0-100)
            mood: Уровень настроения (0-100)
            state: Текущее состояние ("awake", "sleeping", "working", "eating", "idle")
        """
        self.name = name
        self.age = age
        self.gender = gender
        self.x = x
        self.y = y
        self.health = health
        self.energy = energy
        self.mood = mood
        self.state = state
        
        # Внутренние счетчики
        self.days_lived = 0
        self.total_sleep_hours = 0
        
    def __str__(self) -> str:
        """
        Строковое представление человечка
        """
        return f"Human(name='{self.name}', age={self.age}, gender='{self.gender}', " \
               f"pos=({self.x:.1f}, {self.y:.1f}), health={self.health:.1f}, " \
               f"energy={self.energy:.1f}, mood={self.mood:.1f}, state='{self.state}')"
               
    def __repr__(self) -> str:
        """
        Представление для отладки
        """
        return self.__str__()
    
    def update_age(self, days_passed: int = 1) -> None:
        """
        Обновить возраст человечка
        
        Args:
            days_passed: Количество прошедших дней
        """
        self.days_lived += days_passed
        # Возраст увеличивается каждые 365 дней
        if self.days_lived >= 365:
            self.age += self.days_lived // 365
            self.days_lived = self.days_lived % 365
            
    def sleep(self, hours: float) -> None:
        """
        Сон - восстанавливает энергию
        
        Args:
            hours: Количество часов сна
        """
        self.state = "sleeping"
        # Энергия восстанавливается, но не более 100
        self.energy = min(100.0, self.energy + hours * 10)
        self.total_sleep_hours += hours
        
        # После сна переходим в состояние бодрствования
        if self.energy >= 90:
            self.state = "awake"
            
    def work(self, hours: float) -> None:
        """
        Работа - тратит энергию, но может улучшить настроение
        
        Args:
            hours: Количество часов работы
        """
        self.state = "working"
        # Энергия тратится
        self.energy = max(0.0, self.energy - hours * 8)
        
        # Настроение может улучшиться от работы
        if self.mood < 80:
            self.mood = min(80.0, self.mood + 5)
            
        # Если энергия закончилась, переходим в состояние отдыха
        if self.energy < 20:
            self.state = "idle"
            
    def eat(self, food_quality: float = 1.0) -> None:
        """
        Прием пищи - восстанавливает здоровье и энергию
        
        Args:
            food_quality: Качество еды (0.5 - плохая, 1.0 - нормальная, 1.5 - хорошая)
        """
        self.state = "eating"
        # Восстановление здоровья и энергии в зависимости от качества еды
        self.health = min(100.0, self.health + 10 * food_quality)
        self.energy = min(100.0, self.energy + 15 * food_quality)
        
        # После еды переходим в состояние бодрствования
        self.state = "awake"
        
    def idle(self) -> None:
        """
        Бездеятельность - легкое восстановление энергии
        """
        self.state = "idle"
        # Легкое восстановление энергии при отдыхе
        self.energy = min(100.0, self.energy + 2)
        
    def move(self, dx: float, dy: float) -> None:
        """
        Перемещение по карте
        
        Args:
            dx: Смещение по X
            dy: Смещение по Y
        """
        self.x += dx
        self.y += dy
        
    def get_status(self) -> dict:
        """
        Получить текущий статус человечка
        
        Returns:
            Словарь с текущими параметрами
        """
        return {
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "position": {"x": self.x, "y": self.y},
            "health": round(self.health, 1),
            "energy": round(self.energy, 1),
            "mood": round(self.mood, 1),
            "state": self.state,
            "days_lived": self.days_lived,
            "total_sleep_hours": self.total_sleep_hours
        }
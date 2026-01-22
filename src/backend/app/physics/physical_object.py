"""
Базовый класс для физических объектов в эмуляции мира
"""

class PhysicalObject:
    """
    Базовый класс для всех физических объектов в симуляции
    """
    
    def __init__(self, position=0.0, velocity=0.0, mass=1.0, radius=1.0):
        """
        Инициализация физического объекта
        
        Args:
            position (float): Начальная позиция объекта
            velocity (float): Начальная скорость объекта
            mass (float): Масса объекта
            radius (float): Радиус объекта (для определения столкновений)
        """
        self.position = position
        self.velocity = velocity
        self.mass = mass
        self.radius = radius
        
    def __str__(self):
        """
        Строковое представление объекта
        """
        return f"PhysicalObject(pos={self.position}, vel={self.velocity}, mass={self.mass}, radius={self.radius})"
        
    def __repr__(self):
        """
        Представление объекта для отладки
        """
        return self.__str__()
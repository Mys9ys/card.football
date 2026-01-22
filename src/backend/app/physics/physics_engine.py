"""
Модуль для реализации физических законов в эмуляции мира
"""

class PhysicsEngine:
    """
    Основной движок физики для симуляции физических законов
    """
    
    def __init__(self, gravity=9.81):
        """
        Инициализация физического движка
        
        Args:
            gravity (float): Ускорение свободного падения (по умолчанию 9.81 м/с²)
        """
        self.gravity = gravity
        self.objects = []  # Список физических объектов в мире
        
    def add_object(self, obj):
        """
        Добавить объект в симуляцию
        
        Args:
            obj: Объект, который нужно добавить в симуляцию
        """
        self.objects.append(obj)
        
    def remove_object(self, obj):
        """
        Удалить объект из симуляции
        
        Args:
            obj: Объект, который нужно удалить из симуляции
        """
        if obj in self.objects:
            self.objects.remove(obj)
            
    def update(self, dt):
        """
        Обновить состояние физической симуляции
        
        Args:
            dt (float): Временной шаг обновления (в секундах)
        """
        for obj in self.objects:
            self.apply_gravity(obj, dt)
            self.update_position(obj, dt)
            
    def apply_gravity(self, obj, dt):
        """
        Применить гравитацию к объекту
        
        Args:
            obj: Объект, к которому применяется гравитация
            dt (float): Временной шаг
        """
        if hasattr(obj, 'mass') and hasattr(obj, 'velocity'):
            # F = m * a, где a = g (ускорение свободного падения)
            force = obj.mass * self.gravity
            # a = F / m = g
            acceleration = self.gravity
            # Изменение скорости: v = v0 + a * t
            obj.velocity += acceleration * dt
            
    def update_position(self, obj, dt):
        """
        Обновить позицию объекта на основе его скорости
        
        Args:
            obj: Объект, позицию которого нужно обновить
            dt (float): Временной шаг
        """
        if hasattr(obj, 'position') and hasattr(obj, 'velocity'):
            # s = s0 + v * t
            obj.position += obj.velocity * dt
            
    def check_collisions(self):
        """
        Проверить столкновения между объектами
        """
        for i in range(len(self.objects)):
            for j in range(i + 1, len(self.objects)):
                obj1 = self.objects[i]
                obj2 = self.objects[j]
                if self._are_colliding(obj1, obj2):
                    self._resolve_collision(obj1, obj2)
                    
    def _are_colliding(self, obj1, obj2):
        """
        Проверить, сталкиваются ли два объекта
        
        Args:
            obj1: Первый объект
            obj2: Второй объект
            
        Returns:
            bool: True, если объекты сталкиваются, иначе False
        """
        if not (hasattr(obj1, 'position') and hasattr(obj2, 'position')):
            return False
            
        # Простая проверка столкновения для сферических объектов
        distance = abs(obj1.position - obj2.position)
        # Предполагаем, что у объектов есть радиус или используем стандартное значение
        radius1 = getattr(obj1, 'radius', 1.0)
        radius2 = getattr(obj2, 'radius', 1.0)
        return distance < (radius1 + radius2)
        
    def _resolve_collision(self, obj1, obj2):
        """
        Разрешить столкновение между двумя объектами
        
        Args:
            obj1: Первый объект
            obj2: Второй объект
        """
        if not (hasattr(obj1, 'velocity') and hasattr(obj2, 'velocity')):
            return
            
        # Простое разрешение столкновения (упругий удар)
        # Используем закон сохранения импульса и энергии
        m1 = getattr(obj1, 'mass', 1.0)
        m2 = getattr(obj2, 'mass', 1.0)
        v1 = obj1.velocity
        v2 = obj2.velocity
        
        # Новые скорости после упругого столкновения
        v1_new = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
        v2_new = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)
        
        obj1.velocity = v1_new
        obj2.velocity = v2_new
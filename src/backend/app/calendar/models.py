"""
Модели для системы календаря и времени
"""

class WorldCalendar:
    """
    Класс для управления временем в мире эмуляции
    """
    
    def __init__(self, start_year=1, months=8, days_per_month=20, time_speed=1.0):
        """
        Инициализация календаря
        
        Args:
            start_year (int): Начальный год
            months (int): Количество месяцев в году
            days_per_month (int): Количество дней в каждом месяце
            time_speed (float): Скорость течения времени (1.0 = реальное время)
        """
        self.current_year = start_year
        self.current_month = 1
        self.current_day = 1
        self.months = months
        self.days_per_month = days_per_month
        self.time_speed = time_speed
        self.total_days = 0
        
        # Названия месяцев
        self.month_names = [
            "Зимля", "Ледень", "Ветреня", "Цветень", 
            "Жарень", "Зной", "Листопад", "Грязень"
        ]
        
        # Названия дней недели
        self.day_names = ["День Света", "День Ветра", "День Земли", "День Воды", "День Огня"]
        
    def advance_day(self):
        """
        Перейти к следующему дню
        
        Returns:
            dict: Информация о новом дне
        """
        self.current_day += 1
        self.total_days += 1
        
        # Проверка перехода к следующему месяцу
        if self.current_day > self.days_per_month:
            self.current_day = 1
            self.current_month += 1
            
            # Проверка перехода к следующему году
            if self.current_month > self.months:
                self.current_month = 1
                self.current_year += 1
        
        return self.get_current_date()
    
    def advance_days(self, days):
        """
        Прожить указанное количество дней
        
        Args:
            days (int): Количество дней для пропуска
            
        Returns:
            dict: История пройденных дат
        """
        date_history = []
        for _ in range(days):
            date_info = self.advance_day()
            date_history.append(date_info)
        return date_history
    
    def get_current_date(self):
        """
        Получить текущую дату
        
        Returns:
            dict: Словарь с информацией о текущей дате
        """
        day_of_week = self._get_day_of_week()
        
        return {
            "year": self.current_year,
            "month": self.current_month,
            "day": self.current_day,
            "month_name": self.month_names[self.current_month - 1],
            "day_name": day_of_week,
            "total_days": self.total_days
        }
    
    def set_time_speed(self, speed):
        """
        Установить скорость течения времени
        
        Args:
            speed (float): Новая скорость времени
        """
        self.time_speed = max(0.1, speed)  # Ограничение минимальной скорости
    
    def get_time_speed(self):
        """
        Получить текущую скорость течения времени
        
        Returns:
            float: Текущая скорость времени
        """
        return self.time_speed
    
    def _get_day_of_week(self):
        """
        Рассчитать день недели на основе общего количества дней
        
        Returns:
            str: Название дня недели
        """
        # Дни недели повторяются каждые 5 дней
        day_index = (self.total_days - 1) % len(self.day_names)
        return self.day_names[day_index]
    
    def get_days_in_month(self, month=None):
        """
        Получить количество дней в месяце
        
        Args:
            month (int, optional): Номер месяца. Если None, используется текущий месяц
            
        Returns:
            int: Количество дней в месяце
        """
        if month is None:
            month = self.current_month
        return self.days_per_month
    
    def get_months_in_year(self):
        """
        Получить количество месяцев в году
        
        Returns:
            int: Количество месяцев в году
        """
        return self.months
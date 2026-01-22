<template>
  <div class="human-container">
    <h2>Управление человечками</h2>
    
    <div class="controls">
      <button @click="createHuman" class="action-button">Создать человечка</button>
      <button @click="advanceDay" class="action-button">Прожить день</button>
      <button @click="saveWorld" class="action-button">Сохранить мир</button>
      <button @click="loadWorld" class="action-button">Загрузить мир</button>
    </div>
    
    <div class="calendar-info" v-if="calendarData">
      <h3>Текущая дата: {{ calendarData.month_name }} {{ calendarData.day }}, {{ calendarData.year }} год</h3>
      <p>День недели: {{ calendarData.day_name }}</p>
    </div>
    
    <div class="humans-list" v-if="humans.length > 0">
      <h3>Список человечков ({{ humans.length }})</h3>
      <div class="human-card" v-for="human in humans" :key="human.id">
        <div class="human-header">
          <h4>{{ human.name }} ({{ human.age }} лет)</h4>
          <span class="gender" :class="human.gender">{{ human.gender === 'male' ? '♂' : '♀' }}</span>
        </div>
        
        <div class="status-bars">
          <div class="status-bar">
            <label>Здоровье:</label>
            <div class="bar-container">
              <div class="bar" :style="{ width: human.health + '%', backgroundColor: getHealthColor(human.health) }"></div>
              <span>{{ human.health }}%</span>
            </div>
          </div>
          
          <div class="status-bar">
            <label>Энергия:</label>
            <div class="bar-container">
              <div class="bar" :style="{ width: human.energy + '%', backgroundColor: getEnergyColor(human.energy) }"></div>
              <span>{{ human.energy }}%</span>
            </div>
          </div>
          
          <div class="status-bar">
            <label>Настроение:</label>
            <div class="bar-container">
              <div class="bar" :style="{ width: human.mood + '%', backgroundColor: getMoodColor(human.mood) }"></div>
              <span>{{ human.mood }}%</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button @click="sleep(human)" class="action-btn sleep">Спать</button>
          <button @click="work(human)" class="action-btn work">Работать</button>
          <button @click="eat(human)" class="action-btn eat">Есть</button>
          <button @click="idle(human)" class="action-btn idle">Отдыхать</button>
        </div>
        
        <div class="details">
          <p>Состояние: {{ human.state }}</p>
          <p>Позиция: ({{ human.position.x }}, {{ human.position.y }})</p>
          <p>Прожито дней: {{ human.days_lived }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="no-humans">
      <p>Пока нет созданных человечков. Нажмите "Создать человечка" чтобы начать.</p>
    </div>
    
    <div class="notifications" v-if="notification">
      <div class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HumanView',
  
  data() {
    return {
      humans: [],
      calendarData: null,
      nextHumanId: 1,
      notification: null
    }
  },
  
  mounted() {
    this.loadCalendarData()
    this.loadHumans()
    // Обновляем данные каждые 5 секунд
    this.updateInterval = setInterval(() => {
      this.loadCalendarData()
      this.loadHumans()
    }, 5000)
  },
  
  beforeUnmount() {
    clearInterval(this.updateInterval)
  },
  
  methods: {
    showNotification(message, type = 'info') {
      this.notification = { message, type }
      setTimeout(() => {
        this.notification = null
      }, 3000)
    },
    
    getHealthColor(health) {
      if (health > 70) return '#4CAF50'
      if (health > 40) return '#FFC107'
      return '#F44336'
    },
    
    getEnergyColor(energy) {
      if (energy > 70) return '#2196F3'
      if (energy > 40) return '#FF9800'
      return '#F44336'
    },
    
    getMoodColor(mood) {
      if (mood > 70) return '#9C27B0'
      if (mood > 40) return '#FF5722'
      return '#607D8B'
    },
    
    async loadCalendarData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/calendar/date')
        if (response.ok) {
          this.calendarData = await response.json()
        }
      } catch (error) {
        console.error('Ошибка загрузки календаря:', error)
      }
    },
    
    async loadHumans() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/human')
        if (response.ok) {
          this.humans = await response.json()
        }
      } catch (error) {
        console.error('Ошибка загрузки человечков:', error)
      }
    },
    
    async createHuman() {
      const genders = ['male', 'female']
      const names = [
        'Алексей', 'Мария', 'Иван', 'Анна', 'Дмитрий', 'Елена', 'Сергей', 'Ольга',
        'Андрей', 'Наталья', 'Александр', 'Татьяна', 'Владимир', 'Ирина', 'Павел', 'Юлия'
      ]
      
      const newHuman = {
        name: names[Math.floor(Math.random() * names.length)],
        age: Math.floor(Math.random() * 20) + 15, // 15-34 года
        gender: genders[Math.floor(Math.random() * genders.length)],
        x: Math.random() * 100,
        y: Math.random() * 100
      }
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/human', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newHuman)
        })
        
        if (response.ok) {
          const createdHuman = await response.json()
          this.humans.push(createdHuman)
          this.showNotification(`Создан человечек: ${createdHuman.name}`)
        } else {
          this.showNotification('Ошибка создания человечка', 'error')
        }
      } catch (error) {
        console.error('Ошибка при создании человечка:', error)
        this.showNotification('Ошибка при создании человечка', 'error')
      }
    },
    
    async advanceDay() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/calendar/advance_day', {
          method: 'POST'
        })
        
        if (response.ok) {
          const date = await response.json()
          this.calendarData = date
          this.loadHumans()
          this.showNotification(`Прожит день ${date.day}.${date.month}.${date.year}`)
        }
      } catch (error) {
        console.error('Ошибка проживания дня:', error)
        this.showNotification('Ошибка проживания дня', 'error')
      }
    },
    
    async saveWorld() {
      try {
        // Сохраняем мир и всех человечков
        const worldData = {
          name: `Мир_${new Date().getTime()}`,
          description: 'Сохраненное состояние мира с человечками',
          parameters: {
            human_count: this.humans.length,
            total_population: this.humans.length
          }
        }
        
        const response = await fetch('http://127.0.0.1:8000/api/worlds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(worldData)
        })
        
        if (response.ok) {
          const result = await response.json()
          // Сохраняем ссылку на мир для человечков
          this.humans.forEach(async (human) => {
            await fetch(`http://127.0.0.1:8000/api/human/${human.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({...human, world_id: result.id})
            })
          })
          
          this.showNotification('Мир сохранен!')
        }
      } catch (error) {
        console.error('Ошибка сохранения мира:', error)
        this.showNotification('Ошибка сохранения мира', 'error')
      }
    },
    
    async loadWorld() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/worlds')
        if (response.ok) {
          const worlds = await response.json()
          
          if (worlds.length > 0) {
            // Загружаем последнее состояние
            this.loadHumans()
            this.loadCalendarData()
            this.showNotification('Мир загружен!')
          } else {
            this.showNotification('Нет сохраненных миров')
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки мира:', error)
        this.showNotification('Ошибка загрузки мира', 'error')
      }
    },
    
    async performAction(human, action, params = {}) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/human/${human.id}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({action, params})
        })
        
        if (response.ok) {
          const updatedHuman = await response.json()
          // Обновляем человечка в списке
          const index = this.humans.findIndex(h => h.id === updatedHuman.id)
          if (index !== -1) {
            this.$set(this.humans, index, updatedHuman)
          }
          this.showNotification(`${human.name} ${this.getActionText(action)}`)
        }
      } catch (error) {
        console.error(`Ошибка выполнения действия ${action}:`, error)
        this.showNotification(`Ошибка выполнения действия`, 'error')
      }
    },
    
    getActionText(action) {
      const actions = {
        'sleep': 'поспал',
        'work': 'поработал',
        'eat': 'поел',
        'idle': 'отдыхает'
      }
      return actions[action] || 'совершил действие'
    },
    
    sleep(human) {
      this.performAction(human, 'sleep', {hours: 8})
    },
    
    work(human) {
      this.performAction(human, 'work', {hours: 8})
    },
    
    eat(human) {
      this.performAction(human, 'eat', {food_quality: 1.0})
    },
    
    idle(human) {
      this.performAction(human, 'idle')
    }
  }
}
</script>

<style scoped>
.human-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #45a049;
}

.calendar-info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: left;
}

.humans-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.human-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.human-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.gender {
  font-size: 20px;
}

.gender.male {
  color: #2196F3;
}

.gender.female {
  color: #E91E63;
}

.status-bars {
  margin-bottom: 15px;
}

.status-bar {
  margin-bottom: 10px;
}

.status-bar label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.bar-container {
  display: flex;
  align-items: center;
}

.bar {
  height: 10px;
  border-radius: 5px;
  margin-right: 10px;
  transition: width 0.3s;
}

.bar-container span {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

.actions {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.action-btn.sleep {
  background-color: #3F51B5;
  color: white;
}

.action-btn.work {
  background-color: #FF9800;
  color: white;
}

.action-btn.eat {
  background-color: #4CAF50;
  color: white;
}

.action-btn.idle {
  background-color: #9E9E9E;
  color: white;
}

.details {
  font-size: 12px;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.no-humans {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
}

.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
}

.notification.info {
  background-color: #2196F3;
}

.notification.error {
  background-color: #F44336;
}
</style>
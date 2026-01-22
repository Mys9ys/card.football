<template>
  <div class="planet-container">
    <canvas ref="planetCanvas" class="planet-canvas"></canvas>
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-button">+</button>
      <button @click="zoomOut" class="zoom-button">-</button>
      <button @click="toggleUnfold" class="zoom-button unfold-button">⤢</button>
    </div>
    
    <!-- Панель управления параметрами ландшафта -->
    <div class="terrain-controls" v-if="isUnfolded">
      <h3>Параметры ландшафта</h3>
      
      <div class="control-group">
        <label>Процент воды: {{ terrainParameters.waterPercentage }}%</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="terrainParameters.waterPercentage"
          @input="updateWaterAndLand" 
        />
      </div>
      
      <div class="control-group">
        <label>Процент суши: {{ landPercentage }}%</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          :value="100 - terrainParameters.waterPercentage"
          @input="updateWaterAndLand" 
          disabled
        />
      </div>
      
      <div class="control-group">
        <label>Процент гор: {{ terrainParameters.mountainPercentage }}%</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="terrainParameters.mountainPercentage"
          @input="updateMountainPlainRatio" 
          class="mountain-slider"
        />
      </div>
      
      <div class="control-group">
        <label>Процент равнин: {{ terrainParameters.plainPercentage }}%</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          :value="100 - terrainParameters.mountainPercentage"
          @input="updateMountainPlainRatio" 
          class="plain-slider"
          disabled
        />
      </div>
      
      <button @click="generateNewMap" class="generate-button">Сгенерировать новую карту</button>
      <button @click="loadWorldState" class="generate-button" style="margin-top: 10px;">Загрузить последнее состояние</button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { markRaw } from 'vue'
import { generateTerrain } from '../utils/terrainGenerator.js' // eslint-disable-line no-unused-vars
import politicalData from '../political/politicalData.js'

export default {
  name: 'PlanetViewComponent',
  
  computed: {
    landPercentage() {
      return 100 - this.terrainParameters.waterPercentage
    }
  },
  
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      planet: null,
      controls: null,
      zoomLevel: 1,
      maxZoom: 5,
      minZoom: 0.5,
      isUnfolded: true, // По умолчанию показываем плоскую карту
      originalGeometry: null,
      earthTexture: null,
      bumpMap: null,
      specularMap: null,
      generatedTerrain: null,
      terrainParameters: {
        waterPercentage: 70,
        mountainPercentage: 50,
        plainPercentage: 50
      },
      lastGeneratedParameters: null,
      politicalLayer: null,
      cityLabels: [],
      countryBorders: [],
      currentViewLevel: 'world', // 'world', 'country', 'city'
      selectedCountry: null,
      selectedCity: null,
      raycaster: null,
      mouse: null
    }
  },
  
  mounted() {
    this.initThreeJS()
    this.animate()
  },
  
  beforeUnmount() {
    // Метод cleanup() был удален, так как не был реализован
    // Очистка ресурсов будет реализована позже при необходимости
  },
  
  methods: {
    
    async loadWorldState() {
      try {
        // Получаем список всех миров
        const response = await fetch('http://127.0.0.1:8000/api/worlds');
        
        if (response.ok) {
          const worlds = await response.json();
          
          if (worlds.length > 0) {
            // Берем последний сохраненный мир
            const latestWorld = worlds[worlds.length - 1];
            
            // Восстанавливаем параметры
            this.terrainParameters = { ...latestWorld.parameters };
            
            // Перегенерируем карту с загруженными параметрами
            this.generateNewMap();
            
            this.showNotification('Состояние мира загружено!');
            console.log('Загружено состояние мира:', latestWorld);
          } else {
            this.showNotification('Нет сохраненных миров!');
          }
        } else {
          this.showNotification('Ошибка загрузки мира!');
        }
      } catch (error) {
        console.error('Ошибка при загрузке:', error);
        this.showNotification('Ошибка при загрузке!');
      }
      
      // После загрузки основного состояния, инициализируем политическую карту
      this.$nextTick(() => {
        this.initializePoliticalMap();
      });
    },
    
    async saveWorldState() {
      // Создаем данные для сохранения
      const worldData = {
        name: `Мир_${new Date().getTime()}`,
        description: 'Сохраненное состояние мира',
        parameters: this.terrainParameters
      };
      
      try {
        // Отправляем запрос на backend
        const response = await fetch('http://127.0.0.1:8000/api/worlds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(worldData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Состояние мира сохранено:', result);
          this.showNotification('Состояние мира сохранено!');
        } else {
          console.error('Ошибка сохранения:', response.status, response.statusText);
          this.showNotification('Ошибка сохранения мира!');
        }
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
        this.showNotification('Ошибка при сохранении!');
      }
      
      // Сохраняем политические данные
      this.savePoliticalData();
    },
    
    async savePoliticalData() {
      // Сохраняем данные о странах
      for (const country of politicalData.countries) {
        try {
          await fetch('http://127.0.0.1:8000/api/political/countries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: country.name,
              color: country.color,
              population: country.population,
              area: country.area,
              government_type: country.government_type
            })
          });
        } catch (error) {
          console.error('Ошибка сохранения страны:', country.name, error);
        }
        
        // Сохраняем регионы страны
        for (const region of country.regions) {
          try {
            await fetch('http://127.0.0.1:8000/api/political/regions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: region.name,
                country_id: country.id,
                area: region.area,
                population: region.population,
                coordinates: region.coordinates
              })
            });
          } catch (error) {
            console.error('Ошибка сохранения региона:', region.name, error);
          }
        }
        
        // Сохраняем города страны
        for (const city of country.cities) {
          try {
            await fetch('http://127.0.0.1:8000/api/political/cities', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: city.name,
                population: city.population,
                x: city.x,
                y: city.y,
                city_type: city.city_type,
                region_id: city.region_id,
                country_id: country.id,
                is_capital: city.is_capital
              })
            });
          } catch (error) {
            console.error('Ошибка сохранения города:', city.name, error);
          }
        }
      }
    },
    generateNewMap() {
      // Показываем эффект перегенерации карты
      this.showRegenerationEffect()
      
      // Перегенерация карты с текущими параметрами
      this.generatedTerrain = generateTerrain(this.terrainParameters)
      
      // Сохраняем параметры генерации
      this.lastGeneratedParameters = { ...this.terrainParameters }
      
      // Обновляем текстуры планеты
      if (this.planet && this.planet.material) {
        // Обновляем цветовую текстуру
        this.planet.material.map = this.generatedTerrain.colorTexture
        this.planet.material.map.needsUpdate = true
        
        // Обновляем bump-текстуру
        this.planet.material.bumpMap = this.generatedTerrain.heightTexture
        this.planet.material.bumpMap.needsUpdate = true
        
        // Обновляем bumpScale в зависимости от наличия сгенерированной текстуры
        this.planet.material.bumpScale = this.generatedTerrain ? 0.2 : 0.05
        
        // Принудительно обновляем материал
        this.planet.material.needsUpdate = true
      }
      
      // Принудительно перерисовываем сцену
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
      
      // Обновляем геометрию планеты
      this.updatePlanetGeometry()
      
      // Логируем параметры ландшафта при генерации
      console.log('Генерация карты с параметрами:', this.terrainParameters)
      
      // Показываем уведомление о успешной генерации
      this.showNotification('Карта успешно сгенерирована!')
      
      // Сохраняем текущее состояние мира на backend
      this.saveWorldState()
      
      // Инициализируем политическую карту после генерации
      this.$nextTick(() => {
        this.initializePoliticalMap();
      });
    },
    
    updateWaterAndLand() {
      // Обновление соотношения воды и суши
      console.log('Обновление соотношения воды и суши:', this.terrainParameters.waterPercentage)
      
      // Пересчитываем процент равнин при изменении суши
      // чтобы сохранить их сумму равной 100% от суши
      this.terrainParameters.plainPercentage = 100 - this.terrainParameters.mountainPercentage;
      
      // Обновляем ландшафт
      this.updatePlanetGeometry();
      
      // Логируем параметры ландшафта при генерации
      console.log('Генерация карты с параметрами:', this.terrainParameters);
    },
    
    updateMountainPlainRatio(event) {
      // Обновление соотношения гор и равнин
      console.log('Обновление соотношения гор и равнин:', this.terrainParameters)
      
      // Определяем, какой ползунок был изменен
      const target = event?.target;
      
      // Максимально возможная сумма гор и равнин - это 100% (все что не вода)
      const maxTotal = 100;
      
      // При изменении ползунка гор, равнины автоматически корректируются
      if (target && target.classList.contains('mountain-slider')) {
        // При изменении гор, равнины = 100% - процент гор
        this.terrainParameters.plainPercentage = maxTotal - this.terrainParameters.mountainPercentage;
      }
      
      // При изменении ползунка равнин (если он не отключен), горы корректируются
      else if (target && target.classList.contains('plain-slider')) {
        // При изменении равнин, горы = 100% - процент равнин
        this.terrainParameters.mountainPercentage = maxTotal - this.terrainParameters.plainPercentage;
      }
      
      // Обновляем ландшафт
      this.updatePlanetGeometry();
      
      // Логируем параметры ландшафта при генерации
      console.log('Генерация карты с параметрами:', this.terrainParameters);
    },
    

    
    showRegenerationEffect() {
      // Показываем эффект перегенерации карты
      const effect = document.createElement('div')
      effect.innerHTML = '🔄'
      effect.style.position = 'absolute'
      effect.style.top = '50%'
      effect.style.left = '50%'
      effect.style.transform = 'translate(-50%, -50%)'
      effect.style.fontSize = '50px'
      effect.style.zIndex = '100'
      effect.style.pointerEvents = 'none'
      effect.style.opacity = '0'
      
      document.body.appendChild(effect)
      
      // Анимация появления и исчезновения
      setTimeout(() => {
        effect.style.transition = 'opacity 0.5s'
        effect.style.opacity = '1'
      }, 100)
      
      setTimeout(() => {
        effect.style.opacity = '0'
        setTimeout(() => {
          document.body.removeChild(effect)
        }, 500)
      }, 2000)
    },
    
    updateCamera() {
      // Меняем положение камеры в зависимости от состояния
      this.camera.position.z = this.isUnfolded ? 5 : 5 / this.zoomLevel
      this.camera.lookAt(this.scene.position)
      this.camera.updateProjectionMatrix()
      
      // Обновляем уровень визуализации в зависимости от зума
      this.updateViewLevel();
    },
    
    zoomIn() {
      if (this.zoomLevel < this.maxZoom) {
        this.zoomLevel += 0.1
        
        // Обновляем камеру при зуме
        this.updateCamera()
        
        // Проверяем нужен ли переход к более детальному уровню
        this.checkZoomLevel();
      }
    },
    
    zoomOut() {
      if (this.zoomLevel > this.minZoom) {
        this.zoomLevel -= 0.1
        
        this.updateCamera()
        
        // Проверяем нужен ли переход к менее детальному уровню
        this.checkZoomLevel();
      }
    },
    
    toggleUnfold() {
      this.isUnfolded = !this.isUnfolded
      this.updatePlanetGeometry()
      this.updateCamera()
    },
    
    updateViewLevel() {
      // Обновляем уровень визуализации в зависимости от зума
      if (this.zoomLevel > 3) {
        if (this.currentViewLevel !== 'city') {
          this.currentViewLevel = 'city';
          this.showCityLabels();
        }
      } else if (this.zoomLevel > 1.5) {
        if (this.currentViewLevel !== 'country') {
          this.currentViewLevel = 'country';
          this.showCountryBorders();
        }
      } else {
        if (this.currentViewLevel !== 'world') {
          this.currentViewLevel = 'world';
          this.hideAllLabels();
        }
      }
    },
    
    checkZoomLevel() {
      // Проверяем, нужно ли изменить уровень детализации
      const prevViewLevel = this.currentViewLevel;
      this.updateViewLevel();
      
      // Если уровень изменился, показываем соответствующие элементы
      if (prevViewLevel !== this.currentViewLevel) {
        switch (this.currentViewLevel) {
          case 'world':
            this.hideAllLabels();
            break;
          case 'country':
            this.showCountryBorders();
            break;
          case 'city':
            this.showCityLabels();
            break;
        }
      }
    },
    

    
    updatePlanetGeometry() {
      // Сохраняем оригинальную геометрию при первом вызове
      if (!this.originalGeometry && this.planet && this.planet.geometry) {
        this.originalGeometry = this.planet.geometry.clone()
      }
      
      // Логируем параметры ландшафта при генерации
      console.log('Генерация карты с параметрами:', this.terrainParameters)
      
      // При разворачивании создаем новую геометрию для преобразования сферы в плоскую карту
      if (this.isUnfolded) {
        // Логируем параметры ландшафта при генерации
        console.log('Генерация карты с параметрами:', this.terrainParameters)
        // Удаляем старую планету, если она уже была преобразована
        if (this.planet) {
          this.scene.remove(this.planet)
        }
        
        // Создаем новую геометрию для плоской карты
        const radius = 2
        const widthSegments = 64
        const heightSegments = 32
        
        // Создаем плоскую карту (прямоугольник) с правильными пропорциями
        const planeGeometry = new THREE.PlaneGeometry(radius * 2.5, radius * 1.25, widthSegments, heightSegments)
        
        // Создаем материал для плоской карты
        const material = new THREE.MeshPhongMaterial({
          // Используем сгенерированную цветовую текстуру, если она есть
          map: this.generatedTerrain ? this.generatedTerrain.colorTexture : this.earthTexture,
          // Используем сгенерированную текстуру высот для bump-эффекта
          bumpMap: this.generatedTerrain ? this.generatedTerrain.heightTexture : this.bumpMap,
          bumpScale: this.generatedTerrain ? 0.2 : 0.05,
          specularMap: this.specularMap,
          specular: new THREE.Color('grey'),
          side: THREE.DoubleSide
        })
        
        // Создаем меш для плоской карты
        this.planet = markRaw(new THREE.Mesh(planeGeometry, material))
        this.planet.userData.isUnfolded = true
        
        // Позиционируем и поворачиваем карту
        this.planet.rotation.x = 0 // Устанавливаем вращение по X в 0
        this.planet.rotation.y = 0 // Устанавливаем вращение по Y в 0
        this.planet.rotation.z = 0 // Устанавливаем вращение по Z в 0
        this.planet.position.y = 0 // Позиционируем на уровне сцены
        this.planet.position.z = 0 // Центрируем карту по оси Z
        
        // Добавляем планету на сцену
        this.scene.add(this.planet)
        
        // Обновляем рендерер, чтобы сразу отобразить изменения
        this.renderer.render(this.scene, this.camera)
        
        // Инициализируем политическую карту, если она еще не инициализирована
        this.$nextTick(() => {
          this.initializePoliticalMap();
        });
      } else if (this.originalGeometry && this.planet && this.planet.userData.isUnfolded) {
        // Возвращаемся к сферической геометрии
        this.scene.remove(this.planet)
        this.planet = markRaw(new THREE.Mesh(this.originalGeometry, this.planet.material))
        this.planet.userData.isUnfolded = false
        this.scene.add(this.planet)
      }
    },
    

    

    

    

    

    

    

    
    initThreeJS() {
      // Создаем сцену
      this.scene = markRaw(new THREE.Scene())

      // Создаем камеру
      this.camera = markRaw(new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ))

      // Параметры ландшафта уже инициализированы в data()
      this.camera.position.z = this.isUnfolded ? 5 : 5 / this.zoomLevel
      this.camera.lookAt(this.scene.position)
      this.camera.updateProjectionMatrix()

      // Создаем рендерер
      this.renderer = markRaw(new THREE.WebGLRenderer({
        canvas: this.$refs.planetCanvas,
        antialias: true
      }))
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)

      // Добавляем освещение
      const ambientLight = new THREE.AmbientLight(0x404040)
      this.scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 3, 5)
      this.scene.add(directionalLight)

      // Создаем текстуру Земли
      const textureLoader = new THREE.TextureLoader()
      const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
      const bumpMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg')
      const specularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg')
      
      // Сохраняем текстуры в data для использования в updatePlanetGeometry
      this.earthTexture = earthTexture
      this.bumpMap = bumpMap
      this.specularMap = specularMap

      // Создаем сферу для планеты
      const geometry = new THREE.SphereGeometry(2, 64, 64)
      
      // Создаем материал для сферы
      const material = new THREE.MeshPhongMaterial({
        // Используем сгенерированную цветовую текстуру, если она есть
        map: this.generatedTerrain ? this.generatedTerrain.colorTexture : earthTexture,
        // Используем сгенерированную текстуру высот для bump-эффекта
        bumpMap: this.generatedTerrain ? this.generatedTerrain.heightTexture : bumpMap,
        bumpScale: this.generatedTerrain ? 0.2 : 0.05,
        specularMap: specularMap,
        specular: new THREE.Color('grey')
      })
      
      // Создаем меш для планеты
      this.planet = markRaw(new THREE.Mesh(geometry, material))
      this.planet.userData.isUnfolded = false
      this.originalGeometry = geometry
      
      // Добавляем планету на сцену
      this.scene.add(this.planet)

      // Добавляем облака
      const cloudTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_2048.jpg')
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.8
      })
      const cloudGeometry = new THREE.SphereGeometry(2.03, 64, 64)
      const clouds = markRaw(new THREE.Mesh(cloudGeometry, cloudMaterial))
      this.scene.add(clouds)

      // Добавляем звездное небо
      const starGeometry = new THREE.SphereGeometry(90, 64, 64)
      const starTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/spark1.png')
      const starMaterial = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide
      })
      const starField = markRaw(new THREE.Mesh(starGeometry, starMaterial))
      this.scene.add(starField)

      // Обработка изменения размера окна
      window.addEventListener('resize', this.onWindowResize)
      
      // Инициализируем политическую карту после инициализации Three.js
      this.$nextTick(() => {
        this.initializePoliticalMap();
      });
    },
    animate() {
      // Сохраняем ссылку на this
      const self = this;
      
      function animationLoop() {
        requestAnimationFrame(animationLoop);

        // Вращение планеты (замедляем при увеличении)
        if (self.planet && !self.planet.userData.isUnfolded) {
          self.planet.rotation.y += 0.002 / self.zoomLevel;
        }

        // Обновляем уровень визуализации при каждом кадре
        self.updateViewLevel();
        
        // Обновляем позиции меток городов
        if (self.currentViewLevel === 'city') {
          self.updateCityLabelsPosition();
        }
        
        // Рендерим сцену
        // Временно отключено для фокусировки на разработке человечков
        // if (self.renderer && self.scene && self.camera) {
        //   self.renderer.render(self.scene, self.camera);
        // }
      }
      
      // Запускаем анимационный цикл
      animationLoop();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },

    
    initializePoliticalMap() {
      // Очищаем предыдущие элементы политической карты
      this.clearPoliticalMap();
      
      // Проверяем, что мы в развернутом режиме
      if (!this.isUnfolded || !this.scene) return;
      
      // Создаем слой для политических границ
      this.politicalLayer = new THREE.Group();
      this.scene.add(this.politicalLayer);
      
      // Добавляем границы стран
      this.addCountryBorders();
      
      // Добавляем метки городов
      this.addCityLabels();
      
      // Устанавливаем начальный уровень визуализации
      this.updateViewLevel();
      
      console.log('Политическая карта инициализирована');
    },
    
    clearPoliticalMap() {
      // Удаляем все элементы политической карты
      if (this.politicalLayer) {
        this.scene.remove(this.politicalLayer);
        this.politicalLayer = null;
      }
      
      // Удаляем метки городов
      this.cityLabels.forEach(label => {
        if (label.parent) {
          label.parent.remove(label);
        }
        label.element.remove();
      });
      this.cityLabels = [];
      
      // Удаляем границы стран
      this.countryBorders.forEach(border => {
        if (border.parent) {
          border.parent.remove(border);
        }
      });
      this.countryBorders = [];
      
      // Сбрасываем состояние
      this.currentViewLevel = 'world';
      this.selectedCountry = null;
      this.selectedCity = null;
    },
    
    addCountryBorders() {
      // Создаем границы для каждой страны
      politicalData.countries.forEach(country => {
        country.regions.forEach(region => {
          // Создаем линию для границы региона
          const points = region.coordinates.map(coord => 
            new THREE.Vector3(
              (coord[0] - 1280) / 256 * 2.5, // Нормализация X координаты
              0, 
              (640 - coord[1]) / 128 * 1.25  // Нормализация Y координаты
            )
          );
          
          // Замыкаем контур
          points.push(points[0].clone());
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color: country.color,
            linewidth: 2 
          });
          
          const line = new THREE.Line(geometry, material);
          line.userData = { type: 'country-border', country: country, region: region };
          this.politicalLayer.add(line);
          this.countryBorders.push(line);
        });
      });
    },
    
    addCityLabels() {
      // Создаем DOM-элементы для меток городов
      politicalData.countries.forEach(country => {
        country.cities.forEach(city => {
          // Создаем DOM-элемент для метки
          const label = document.createElement('div');
          label.className = 'city-label';
          label.style.position = 'absolute';
          label.style.color = 'white';
          label.style.fontSize = '12px';
          label.style.pointerEvents = 'none';
          label.style.textShadow = '0 0 2px black';
          
          // Определяем цвет и размер в зависимости от типа города
          let color = 'white';
          let fontSize = '12px';
          let zIndex = 100;
          
          if (city.is_capital === 1) {
            color = '#FFD700'; // Золотой для столицы страны
            fontSize = '14px';
            zIndex = 102;
          } else if (city.is_capital === 2) {
            color = '#FFA500'; // Оранжевый для столицы региона
            fontSize = '13px';
            zIndex = 101;
          }
          
          label.style.color = color;
          label.style.fontSize = fontSize;
          label.style.zIndex = zIndex.toString();
          
          // Добавляем иконку для столиц
          if (city.is_capital > 0) {
            label.innerHTML = `★ ${city.name}`;
          } else {
            label.innerHTML = city.name;
          }
          
          // Добавляем элемент в документ
          document.body.appendChild(label);
          
          // Создаем объект для хранения данных о метке
          const labelObject = {
            element: label,
            city: city,
            country: country
          };
          
          this.cityLabels.push(labelObject);
        });
      });
    },
    
    showCountryBorders() {
      // Показываем границы стран
      this.countryBorders.forEach(border => {
        border.visible = true;
      });
      
      // Обновляем рендер
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    
    hideCountryBorders() {
      // Скрываем границы стран
      this.countryBorders.forEach(border => {
        border.visible = false;
      });
    },
    
    showCityLabels() {
      // Показываем метки городов
      this.cityLabels.forEach(label => {
        label.element.style.display = 'block';
      });
    },
    
    hideCityLabels() {
      // Скрываем метки городов
      this.cityLabels.forEach(label => {
        label.element.style.display = 'none';
      });
    },
    
    hideAllLabels() {
      this.hideCountryBorders();
      this.hideCityLabels();
    },
    
    updateCityLabelsPosition() {
      // Обновляем позиции меток городов
      this.cityLabels.forEach(label => {
        // Преобразуем 3D координаты в 2D экранные координаты
        const vector = new THREE.Vector3(
          (label.city.x - 1280) / 256 * 2.5,
          0,
          (640 - label.city.y) / 128 * 1.25
        );
        
        vector.project(this.camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
        
        // Позиционируем DOM-элемент
        label.element.style.left = `${x}px`;
        label.element.style.top = `${y}px`;
      });
    },
  }
}
</script>

<style scoped>
.city-label {
  position: absolute;
  color: white;
  font-size: 12px;
  pointer-events: none;
  text-shadow: 0 0 2px black;
  white-space: nowrap;
}

.zoom-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10;
}

.zoom-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.zoom-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}
.planet-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.terrain-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  z-index: 10;
  width: 250px;
  font-family: Arial, sans-serif;
}

.terrain-controls h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #4CAF50;
  text-align: center;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #333;
  outline: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.control-group input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  border: none;
}

.generate-button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.generate-button:hover {
  background-color: #45a049;
}

.planet-canvas {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.planet-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.zoom-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10;
}

.zoom-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.zoom-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}
</style>
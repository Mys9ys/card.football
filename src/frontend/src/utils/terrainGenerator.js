// terrainGenerator.js
// Алгоритм процедурной генерации ландшафта на основе шума Перлина

import * as THREE from 'three';

// Функция для генерации рек на основе градиента высот
// eslint-disable-next-line no-unused-vars
function generateRivers(heightData, width, height, waterPercentage) {
  const riverData = new Uint8Array(width * height);
  const minElevation = waterPercentage / 100; // Минимальная высота для начала реки
  
  // Создаем несколько рек
  const numRivers = 3 + Math.floor(Math.random() * 3); // 3-5 рек
  
  for (let r = 0; r < numRivers; r++) {
    // Начальная точка реки (на склоне горы)
    let x, y;
    do {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
    } while (
      y <= 2 || y >= height - 3 || // Не слишком близко к краям
      heightData[y * width + x] / 255 < minElevation + 0.2 || // Должна быть выше уровня воды
      heightData[y * width + x] / 255 > 0.9 // Не на самой вершине
    );
    
    // Текущая позиция реки
    let currentX = x;
    let currentY = y;
    
    // Добавляем начальную точку реки
    riverData[currentY * width + currentX] = 1;
    
    // Максимальная длина реки
    const maxLength = width * 0.7;
    let length = 0;
    
    // Направления движения: [dx, dy]
    const directions = [
      [0, -1], // вверх
      [1, -1], // вверх-вправо
      [1, 0],  // вправо
      [1, 1],  // вниз-вправо
      [0, 1],  // вниз
      [-1, 1], // вниз-влево
      [-1, 0], // влево
      [-1, -1] // вверх-влево
    ];
    
    while (length < maxLength) {
      // Находим направление с наибольшим уклоном (наименьшая высота)
      let bestDirection = null;
      let minHeight = heightData[currentY * width + currentX];
      
      // Проверяем все возможные направления
      for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        const newX = currentX + dir[0];
        const newY = currentY + dir[1];
        
        // Проверяем границы
        if (newX < 1 || newX >= width - 1 || newY < 1 || newY >= height - 1) continue;
        
        const heightAtDir = heightData[newY * width + newX];
        
        // Предпочитаем направления вниз, но разрешаем небольшие подъемы
        if (heightAtDir < minHeight || (heightAtDir - minHeight) / 255 < 0.05) {
          minHeight = heightAtDir;
          bestDirection = dir;
        }
      }
      
      // Если не найдено подходящего направления, прерываем
      if (!bestDirection) break;
      
      // Двигаемся в выбранном направлении
      currentX += bestDirection[0];
      currentY += bestDirection[1];
      
      // Устанавливаем точку реки
      riverData[currentY * width + currentX] = 1;
      
      length++;
      
      // Если достигли уровня воды, завершаем реку
      if (heightData[currentY * width + currentX] / 255 < minElevation + 0.05) {
        break;
      }
    }
  }
  
  return riverData;
}

// Функция для генерации озер
// eslint-disable-next-line no-unused-vars
function generateLakes(heightData, width, height, waterPercentage) {
  const lakeData = new Uint8Array(width * height);
  const waterThreshold = waterPercentage / 100;
  
  // Ищем низменности, окруженные более высокими участками
  for (let y = 5; y < height - 5; y++) {
    for (let x = 5; x < width - 5; x++) {
      const idx = y * width + x;
      const heightValue = heightData[idx] / 255;
      
      // Озеро может быть только выше уровня океана, но не слишком высоко
      if (heightValue <= waterThreshold || heightValue >= waterThreshold + 0.2) continue;
      
      // Проверяем, является ли точка локальным минимумом
      let neighbors = 0;
      let lowerNeighbors = 0;
      
      // Проверяем окружение 3x3
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            neighbors++;
            if (heightData[ny * width + nx] <= heightData[idx]) {
              lowerNeighbors++;
            }
          }
        }
      }
      
      // Если большинство соседей выше, это потенциальное озеро
      if (lowerNeighbors < neighbors * 0.3) {
        // Дополнительная проверка: случайность и уникальность
        if (Math.random() < 0.02) { // 2% шанс создания озера
          // Заливаем область вокруг точки
          fillLakeArea(lakeData, heightData, x, y, width, height, heightValue, waterThreshold);
        }
      }
    }
  }
  
  return lakeData;
}

// Вспомогательная функция для заполнения области озера
function fillLakeArea(lakeData, heightData, startX, startY, width, height, maxHeight, waterThreshold) {
  const queue = [[startX, startY]];
  const visited = new Set();
  
  while (queue.length > 0) {
    const [x, y] = queue.shift();
    const key = `${x},${y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    const idx = y * width + x;
    const heightValue = heightData[idx] / 255;
    
    // Проверяем, подходит ли точка для озера
    if (heightValue <= maxHeight && heightValue >= waterThreshold) {
      lakeData[idx] = 1;
      
      // Добавляем соседей в очередь
      const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          queue.push([nx, ny]);
        }
      }
    }
  }
}

// Создаем функцию для генерации шума Перлина
function perlinNoise(x, y) {
  // Простая реализация шума Перлина для демонстрации
  // В реальном проекте можно использовать библиотеку, например, simplex-noise
  
  // Используем Math.sin и Math.cos для создания периодического шума
  let result = 0;
  let amplitude = 1;
  let frequency = 1;
  
  // 6 октав шума для более детального ландшафта
  for (let i = 0; i < 6; i++) {
    result += Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  // Нормализуем результат в диапазон [-1, 1]
  return result / 2.0;
}

/**
 * Генерирует высотную карту для планеты
 * @param {number} width - ширина карты
 * @param {number} height - высота карты
 * @param {object} parameters - параметры генерации
 * @param {number} parameters.waterPercentage - процент воды
 * @param {number} parameters.mountainPercentage - процент гор
 * @param {number} parameters.plainPercentage - процент равнин
 * @returns {Object} - объект с данными высот, рек и озер
 */
export function generateHeightMap(width, height, parameters) {
  const { waterPercentage, mountainPercentage } = parameters;
  const data = new Uint8Array(width * height);
  
  // Определяем пороги для разных типов ландшафта
  const waterThreshold = waterPercentage / 100;
  const mountainThreshold = 1 - mountainPercentage / 100;
  
  // Генерируем шум для каждой точки карты с уменьшенным разрешением
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      // Нормализуем координаты
      const nx = (x / width) * 10;
      const ny = (y / height) * 10;
      
      // Генерируем 2D шум Перлина
      // Используем несколько октав для более естественного ландшафта
      let noise = 0;
      let amplitude = 1;
      
      // 4 октавы шума
      for (let i = 0; i < 4; i++) {
        noise += perlinNoise(nx, ny) * amplitude;
        amplitude *= 0.5;
      }
      
      // Нормализуем шум в диапазон [0, 1]
      noise = (noise + 1) / 2;
      
      // Применяем пороги для создания дискретных уровней ландшафта
      if (noise < waterThreshold) {
        // Вода
        data[y * width + x] = 0;
      } else if (noise > mountainThreshold) {
        // Горы
        data[y * width + x] = 255;
      } else {
        // Равнины
        // Интерполируем высоту между водой и горами
        const waterLevel = waterThreshold;
        const mountainLevel = mountainThreshold;
        const plainNoise = (noise - waterLevel) / (mountainLevel - waterLevel);
        data[y * width + x] = Math.floor(plainNoise * 255);
      }
      
      // Заполняем соседние пиксели для уменьшения разрешения
      if (x > 0) {
        data[y * width + (x-1)] = data[y * width + x];
      }
      if (y > 0) {
        data[(y-1) * width + x] = data[y * width + x];
      }
      if (x > 0 && y > 0) {
        data[(y-1) * width + (x-1)] = data[y * width + x];
      }
    }
  }
  
  // Пропускаем генерацию рек и озер на начальных этапах
  const rivers = new Uint8Array(width * height);
  const lakes = new Uint8Array(width * height);
  
  return {
    heightData: data,
    rivers: rivers,
    lakes: lakes
  };
}

/**
 * Создает текстуру высот из массива данных
 * @param {Uint8Array} heightData - данные высот
 * @param {number} width - ширина текстуры
 * @param {number} height - высота текстуры
 * @returns {THREE.DataTexture} - текстура высот
 */
export function createHeightTexture(heightData, width, height) {
  // Создаем DataTexture из данных высот
  const texture = new THREE.DataTexture(
    heightData,
    width,
    height,
    THREE.LuminanceFormat,
    THREE.UnsignedByteType
  );
  
  // Настройки текстуры
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  
  return texture;
}

/**
 * Генерует цветовую текстуру на основе высот, рек, озер и параметров ландшафта
 * @param {Object} terrainData - объект с данными ландшафта
 * @param {Uint8Array} terrainData.heightData - данные высот
 * @param {Uint8Array} terrainData.rivers - данные рек
 * @param {Uint8Array} terrainData.lakes - данные озер
 * @param {number} width - ширина текстуры
 * @param {number} height - высота текстуры
 * @param {object} parameters - параметры ландшафта
 * @returns {THREE.DataTexture} - цветовая текстура
 */
export function generateColorTexture(terrainData, width, height, parameters) {
  const { waterPercentage, mountainPercentage } = parameters;
  const waterThreshold = waterPercentage / 100;
  const mountainThreshold = 1 - mountainPercentage / 100;
  const heightData = terrainData.heightData;
  const rivers = terrainData.rivers;
  const lakes = terrainData.lakes;
  
  // Создаем массив цветов (RGBA)
  const colorData = new Uint8Array(width * height * 4);
  
  // Генерируем случайное значение для вариативности цветов
  const colorVariation = Math.random() * 0.2 - 0.1; // -0.1 до +0.1
  

  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const heightValue = heightData[idx] / 255; // Нормализуем значение высоты
      const colorIdx = idx * 4;
      
      // Определяем цвет на основе высоты
      if (lakes[idx] === 1) {
        // Озеро - более темный синий оттенок
        colorData[colorIdx] = 10 + Math.random() * 10;     // R
        colorData[colorIdx + 1] = 50 + Math.random() * 15;  // G
        colorData[colorIdx + 2] = 130 + Math.random() * 20; // B
        colorData[colorIdx + 3] = 255; // A
      } else if (rivers[idx] === 1) {
        // Река - сине-зеленый оттенок
        colorData[colorIdx] = 15 + Math.random() * 10;     // R
        colorData[colorIdx + 1] = 60 + Math.random() * 15;  // G
        colorData[colorIdx + 2] = 120 + Math.random() * 20; // B
        colorData[colorIdx + 3] = 255; // A
      } else if (heightValue < waterThreshold) {
        // Вода - синий оттенок с вариациями
        const baseBlue = 150 + colorVariation * 50;
        colorData[colorIdx] = 20 + Math.random() * 20;     // R с небольшой вариацией
        colorData[colorIdx + 1] = 80 + Math.random() * 20;  // G с небольшой вариацией
        colorData[colorIdx + 2] = Math.max(0, Math.min(255, baseBlue)); // B с вариацией
        colorData[colorIdx + 3] = 255; // A
      } else if (heightValue > mountainThreshold) {
        // Горы - серый оттенок с вариациями
        const grayValue = 100 + Math.random() * 50;
        const snowLevel = mountainThreshold + (1 - mountainThreshold) * 0.7;
        if (heightValue > snowLevel) {
          // Снег на вершинах
          colorData[colorIdx] = 250 + Math.random() * 5;    // R
          colorData[colorIdx + 1] = 250 + Math.random() * 5;  // G
          colorData[colorIdx + 2] = 250 + Math.random() * 5;  // B
          colorData[colorIdx + 3] = 255;  // A
        } else {
          // Каменистые горы с вариациями
          colorData[colorIdx] = Math.max(0, Math.min(255, grayValue - 20 + Math.random() * 40));   // R
          colorData[colorIdx + 1] = Math.max(0, Math.min(255, grayValue - 20 + Math.random() * 40)); // G
          colorData[colorIdx + 2] = Math.max(0, Math.min(255, grayValue - 30 + Math.random() * 30)); // B
          colorData[colorIdx + 3] = 255; // A
        }
      } else {
        // Равнины - зеленые оттенки с вариациями
        const plainNoise = (heightValue - waterThreshold) / (mountainThreshold - waterThreshold);
        if (plainNoise < 0.3) {
          // Низменности, ближе к воде - темная зелень
          colorData[colorIdx] = 30 + Math.random() * 20;      // R
          colorData[colorIdx + 1] = 120 + Math.random() * 30;  // G
          colorData[colorIdx + 2] = 30 + Math.random() * 20;   // B
          colorData[colorIdx + 3] = 255;  // A
        } else if (plainNoise < 0.7) {
          // Средние равнины - зеленый
          colorData[colorIdx] = 50 + Math.random() * 20;      // R
          colorData[colorIdx + 1] = 180 + Math.random() * 20;  // G
          colorData[colorIdx + 2] = 50 + Math.random() * 20;   // B
          colorData[colorIdx + 3] = 255;  // A
        } else {
          // Высокие равнины, ближе к горам - светлая зелень/желтый
          colorData[colorIdx] = 120 + Math.random() * 30;     // R
          colorData[colorIdx + 1] = 180 + Math.random() * 20;  // G
          colorData[colorIdx + 2] = 80 + Math.random() * 20;   // B
          colorData[colorIdx + 3] = 255;  // A
        }
      }
    }
  }
  
  // Создаем текстуру из данных цвета
  const texture = new THREE.DataTexture(
    colorData,
    width,
    height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );
  
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  
  return texture;
}

/**
 * Основная функция генерации ландшафта
 * @param {object} parameters - параметры генерации ландшафта
 * @returns {object} - объект с текстурами и данными ландшафта
 */
export function generateTerrain(parameters) {
  const width = 512;
  const height = 256;
  
  // Генерируем карту высот
  const terrainData = generateHeightMap(width, height, parameters);
  
  // Создаем текстуру высот
  const heightTexture = createHeightTexture(terrainData.heightData, width, height);
  
  // Генерируем цветовую текстуру
  const colorTexture = generateColorTexture(terrainData, width, height, parameters);
  
  // Логируем создание ландшафта
  console.log('Создан ландшафт с параметрами:', parameters);
  
  return {
    heightData: terrainData.heightData,
    rivers: terrainData.rivers,
    lakes: terrainData.lakes,
    heightTexture,
    colorTexture,
    width,
    height
  };
}
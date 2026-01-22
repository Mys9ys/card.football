// Физические константы и утилиты для клиентской части

// Ускорение свободного падения (в условных единицах)
export const GRAVITY = 9.81;

// Коэффициент трения
export const FRICTION_COEFFICIENT = 0.1;

// Коэффициент упругости (для столкновений)
export const RESTITUTION_COEFFICIENT = 0.8;

/**
 * Применить гравитацию к объекту
 * @param {Object} obj - объект с параметрами velocity и mass
 * @param {number} dt - временной шаг
 */
export function applyGravity(obj, dt) {
  if (obj.mass && obj.velocity !== undefined) {
    // Ускорение = сила / масса, где сила = масса * гравитация
    const acceleration = GRAVITY;
    obj.velocity += acceleration * dt;
  }
}

/**
 * Обновить позицию объекта на основе его скорости
 * @param {Object} obj - объект с параметрами position и velocity
 * @param {number} dt - временной шаг
 */
export function updatePosition(obj, dt) {
  if (obj.position !== undefined && obj.velocity !== undefined) {
    obj.position += obj.velocity * dt;
  }
}

/**
 * Применить трение к объекту
 * @param {Object} obj - объект с параметром velocity
 * @param {number} dt - временной шаг
 */
export function applyFriction(obj, dt) {
  if (obj.velocity !== undefined) {
    const frictionForce = FRICTION_COEFFICIENT * Math.abs(obj.velocity);
    const frictionAcceleration = frictionForce;
    
    // Уменьшаем скорость в зависимости от направления
    if (obj.velocity > 0) {
      obj.velocity = Math.max(0, obj.velocity - frictionAcceleration * dt);
    } else if (obj.velocity < 0) {
      obj.velocity = Math.min(0, obj.velocity + frictionAcceleration * dt);
    }
  }
}

/**
 * Проверить столкновение между двумя объектами
 * @param {Object} obj1 - первый объект с параметром position и radius
 * @param {Object} obj2 - второй объект с параметром position и radius
 * @returns {boolean} - true, если объекты сталкиваются
 */
export function checkCollision(obj1, obj2) {
  const distance = Math.abs(obj1.position - obj2.position);
  const radius1 = obj1.radius || 1.0;
  const radius2 = obj2.radius || 1.0;
  return distance < (radius1 + radius2);
}

/**
 * Разрешить столкновение между двумя объектами
 * @param {Object} obj1 - первый объект с параметрами velocity и mass
 * @param {Object} obj2 - второй объект с параметрами velocity и mass
 */
export function resolveCollision(obj1, obj2) {
  if (obj1.velocity === undefined || obj2.velocity === undefined) {
    return;
  }
  
  const m1 = obj1.mass || 1.0;
  const m2 = obj2.mass || 1.0;
  const v1 = obj1.velocity;
  const v2 = obj2.velocity;
  
  // Вычисляем новые скорости после упругого столкновения
  const v1_new = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2_new = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  
  // Применяем коэффициент упругости
  obj1.velocity = v1_new * RESTITUTION_COEFFICIENT;
  obj2.velocity = v2_new * RESTITUTION_COEFFICIENT;
}
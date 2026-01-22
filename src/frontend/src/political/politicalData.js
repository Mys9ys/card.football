// Данные для политической карты

// Генерация случайных цветов для стран
// Генерация случайных границ регионов
function generateRegionBoundaries(width, height, pointCount = 8) {
  // Генерация случайных границ региона с учетом пропорций карты

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.3;
  
  const points = [];
  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * 2 * Math.PI;
    const radius = maxRadius * (0.7 + Math.random() * 0.3); // Случайный радиус для неровности
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push([x, y]);
  }
  
  return points;
}

// Статические данные для политической карты с тремя странами, их регионами и городами
const politicalData = {
  countries: [
    {
      id: "country-1",
      name: "Новая Земля",
      color: "#FF6B6B",
      population: 5000000,
      area: 800000,
      government_type: "Республика",
      capital_id: "city-1",
      regions: [
        {
          id: "region-1",
          name: "Центральный регион",
          area: 200000,
          population: 2000000,
          coordinates: generateRegionBoundaries(2560, 1280, 12)
        },
        {
          id: "region-2",
          name: "Северный регион",
          area: 300000,
          population: 1500000,
          coordinates: generateRegionBoundaries(2560, 1280, 10)
        },
        {
          id: "region-3",
          name: "Южный регион",
          area: 300000,
          population: 1500000,
          coordinates: generateRegionBoundaries(2560, 1280, 11)
        }
      ],
      cities: [
        {
          id: "city-1",
          name: "Новый Город",
          population: 1500000,
          x: 1280,
          y: 640,
          city_type: "city",
          region_id: "region-1",
          is_capital: 1
        },
        {
          id: "city-2",
          name: "Северград",
          population: 800000,
          x: 1100,
          y: 400,
          city_type: "city",
          region_id: "region-2",
          is_capital: 2
        },
        {
          id: "city-3",
          name: "Южный Порт",
          population: 700000,
          x: 1400,
          y: 800,
          city_type: "city",
          region_id: "region-3",
          is_capital: 2
        },
        {
          id: "city-4",
          name: "Малый город",
          population: 50000,
          x: 1000,
          y: 500,
          city_type: "town",
          region_id: "region-1",
          is_capital: 0
        },
        {
          id: "city-5",
          name: "Речной поселок",
          population: 20000,
          x: 1300,
          y: 700,
          city_type: "village",
          region_id: "region-3",
          is_capital: 0
        }
      ]
    },
    {
      id: "country-2",
      name: "Западная Федерация",
      color: "#4ECDC4",
      population: 3500000,
      area: 600000,
      government_type: "Монархия",
      capital_id: "city-6",
      regions: [
        {
          id: "region-4",
          name: "Западный округ",
          area: 250000,
          population: 1800000,
          coordinates: generateRegionBoundaries(2560, 1280, 13)
        },
        {
          id: "region-5",
          name: "Восточный округ",
          area: 350000,
          population: 1700000,
          coordinates: generateRegionBoundaries(2560, 1280, 14)
        }
      ],
      cities: [
        {
          id: "city-6",
          name: "Западная Столица",
          population: 1200000,
          x: 800,
          y: 600,
          city_type: "city",
          region_id: "region-4",
          is_capital: 1
        },
        {
          id: "city-7",
          name: "Восточный Город",
          population: 900000,
          x: 1800,
          y: 600,
          city_type: "city",
          region_id: "region-5",
          is_capital: 2
        },
        {
          id: "city-8",
          name: "Прибрежный город",
          population: 600000,
          x: 600,
          y: 800,
          city_type: "city",
          region_id: "region-4",
          is_capital: 0
        },
        {
          id: "city-9",
          name: "Восточная деревня",
          population: 30000,
          x: 2000,
          y: 700,
          city_type: "village",
          region_id: "region-5",
          is_capital: 0
        }
      ]
    },
    {
      id: "country-3",
      name: "Восточное Королевство",
      color: "#45B7D1",
      population: 2800000,
      area: 500000,
      government_type: "Конституционная монархия",
      capital_id: "city-10",
      regions: [
        {
          id: "region-6",
          name: "Восточная провинция",
          area: 220000,
          population: 1400000,
          coordinates: generateRegionBoundaries(2560, 1280, 11)
        },
        {
          id: "region-7",
          name: "Западная провинция",
          area: 280000,
          population: 1400000,
          coordinates: generateRegionBoundaries(2560, 1280, 12)
        }
      ],
      cities: [
        {
          id: "city-10",
          name: "Восточная Столица",
          population: 1000000,
          x: 2000,
          y: 400,
          city_type: "city",
          region_id: "region-6",
          is_capital: 1
        },
        {
          id: "city-11",
          name: "Западный город",
          population: 800000,
          x: 1000,
          y: 1000,
          city_type: "city",
          region_id: "region-7",
          is_capital: 2
        },
        {
          id: "city-12",
          name: "Северный поселок",
          population: 40000,
          x: 2200,
          y: 200,
          city_type: "town",
          region_id: "region-6",
          is_capital: 0
        }
      ]
    }
  ]
};


// Экспорт данных политической карты для использования в компонентах Vue
export default politicalData;
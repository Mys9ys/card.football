// Навигатор с нижними вкладками

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Экраны
import PackOpeningScreen from '../screens/PackOpeningScreen';
import CollectionScreen from '../screens/CollectionScreen';
import TeamFormationScreen from '../screens/TeamFormationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Коллекция"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Пакеты') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Коллекция') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'Команда') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Профиль') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        headerStyle: {
          backgroundColor: '#0066cc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Пакеты" component={PackOpeningScreen} />
      <Tab.Screen name="Коллекция" component={CollectionScreen} />
      <Tab.Screen name="Команда" component={TeamFormationScreen} />
      <Tab.Screen
        name="Профиль"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
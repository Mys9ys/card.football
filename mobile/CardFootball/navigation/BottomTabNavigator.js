// Bottom tabs — Bubble theme

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { BubbleTheme } from '../theme/bubble';

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
        tabBarActiveTintColor: BubbleTheme.tabActive,
        tabBarInactiveTintColor: BubbleTheme.muted,
        tabBarStyle: {
          backgroundColor: BubbleTheme.bar,
          borderTopWidth: 1,
          borderTopColor: BubbleTheme.line,
        },
        headerStyle: {
          backgroundColor: BubbleTheme.bar,
        },
        headerTintColor: BubbleTheme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: BubbleTheme.text,
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

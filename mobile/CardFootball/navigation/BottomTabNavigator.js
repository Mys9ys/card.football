// Bottom tabs — Bubble theme

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { BubbleTheme } from '../theme/bubble';

import PackOpeningScreen from '../screens/PackOpeningScreen';
import CollectionScreen from '../screens/CollectionScreen';
import TeamFormationScreen from '../screens/TeamFormationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Пакеты: { on: 'gift', off: 'gift-outline' },
  Коллекция: { on: 'albums', off: 'albums-outline' },
  Команда: { on: 'people', off: 'people-outline' },
  Профиль: { on: 'person', off: 'person-outline' },
};

function BubbleTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        const focused = state.index === index;
        const color = focused ? BubbleTheme.tabActive : BubbleTheme.muted;
        const icons = TAB_ICONS[route.name] || { on: 'ellipse', off: 'ellipse-outline' };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={typeof label === 'string' ? label : route.name}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Icon
              name={focused ? icons.on : icons.off}
              size={22}
              color={color}
            />
            <Text style={[styles.tabLabel, { color }]}>
              {typeof label === 'string' ? label : route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Коллекция"
      tabBar={(props) => <BubbleTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: BubbleTheme.bar,
        },
        headerTintColor: BubbleTheme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: BubbleTheme.text,
        },
      }}
    >
      <Tab.Screen
        name="Пакеты"
        component={PackOpeningScreen}
        options={{ headerShown: false }}
      />
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: BubbleTheme.bar,
    borderTopWidth: 1,
    borderTopColor: BubbleTheme.line,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 14 : 10,
    minHeight: 72,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
  },
});

export default BottomTabNavigator;

// Компонент для выбора схемы расстановки

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

// Импорт типов карт (исправленный путь)
const CARD_TYPES = require('../game_logic/card_types').CARD_TYPES;

// Инициализация коллекции при необходимости
if (typeof collectionSystem !== 'undefined' && collectionSystem && typeof PLAYER_ID !== 'undefined') {
  collectionSystem.initializePlayerCollection(PLAYER_ID);
}

const FormationSelector = ({ selectedFormation, onFormationSelect }) => {
  // Доступные схемы расстановки
  const formations = Object.values(CARD_TYPES.FORMATIONS);

  // Рендер элемента списка
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.formationItem, 
        selectedFormation === item.id && styles.formationItemSelected
      ]} 
      onPress={() => onFormationSelect(item.id)}
    >
      <Text style={styles.formationName}>{item.name}</Text>
      <Text style={styles.formationDescription}>{item.description}</Text>
      <Text style={styles.formationLayout}>
        {item.players.goalkeeper}-{item.players.defenders}-{item.players.midfielders}-{item.players.attackers}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите схему расстановки</Text>
      
      <FlatList
        data={formations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 10,
  },
  formationItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  formationItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  formationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  formationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  formationLayout: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    textAlign: 'center',
  },
});

export default FormationSelector;
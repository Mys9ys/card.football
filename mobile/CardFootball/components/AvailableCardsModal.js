// Модальное окно для выбора карты игрока

import React from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import CardItem from './CardItem';

const AvailableCardsModal = ({
  visible,
  onClose,
  availableCards,
  onCardSelect,
  position
}) => {
  // Фильтрация карт по позиции
  const filteredCards = availableCards.filter(card => card.position === position);

  // Обработка выбора карты
  const handleCardSelect = (card) => {
    onCardSelect(card);
    onClose();
  };

  // Рендер элемента списка
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={() => handleCardSelect(item)}
    >
      <CardItem card={item} />
    </TouchableOpacity>
  );

  // Рендер пустого состояния
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>У вас нет игроков на позицию {position}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Выберите игрока</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredCards}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    margin: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AvailableCardsModal;
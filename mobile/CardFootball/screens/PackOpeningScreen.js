// Экран открытия пакетов

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, Image, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { PackService } from '../services/PackService';
import PackCard from '../components/PackCard';
import CollectionStats from '../components/CollectionStats';

const PackOpeningScreen = () => {
  const [packs, setPacks] = useState([]);
  const [stats, setStats] = useState({
    collection: null,
    statsByRarity: null,
    statsByPosition: null,
    completion: null,
    playerCurrency: null
  });
  
  const [isOpening, setIsOpening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [packResult, setPackResult] = useState(null);
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const packAnimation = useRef(null);
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadPackData();
  }, []);

  // Анимация пульсации пакета
  useEffect(() => {
    if (packs.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [packs]);

  // Загрузка данных пакетов и статистики
  const loadPackData = () => {
    try {
      const packTypes = PackService.getAllPackTypes();
      setPacks(packTypes);
      
      const collectionResult = PackService.getPlayerCollection();
      const statsByRarityResult = PackService.getCollectionStatsByRarity();
      const statsByPositionResult = PackService.getCollectionStatsByPosition();
      const completionResult = PackService.getCollectionCompletion();
      const currencyResult = PackService.getPlayerCurrency();
      
      setStats({
        collection: collectionResult,
        statsByRarity: statsByRarityResult,
        statsByPosition: statsByPositionResult,
        completion: completionResult,
        playerCurrency: currencyResult
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные пакетов');
      console.error('Error loading pack data:', error);
    }
  };

  const handleOpenPack = async (packTypeId) => {
    // Подтверждение покупки
    Alert.alert(
      'Покупка пакета',
      `Вы уверены, что хотите купить пакет за ${PackService.getAllPackTypes().find(p => p.id === packTypeId).price} монет?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Купить',
          onPress: async () => {
            setIsOpening(true);
            
            // Запуск анимации открытия пакета
            if (packAnimation.current) {
              packAnimation.current.play();
            }
            
            // Убираем имитацию процесса открытия пакета с анимацией
            try {
                console.log('Attempting to open pack:', packTypeId);
                const result = await PackService.openPack(packTypeId);
                console.log('Pack opening result in screen:', result);
                
                if (result.success) {
                  setPackResult(result);
                  setShowResults(true);
                  
                  // Обновление статистики
                  const collectionResult = PackService.getPlayerCollection();
                  console.log('Updated collection:', collectionResult);
                  
                  const statsByRarityResult = PackService.getCollectionStatsByRarity();
                  const statsByPositionResult = PackService.getCollectionStatsByPosition();
                  const completionResult = PackService.getCollectionCompletion();
                  const currencyResult = PackService.getPlayerCurrency();
                  console.log('Updated currency:', currencyResult);
                  
                  setStats({
                    collection: collectionResult,
                    statsByRarity: statsByRarityResult,
                    statsByPosition: statsByPositionResult,
                    completion: completionResult,
                    playerCurrency: currencyResult
                  });
                } else {
                  Alert.alert('Ошибка', result.error);
                  console.error('Pack opening failed:', result.error);
                }
              } catch (error) {
                Alert.alert('Ошибка', 'Не удалось открыть пакет');
                console.error('Error opening pack:', error);
              }

              setIsOpening(false);
          }
        }
      ]
    );
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setPackResult(null);
  };

  // Показываем индикатор загрузки, пока данные не загружены
  if (packs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Открытие пакетов</Text>
          <Text style={styles.subtitle}>Получайте новые карты для своей команды</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка пакетов...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        // Bound ScrollView height so web can scroll inside the phone column.
        const next = Math.floor(e.nativeEvent.layout.height);
        if (next > 0 && next !== scrollAreaHeight) {
          setScrollAreaHeight(next);
        }
      }}
    >
      <ScrollView
        style={[
          styles.list,
          scrollAreaHeight > 0 ? { height: scrollAreaHeight } : null,
          Platform.OS === 'web' ? styles.listWeb : null,
        ]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <View style={styles.header}>
          <Text style={styles.title}>Открытие пакетов</Text>
          <Text style={styles.subtitle}>Получайте новые карты для своей команды</Text>
          <Image
            source={require('../assets/theme/pack-bubble.jpg')}
            style={styles.packHero}
            resizeMode="cover"
          />
        </View>

        <CollectionStats stats={stats} completion={stats.completion} />

        <Text style={styles.packsTitle}>Доступные пакеты</Text>
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onPress={() => handleOpenPack(pack.id)}
          />
        ))}
      </ScrollView>

      {/* Модальное окно для отображения результатов открытия пакета */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showResults}
        onRequestClose={handleCloseResults}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Результат открытия пакета</Text>
          
          {packResult && (
            <>
              <Text style={styles.resultText}>Открыт пакет: {packResult.packType}</Text>
              
              <Text style={styles.sectionTitle}>Новые карты:</Text>
              {packResult.collectionResult.newCards.map(card => (
                <View key={card.id} style={styles.cardResultItem}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardPosition}>{card.position}</Text>
                  <Text style={styles.cardTeam}>{card.team}</Text>
                </View>
              ))}
              
              {packResult.collectionResult.duplicates.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Дубликаты:</Text>
                  {packResult.collectionResult.duplicates.map(card => (
                    <View key={card.id} style={styles.cardResultItem}>
                      <Text style={styles.cardName}>{card.name} (дубликат)</Text>
                      <Text style={styles.duplicateText}>+{PackService.getCurrencyForDuplicate(card.rarity)} монет</Text>
                    </View>
                  ))}
                </>
              )}
              
              <Text style={styles.finalBalance}>
                Новый баланс: {packResult.playerCurrency.currency} монет
              </Text>
            </>
          )}
          
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseResults}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Индикатор открытия пакета с анимацией */}
      {isOpening && (
        <View style={styles.openingOverlay}>
          <Animated.View style={[styles.openingContainer, { transform: [{ scale: pulseAnimation }] }]}
            onPress={() => {
              if (packAnimation.current) {
                packAnimation.current.play();
              }
            }}>
            <Text style={styles.openingText}>Открытие пакета...</Text>
            <LottieView
              ref={packAnimation}
              source={require('../assets/animations/pack-opening.json')}
              autoPlay={false}
              loop={false}
              style={styles.openingAnimation}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#DFF6FF',
  },
  header: {
    backgroundColor: '#9BE7FF',
    padding: 16,
    paddingTop: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2150',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6A6290',
    textAlign: 'center',
    marginTop: 5,
  },
  list: {
    flexGrow: 1,
    flexShrink: 1,
  },
  listWeb: {
    // RN Web: force overflow scroll once height is bounded
    overflow: 'auto',
  },
  listContent: {
    paddingBottom: 96,
    paddingHorizontal: 4,
  },
  packsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    color: '#2A2150',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF7FB',
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  cardResultItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardPosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardTeam: {
    fontSize: 14,
    color: '#FF6B8A',
    marginTop: 3,
  },
  duplicateText: {
    fontSize: 14,
    color: '#FF6B8A',
    marginTop: 5,
    fontWeight: 'bold',
  },
  finalBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#2A2150',
  },
  closeButton: {
    backgroundColor: '#FF6B8A',
    padding: 15,
    borderRadius: 999,
    marginTop: 20,
    alignItems: 'center',
    minHeight: 44,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  openingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 33, 80, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  openingContainer: {
    backgroundColor: '#FFF7FB',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
  },
  openingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2A2150',
  },
  packHero: {
    width: 120,
    height: 150,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FF6B8A',
  },
  openingGif: {
    width: 100,
    height: 100,
  },
  openingAnimation: {
    width: 150,
    height: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default PackOpeningScreen;
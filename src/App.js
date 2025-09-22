import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { getData } from './services/storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCurrentAdvertisement } from './api/api';

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [adData, setAdData] = useState(null);
  const [isAdVisible, setAdVisible] = useState(false);
  const [adShown, setAdShown] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedDeviceId = await getData('device_id');
        setInitialRoute(storedDeviceId ? 'Menu' : 'Login01');

        if (storedDeviceId && !adShown) {
          const advertisement = await getCurrentAdvertisement();
          if (advertisement) {
            setAdData(advertisement);
            setAdVisible(true);
            setAdShown(true);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar o aplicativo:', error);
        setInitialRoute('Login01');
      }
    };
    initializeApp();
  }, [adShown]);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#19b954" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator
          initialRoute={initialRoute}
          adData={adData}
          isAdVisible={isAdVisible}
          setAdVisible={setAdVisible}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
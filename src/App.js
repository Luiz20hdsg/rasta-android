import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { getData } from './services/storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedDeviceId = await getData('device_id');
        setInitialRoute(storedDeviceId ? 'MessageList' : 'Login01');
      } catch (error) {
        console.error('Erro ao inicializar o aplicativo:', error);
        setInitialRoute('Login01');
      }
    };
    initializeApp();
  }, []);

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
        <AppNavigator initialRoute={initialRoute} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
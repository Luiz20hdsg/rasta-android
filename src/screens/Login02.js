/*import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { verifyAuthCode } from '../services/auth';
import { getDeviceId } from '../services/onesignal';
import { saveData, getData } from '../services/storage';
import { registerDevice } from '../api/api';
import { globalStyles } from '../styles/globalStyles';
import { BUILD_MODE, REVIEW_USER_EMAIL, REVIEW_USER_STATIC_CODE } from '@env';


const { width, height } = Dimensions.get('window');

const Login02 = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const email = await getData('email');
      if (!code || !email) {
        alert('Por favor, insira o código recebido por e-mail.');
        return;
      }

      const session = await verifyAuthCode(email, code);
      if (!session) {
        alert('Código inválido ou expirado. Tente novamente ou solicite um novo código.');
        return;
      }

      const deviceId = await getDeviceId();
      if (!deviceId) {
        alert('Não foi possível registrar o dispositivo. Verifique sua conexão e tente novamente.');
        return;
      }

      await saveData('device_id', deviceId);
      await saveData('email', email);

      const response = await registerDevice(email, deviceId);
      if (response.message !== 'Usuário criado com sucesso') {
        alert('Erro ao registrar o dispositivo. Tente novamente mais tarde.');
        return;
      }

      navigation.replace('Menu');
    } catch (error) {
      alert('Ocorreu um erro durante a autenticação. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isSubmitting, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <Image source={require('../assets/sublogo02.png')} style={styles.sublogo02} />
      <Image source={require('../assets/sublogo5.png')} style={styles.sublogo05} />
      <View style={styles.content}>
        <Image source={require('../assets/sublogo6.png')} style={styles.sublogo06} />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.text}>Informe o código recebido por e-mail</Text>
        <View style={styles.inputContainer}>
          <Input
            value={code}
            onChangeText={setCode}
            placeholder="Código"
            keyboardType="numeric"
            style={styles.input}
            autoFocus={true}
          />
          <Button
            title="Validar o código"
            onPress={handleVerify}
            style={styles.button}
            textStyle={styles.buttonText}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sublogo02: {
    width: width * 0.25,
    height: width * 0.25,
    top: 20,
    right: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  sublogo05: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: 0,
    right: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  sublogo06: {
    width: width * 0.35,
    height: width * 0.35,
    left: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  logo: {
    width: 180.34,
    height: 50.58,
    marginBottom: 20,
  },
  text: {
    width: 281,
    height: 48,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    width: 281,
    gap: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#000',
  },
  button: {
    height: 40,
    backgroundColor: '#19b954',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
  },
});

export default Login02;*/

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { verifyAuthCode } from '../services/auth';
import { getDeviceId } from '../services/onesignal';
import { saveData, getData } from '../services/storage';
import { registerDevice, getCompanyData } from '../api/api';
import { globalStyles } from '../styles/globalStyles';
import { BUILD_MODE, REVIEW_USER_EMAIL, REVIEW_USER_STATIC_CODE } from '@env';

const { width } = Dimensions.get('window');

const Login02 = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await getCompanyData();
        setCompanyData(data);
      } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleVerify = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const email = await getData('email');
      if (!email) {
        Alert.alert('Erro', 'Ocorreu um erro. Por favor, volte e insira seu e-mail novamente.');
        setIsSubmitting(false);
        return;
      }

      if (BUILD_MODE === 'review' && email === REVIEW_USER_EMAIL && code === REVIEW_USER_STATIC_CODE) {
        console.log('--- MODO REVISÃO: Bypass de autenticação ---');
        
        const deviceId = await getDeviceId();
        if (!deviceId) {
          Alert.alert('Erro', 'Não foi possível obter a ID do dispositivo para o modo de revisão.');
          setIsSubmitting(false);
          return;
        }

        console.log('Device ID obtido:', deviceId);
        await saveData('device_id', deviceId);
        await saveData('email', email);

        const apiResponse = await registerDevice(email, deviceId);
        console.log('Resposta da API (Bypass):', apiResponse);
        
        navigation.replace('Menu');
        return;
      }

      if (!code) {
        Alert.alert('Atenção', 'Por favor, insira o código recebido por e-mail.');
        setIsSubmitting(false);
        return;
      }

      const { session, error } = await verifyAuthCode(email, code);

      if (error) {
        Alert.alert('Erro de Autenticação', String(error));
        setIsSubmitting(false);
        return;
      }

      if (!session) {
        Alert.alert('Erro', 'Código inválido ou expirado. Tente novamente ou solicite um novo código.');
        setIsSubmitting(false);
        return;
      }

      const deviceId = await getDeviceId();
      if (!deviceId) {
        Alert.alert('Erro', 'Não foi possível registrar o dispositivo. Verifique sua conexão e tente novamente.');
        setIsSubmitting(false);
        return;
      }

      if (!companyData || !companyData.id) {
        Alert.alert('Erro', 'Não foi possível obter os dados da empresa. Tente novamente mais tarde.');
        setIsSubmitting(false);
        return;
      }

      await saveData('device_id', deviceId);
      

      const response = await registerDevice(email, deviceId, companyData.id);
      
      if (response.message !== 'Usuário criado com sucesso') {
        Alert.alert('Erro', response.message || 'Erro ao registrar o dispositivo. Tente novamente mais tarde.');
        setIsSubmitting(false);
        return;
      }

      navigation.replace('Menu');

    } catch (error) {
      console.error("Erro completo na verificação:", error);
      const errorMessage = error.message || 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro', `Ocorreu um erro durante a autenticação: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isSubmitting, navigation, companyData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#19b954" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: companyData?.primaryColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
            <Image source={require('../assets/logo_raspa.png')} style={styles.sublogo02} />
      {companyData && <Image source={{ uri: companyData.image6.replace(/'/g, '') }} style={styles.sublogo05} />}
      <View style={styles.content}>
        {companyData && <Image source={{ uri: companyData.image7.replace(/'/g, '') }} style={styles.sublogo06} />}
        {companyData && <Image source={{ uri: companyData.image1.replace(/'/g, '') }} style={styles.logo} />}
        <Text style={[styles.text, { color: companyData?.tertiaryColor }]}>Informe o código recebido por e-mail</Text>
        <View style={styles.inputContainer}>
          <Input
            value={code}
            onChangeText={setCode}
            placeholder="Código"
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: companyData?.tertiaryColor, color: companyData?.primaryColor }]}
            autoFocus={true}
          />
          <Button
            title="Validar o código"
            onPress={handleVerify}
            style={[styles.button, { backgroundColor: '#19b954' }]}
            textStyle={[styles.buttonText, { color: companyData?.primaryColor }]}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sublogo02: {
    width: width * 0.25,
    height: width * 0.25,
    top: 20,
    right: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  sublogo05: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: 0,
    right: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  sublogo06: {
    width: width * 0.35,
    height: width * 0.35,
    left: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  logo: {
    width: 180.34,
    height: 50.58,
    marginBottom: 20,
  },
  text: {
    width: 281,
    height: 48,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    width: 281,
    gap: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#000',
  },
  button: {
    height: 40,
    backgroundColor: '#19b954',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
});

export default Login02;
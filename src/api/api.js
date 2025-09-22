import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_URL não está definido no arquivo .env');
}

const getStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); 
    return token;
  } catch (error) {
    console.error('Erro ao recuperar o token do AsyncStorage:', error);
    return null;
  }
};

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token); 
    console.log('Token salvo no AsyncStorage:', token);
  } catch (error) {
    console.error('Erro ao salvar o token no AsyncStorage:', error);
    throw error;
  }
};

const getHeaders = async () => {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado. Faça login novamente.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const registerDevice = async (email, device_id, companyId) => {
  try {
    const payload = { email, device_id, companyId };
    console.log('Enviando payload para POST /user/create:', payload);

    const response = await fetch(`${API_BASE_URL}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Resposta do POST /user/create:', data);

    if (!response.ok) {
      const errorData = data || { message: 'Erro desconhecido' };
      throw new Error(`Erro ao criar usuário: ${errorData.message}`);
    }

    if (data.token) {
      await saveToken(data.token);
    } else {
      throw new Error('Token não retornado na resposta do servidor.');
    }

    return data;
  } catch (error) {
    console.error('Erro em registerDevice:', error);
    throw error;
  }
};



export const getNotificationSettings = async (email) => {
  try {
    const url = `${API_BASE_URL}/user/settings/${encodeURIComponent(email)}`;
    console.log('Buscando configurações:', url);
    
    const headers = await getHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('Resposta do GET /user/settings:', data);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido ou expirado. Faça login novamente.');
      }
      throw new Error(data.message || 'Erro ao carregar configurações');
    }
    
    return data;
  } catch (error) {
    console.error('Erro em getNotificationSettings:', error);
    throw error;
  }
};

export const saveNotificationSettings = async (email, settings) => {
  try {
    const payload = settings;
    console.log('Salvando configurações:', payload);
    
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/user/settings/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Resposta do PUT /user/settings:', data);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido ou expirado. Faça login novamente.');
      }
      throw new Error(data.message || 'Erro ao salvar configurações');
    }
    
    return data;
  } catch (error) {
    console.error('Erro em saveNotificationSettings:', error);
    throw error;
  }
};

export const getNotificationDelay = async (email) => {
  try {
    
    const API_DELAY_URL = process.env.EXPO_PUBLIC_API_DELAY_URL;
    if (!API_DELAY_URL) {
      throw new Error('EXPO_PUBLIC_API_DELAY_URL não está definido no arquivo .env');
    }

    const url = `${API_DELAY_URL}/settings/notification-delay/${encodeURIComponent(email)}`;
    console.log('Buscando delay de notificação:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Resposta do GET /settings/notification-delay:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao carregar delay de notificação');
    }

    
    return data.delayInMinutes;
  } catch (error) {
    console.error('Erro em getNotificationDelay:', error);
    return 2;
  }
};

export const getCompanyData = async () => {
  try {
    const API_WHITE_LABEL_URL = process.env.PUBLIC_API_URL_WHITE_LABEL;
    if (!API_WHITE_LABEL_URL) {
      throw new Error('PUBLIC_API_URL_WHITE_LABEL não está definido no arquivo .env');
    }

    const response = await fetch(API_WHITE_LABEL_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer paguex',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar dados da empresa');
    }

    return data.company;
  } catch (error) {
    console.error('Erro em getCompanyData:', error);
    throw error;
  }
};

export const getCurrentAdvertisement = async () => {
  const apiUrl = 'https://mdjwnstt36.execute-api.us-east-1.amazonaws.com/Prod/advertisement/current';
  console.log('Buscando anúncio atual:', apiUrl);

  try {
    const response = await fetch(apiUrl);

    if (response.status === 404) {
      console.log("Nenhum anúncio ativo encontrado.");
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro na API de anúncios: ${response.statusText}`);
    }

    const adData = await response.json();
    console.log("Dados do anúncio recebidos:", adData);
    return adData;

  } catch (error) {
    console.error("Falha ao buscar anúncio:", error);
    return null;
  }
};

import { createClient } from '@supabase/supabase-js';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env';

if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Variáveis do Supabase não definidas');
}

const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY);

export const sendAuthCode = async (email) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('Email inválido:', email);
    return false;
  }
  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    console.log('Código enviado com sucesso para:', email);
    return true;
  } catch (error) {
    console.error('Erro ao enviar código:', error.message);
    return false;
  }
};

export const verifyAuthCode = async (email, token) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      console.error('Erro do Supabase ao verificar OTP:', error);
      return { session: null, error: error.message };
    }

    console.log('Autenticação bem-sucedida:', data);
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Erro inesperado em verifyAuthCode:', error);
    return { session: null, error: 'Ocorreu um erro inesperado.' };
  }
};
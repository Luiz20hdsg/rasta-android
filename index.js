import { registerRootComponent } from 'expo';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { getData, saveData } from './src/services/storage';
import { emit } from './src/services/EventEmitter';

import App from './src/App';

const STORAGE_KEY = 'messages';
const MAX_MESSAGES = 200;

const handleReceivedNotification = async (notification) => {
  try {
    const existingMessages = await getData(STORAGE_KEY);
    let messages = existingMessages ? JSON.parse(existingMessages) : [];

    if (messages.length >= MAX_MESSAGES) {
      messages.shift();
    }

    const newMessage = {
      id: notification.rawPayload.google?.message_id || Date.now(),
      title: notification.title,
      message: notification.body,
      readed: false,
      date: new Date().toISOString(),
    };

    messages.push(newMessage);
    await saveData(STORAGE_KEY, JSON.stringify(messages));

    emit('newMessage');

  } catch (error) {
    console.error('Error handling notification in index.js', error);
  }
};

// OneSignal Initialization
OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize('8a665c1f-f02f-4cf1-a06a-aa18cd41ae69');
OneSignal.Notifications.requestPermission(true);

// Add listeners
OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
  console.log('index.js: Notificação recebida em foreground:', event.notification.title);
  handleReceivedNotification(event.notification);
});

OneSignal.Notifications.addEventListener('click', (event) => {
  console.log('index.js: Notificação clicada:', event.notification.title);
  handleReceivedNotification(event.notification);
});

registerRootComponent(App);
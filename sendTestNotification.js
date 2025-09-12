const axios = require('axios');

const sendTestNotification = async () => {
  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: '46b8e9ae-0621-46c1-a827-c4ee8ec41ba1',
        included_segments: ['All'],
        contents: { en: 'This is a test push notification' },
        headings: { en: 'Test Notification' },
      },
      {
        headers: {
          Authorization:'os_v2_app_i24otlqgefdmdkbhytxi5ra3uhi3uunj5zvubyvyf3ntd52tivsac43k4ectal56kslmoxw4b3vkialcnrdmzdic46drzi2opbp3cpy',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response?.data || error.message);
  }
};

sendTestNotification();

import * as Notifications from 'expo-notifications';

export const sendProjectUpdateNotification = async (project) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `📢 Dự án: ${project.title}`,
      body: 'Có cập nhật mới trong dự án!',
    },
    trigger: { seconds: 1 },
  });
};

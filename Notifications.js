import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications are handled while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests permission to send notifications. Must be called before
 * scheduling any notification, since Expo/OS requires explicit user consent.
 * @returns {Promise<boolean>} Whether permission was granted.
 */
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
};

/**
 * Adds a new reminder after checking permissions, then schedules the
 * underlying notification and updates the stored reminders list.
 * @param {{ title: string, body: string, triggerDate: Date }} reminder
 */
export const handleAddReminder = async (reminder) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const notificationId = await scheduleNotification(reminder);

  try {
    const remindersJson = await AsyncStorage.getItem('reminders');
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];

    const newReminder = {
      id: notificationId,
      title: reminder.title,
      body: reminder.body,
      triggerDate: reminder.triggerDate.toISOString(),
    };

    reminders.push(newReminder);
    await AsyncStorage.setItem('reminders', JSON.stringify(reminders));

    return newReminder;
  } catch (error) {
    console.error('Error saving reminder:', error);
    return null;
  }
};

/**
 * Schedules a local notification based on the reminder's trigger date.
 * @param {{ title: string, body: string, triggerDate: Date }} reminder
 * @returns {Promise<string>} The scheduled notification's ID.
 */
export const scheduleNotification = async (reminder) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.title,
      body: reminder.body,
      sound: true,
    },
    trigger: reminder.triggerDate,
  });

  return notificationId;
};

/**
 * Removes a reminder by its ID: cancels the scheduled notification,
 * updates AsyncStorage, and reflects the change in the UI list.
 * @param {string} id
 */
export const deleteReminder = async (id) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);

    const remindersJson = await AsyncStorage.getItem('reminders');
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];
    const updatedReminders = reminders.filter((r) => r.id !== id);

    await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
    return updatedReminders;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return null;
  }
};

/**
 * Sends an immediate test notification, useful for confirming notifications
 * are configured correctly before scheduling real reminders.
 */
export const sendTestNotification = async () => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test notification',
      body: 'Notifications are working correctly!',
      sound: true,
    },
    trigger: null, // null trigger fires immediately
  });
};

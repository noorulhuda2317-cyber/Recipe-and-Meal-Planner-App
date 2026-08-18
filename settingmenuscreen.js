import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MENU_ITEMS = [
  { id: 'account', label: 'Account', route: '/settings/account' },
  { id: 'notifications', label: 'Notifications', route: '/settings/notifications' },
  { id: 'dietary', label: 'Dietary preferences', route: '/settings/dietary' },
  { id: 'appearance', label: 'Appearance', route: '/settings/appearance' },
];

export default function SettingsMenuScreen() {
  const router = useRouter();

  const handleMenuPress = (route) => {
    router.push(route);
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userDetails');
            router.replace('/login');
          } catch (error) {
            console.error('Error logging out:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.menuList}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuRow}
            onPress={() => handleMenuPress(item.route)}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.chevron}>{'›'}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
          <Text style={styles.logoutLabel}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F3',
    paddingTop: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2420',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuList: {
    marginTop: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9DD',
  },
  menuLabel: {
    fontSize: 14,
    color: '#1F2420',
  },
  chevron: {
    fontSize: 16,
    color: '#A9A79E',
  },
  logoutLabel: {
    fontSize: 14,
    color: '#B3261E',
    fontWeight: '600',
  },
});

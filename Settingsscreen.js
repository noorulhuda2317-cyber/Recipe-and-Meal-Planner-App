import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const DEFAULT_SETTINGS = {
  mealReminders: true,
  shoppingListAlerts: true,
  newRecipeSuggestions: false,
  darkMode: false,
};

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsJson = await AsyncStorage.getItem('settings');
      if (settingsJson) {
        setSettings(JSON.parse(settingsJson));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const toggleSetting = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);

    try {
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading settings…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Text>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notification settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <SettingRow
          label="Meal reminders"
          sublabel="Notify before planned meals"
          value={settings.mealReminders}
          onToggle={() => toggleSetting('mealReminders')}
        />
        <SettingRow
          label="Shopping list alerts"
          sublabel="Remind me to shop"
          value={settings.shoppingListAlerts}
          onToggle={() => toggleSetting('shoppingListAlerts')}
        />
        <SettingRow
          label="New recipe suggestions"
          sublabel="Weekly recommendations"
          value={settings.newRecipeSuggestions}
          onToggle={() => toggleSetting('newRecipeSuggestions')}
        />
        <SettingRow
          label="Dark mode"
          sublabel="Switch app appearance"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, sublabel, value, onToggle }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSublabel}>{sublabel}</Text>
      </View>
      <TouchableOpacity
        style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
        onPress={onToggle}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F3',
  },
  loadingText: {
    padding: 20,
    fontSize: 13,
    color: '#6B6B66',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD6C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2420',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9DD',
  },
  rowLabel: {
    fontSize: 13,
    color: '#1F2420',
  },
  rowSublabel: {
    fontSize: 11,
    color: '#6B6B66',
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#D85A30',
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: '#DDD6C7',
    alignItems: 'flex-start',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
});

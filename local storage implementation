import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys used across the app.
const KEYS = {
  USERS: 'users',
  USER_DETAILS: 'userDetails',
  FAVORITES: 'favorites',
  MEAL_PLAN: 'mealPlan',
  SETTINGS: 'settings',
};

/* ---------------------------------------------
 * User accounts
 * ------------------------------------------- */

export const getUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error reading users from local storage:', error);
    return [];
  }
};

export const saveUser = async (newUser) => {
  try {
    const users = await getUsers();
    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error('Error saving user to local storage:', error);
    return false;
  }
};

export const findUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

/* ---------------------------------------------
 * Current session (logged-in user)
 * ------------------------------------------- */

export const setUserDetails = async (userDetails) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_DETAILS, JSON.stringify(userDetails));
    return true;
  } catch (error) {
    console.error('Error saving user details to local storage:', error);
    return false;
  }
};

export const getUserDetails = async () => {
  try {
    const detailsJson = await AsyncStorage.getItem(KEYS.USER_DETAILS);
    return detailsJson ? JSON.parse(detailsJson) : null;
  } catch (error) {
    console.error('Error reading user details from local storage:', error);
    return null;
  }
};

export const clearUserDetails = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_DETAILS);
    return true;
  } catch (error) {
    console.error('Error clearing user details from local storage:', error);
    return false;
  }
};

export const isLoggedIn = async () => {
  const details = await getUserDetails();
  return details !== null;
};

/* ---------------------------------------------
 * Favorites
 * ------------------------------------------- */

export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error reading favorites from local storage:', error);
    return [];
  }
};

export const toggleFavorite = async (recipeId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.includes(recipeId)
      ? favorites.filter((id) => id !== recipeId)
      : [...favorites, recipeId];

    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error updating favorites in local storage:', error);
    return [];
  }
};

/* ---------------------------------------------
 * Meal plan
 * ------------------------------------------- */

export const getMealPlan = async () => {
  try {
    const mealPlanJson = await AsyncStorage.getItem(KEYS.MEAL_PLAN);
    return mealPlanJson ? JSON.parse(mealPlanJson) : [];
  } catch (error) {
    console.error('Error reading meal plan from local storage:', error);
    return [];
  }
};

export const addToMealPlan = async (recipeId) => {
  try {
    const mealPlan = await getMealPlan();
    mealPlan.push({ recipeId, addedAt: new Date().toISOString() });
    await AsyncStorage.setItem(KEYS.MEAL_PLAN, JSON.stringify(mealPlan));
    return true;
  } catch (error) {
    console.error('Error adding to meal plan in local storage:', error);
    return false;
  }
};

/* ---------------------------------------------
 * App settings
 * ------------------------------------------- */

export const getSettings = async () => {
  try {
    const settingsJson = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settingsJson
      ? JSON.parse(settingsJson)
      : { darkMode: false, notificationsEnabled: true };
  } catch (error) {
    console.error('Error reading settings from local storage:', error);
    return { darkMode: false, notificationsEnabled: true };
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings to local storage:', error);
    return false;
  }
};

/* ---------------------------------------------
 * Utility
 * ------------------------------------------- */

export const clearAllLocalData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.USER_DETAILS,
      KEYS.FAVORITES,
      KEYS.MEAL_PLAN,
      KEYS.SETTINGS,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing local storage:', error);
    return false;
  }
};

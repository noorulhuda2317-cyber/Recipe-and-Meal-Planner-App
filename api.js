// api.js
// Handles all external API calls to TheMealDB (https://www.themealdb.com/api.php),
// a free public recipe API used to power recipe discovery in the app.

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Fetches recipes matching a search term from the external API.
 * @param {string} query - The recipe name or keyword to search for.
 * @returns {Promise<Array>} An array of recipe objects, or an empty array on failure.
 */
export const fetchRecipesByName = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);

    if (!response.ok) {
      console.error('Error fetching recipes:', response.status);
      return [];
    }

    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Network error while fetching recipes:', error);
    return [];
  }
};

/**
 * Fetches a single recipe's full details by its external API ID.
 * @param {string} id - The meal ID from TheMealDB.
 * @returns {Promise<Object|null>} The recipe object, or null on failure.
 */
export const fetchRecipeById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);

    if (!response.ok) {
      console.error('Error fetching recipe details:', response.status);
      return null;
    }

    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Network error while fetching recipe details:', error);
    return null;
  }
};

/**
 * Fetches a list of recipes belonging to a given category (e.g. "Breakfast", "Dessert").
 * @param {string} category - The category name.
 * @returns {Promise<Array>} An array of recipe summaries, or an empty array on failure.
 */
export const fetchRecipesByCategory = async (category) => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);

    if (!response.ok) {
      console.error('Error fetching recipes by category:', response.status);
      return [];
    }

    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Network error while fetching recipes by category:', error);
    return [];
  }
};

/**
 * Extracts a clean ingredients list from a raw TheMealDB recipe object,
 * since the API returns ingredients as up to 20 separate numbered fields.
 * @param {Object} meal - A single recipe object from the API.
 * @returns {Array<{ name: string, measure: string }>}
 */
export const extractIngredients = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  return ingredients;
};

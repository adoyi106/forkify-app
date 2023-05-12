import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    console.log(recipe);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      ingredients: recipe.ingredients,
      imageUrl: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      sourceUrl: recipe.source_url,
    };
    console.log(state.recipe);
    console.log(state.recipe.servings);
  } catch (err) {
    // console.error(`${err} 💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    if (!query) return;

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
      };
    });
    console.log(data);
  } catch (err) {
    console.error(`${err} 💥💥`);
    throw err;
  }
};

export const getSearchPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resPerPage;
  const end = page * state.search.resPerPage;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQty = oldQty * newQty/oldServings
  });
  state.recipe.servings = newServings;
  // console.log(state.recipe.servings);
};

import * as model from './model.js';
import searchView from './view/searchView.js';
import recipeView from './view/recipeView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlShowRecipe = async function () {
  //Rendering spinner
  recipeView.renderSpinner();
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // console.log(id);
    //1.) fetch recipe
    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    // const {recipe} =  model.state;

    //2. Render recipe to screen.
    recipeView.render(model.state.recipe);
    //TEST
    controlServings();
  } catch (err) {
    // console.error(err);
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    //1.) get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    //2.) Load search results

    await model.loadSearchResults(query);
    //3. resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchPage(3));
    //4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} you know`);
  }
};
const controlPagination = function (goToPage) {
  //1. render new results
  resultsView.render(model.getSearchPage(goToPage));
  //4. render new pagination buttons
  paginationView.render(model.state.search);
  console.log('ya');
};

const controlServings = function (newServings) {
  //update recipe servings
  model.updateServings(newServings);
  // model.updateServings(model.state.recipe, newServings);

  //render new recipe view
  recipeView.render(model.state.recipe);
};

// showRecipe();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
const init = function () {
  recipeView.addHandlerRender(controlShowRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

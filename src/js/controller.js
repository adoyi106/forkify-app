import * as model from './model.js';
import { MODAL_CLOSE_SEC } from '././config.js';
import searchView from './view/searchView.js';
import recipeView from './view/recipeView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipe.js';
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
    //0) mark recipe
    resultsView.update(model.getSearchPage());
    //1.)Updating bookmarks
    bookmarkView.update(model.state.bookmarks);

    //2.) fetch recipe
    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    // const {recipe} =  model.state;

    //3. Render recipe to screen.
    recipeView.render(model.state.recipe);
    //TEST
    // controlServings();
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
    resultsView.render(model.getSearchPage());
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
};

const controlServings = function (newServings) {
  //update recipe servings
  model.updateServings(newServings);
  // model.updateServings(model.state.recipe, newServings);

  //render new recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1.) Add recipe to bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //2.) update the bookmarked
  recipeView.update(model.state.recipe);

  //3.) render the updated bookmark from bookmark tab
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);

    //render success message
    addRecipeView.renderMessage();

    //render bookmark
    bookmarkView.render(model.state.bookmarks);

    //Change browser ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
};
// showRecipe();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlShowRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

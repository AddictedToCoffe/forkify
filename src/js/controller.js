import * as model from './model.js';
import { FORM_RECREATE_SEC, MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import previewView from './views/previewView.js';
import shoppingListView from './views/shoppingListView.js';
import calendarView from './views/calendarView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
// import { async } from 'regenerator-runtime';

// console.log(icons);

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0 Update results viwe to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //1 Loading recipe
    await model.loadRecipe(id); //await bo promise i async funcrtion - czekamy na wynik

    //2 Downloading calories
    await model.getCalories(model.state.recipe);

    //3 Rendering recipe
    recipeView.render(model.state.recipe);
    // constrolServings();
    // console.log(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError(`💥 ${err} 💥`);
  }
};
// controlRecipies();
// console.log('test');

//hashchange load i add kilka na raz

// window.addEventListener('hashchange', controlRecipies);
// window.addEventListener('load', controlRecipies);

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1 Get search query
    const query = searchView.getQuery();
    // if (!query) return;

    //2 Load search results
    await model.loadSearchResults(query);

    //3 Render results
    resultsView.render(model.getSearchResultsPage());

    //4 Render initial pagination butons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlSorting = async function (sortBy, maxMin) {
  //1 Checking for recipes to sort
  if (model.state.search.results.length === 0) return;

  //2. Spiner
  resultsView.renderSpinner();

  //3. Fethcing all recipes (we need ingredients and cookingtime)
  if (!model.state.search.results.every(rec => rec.cookingTime))
    await model.fetchAllFullRecipes();

  //4.Sorting recipes by our cryteria
  model.sortResults(sortBy, maxMin);

  //5.Rendering recipes again
  resultsView.render(model.getSearchResultsPage());
};

const controlPagination = function (goToPage) {
  //3 Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4 Render new pagination butons
  paginationView.render(model.state.search);
};

const constrolServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 Update recipe view - znaczek
  recipeView.update(model.state.recipe);

  //3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlDeleteAllBookmarks = function () {
  model.clearBookmarks();
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlAddIngToShoppingList = function () {
  //1 Add recipe ingredients to the shoppingList
  model.addIngredientsToShoppingList();

  //2 Render shopping list
  shoppingListView.render(model.state.shoppingList);
};

const controlDeleteIngFromShoppingList = function (ingDescription) {
  //1 Delete ingredient from Shopping list
  model.deleteIngFromShoppingList(ingDescription);
  //2 Render new Shopping List
  shoppingListView.render(model.state.shoppingList);
};

const controlShoppingList = function () {
  shoppingListView.render(model.state.shoppingList);
  // console.log(model.state.shoppingList);
};

const controlClearingShoppingList = function () {
  model.clearShoppingList();
  shoppingListView.render(model.state.shoppingList);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show load spinner
    addRecipeView.renderSpinner();

    //Upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // Succes message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //Close form window
    setTimeout(function () {
      addRecipeView.closeWindow(FORM_RECREATE_SEC);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const controlAddMeal = function (day, month, year, render = true) {
  //Add meal with data to meals array
  if (render) model.addMealtoCalendar(day, month, year);

  //Render meals in calendar in selected day
  calendarView.render(model.getMealsForSelectedDay(day, month, year));
};

const controlRenderDayMeals = function (day, month, year) {
  //Render meals in calendar in selected day
  calendarView.render(model.getMealsForSelectedDay(day, month, year));
};

const controlDeleteMeal = function (verifyNumb) {
  model.deleteMeal(verifyNumb);
};

const controlDeleteAllMeals = function () {
  model.clearMealsFromCalendar();
  calendarView.render(model.state.meals);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  bookmarksView.addHandlerDeleteAllBookmarks(controlDeleteAllBookmarks);
  shoppingListView.addHandlerRender(controlShoppingList);
  calendarView.addHandlerOpenCalendar(controlRenderDayMeals);
  calendarView.addHandlerDeleteMeal(controlDeleteMeal);
  calendarView.addHandlerDeleteAllMeals(controlDeleteAllMeals);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(constrolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddIngToShoppingList(controlAddIngToShoppingList);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddMealToCalendar(controlAddMeal);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  previewView.addHandlerSort(controlSorting);
  shoppingListView.addHandlerClearShoppingList(controlClearingShoppingList);
  shoppingListView.addHandlerDeleteIngredient(controlDeleteIngFromShoppingList);
  // console.log('Hello');
};
init();

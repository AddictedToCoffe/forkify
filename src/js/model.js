// import { async } from 'regenerator-runtime';
import { API_URL, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
import { RES_PER_PAGE } from './config';
import 'regenerator-runtime/runtime.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  shoppingList: [],
  meals: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // const res = await fetch(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);
    // const data = await res.json();

    // if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    //Temp error handling
    console.error(`💥 ${err} 💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.error(`💥 ${err} 💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

const persistShoppingList = function () {
  localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
};

export const addIngredientsToShoppingList = function () {
  // Add Ingredients to Shopping List
  console.log(state.shoppingList);
  console.log(state.recipe);
  if (state.shoppingList.length > 0)
    state.recipe.ingredients.forEach(newIng => {
      const sameIng = state.shoppingList.find(
        ing =>
          ing.description.toLowerCase().replaceAll(' ', '') ===
            newIng.description.toLowerCase().replaceAll(' ', '') &&
          ing.unit.toLowerCase().replaceAll(' ', '') ===
            newIng.unit.toLowerCase().replaceAll(' ', '')
      );
      if (!sameIng) state.shoppingList.push(newIng);
      else if (sameIng.quantity !== null) sameIng.quantity += newIng.quantity;
    });
  if (state.shoppingList.length === 0) {
    const copy = structuredClone(state);
    state.shoppingList.push(...copy.recipe.ingredients);
  }
  console.log(state.shoppingList);
  persistShoppingList();
};

export const deleteIngFromShoppingList = function (ingDescription) {
  const index = state.shoppingList.findIndex(
    ing => ing.description === ingDescription
  );
  state.shoppingList.splice(index, 1);
  console.log(state.shoppingList);
  persistShoppingList();
};

export const clearShoppingList = function () {
  state.shoppingList.length = 0;
  // persistShoppingList();
  localStorage.removeItem('shoppingList');
};
// clearShoppingList();

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bokkmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

export const clearBookmarks = function () {
  state.bookmarks.length = 0;
  state.recipe.bookmarked = false;
  localStorage.removeItem('bookmarks');
};
// clearBookmarks();

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  const storage2 = localStorage.getItem('shoppingList');
  if (storage2) state.shoppingList = JSON.parse(storage2);
  const storage3 = localStorage.getItem('meals');
  if (storage3) state.meals = JSON.parse(storage3);
  // console.log(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    const quantities = Object.entries(newRecipe).filter(entry =>
      entry[0].includes('quantity')
    );
    const units = Object.entries(newRecipe).filter(entry =>
      entry[0].includes('unit')
    );
    const descriptions = Object.entries(newRecipe).filter(
      entry => entry[0].includes('description') && entry[1] !== ''
    );

    const ingredients = descriptions.map((desc, i) => {
      const description = desc[1][0].toUpperCase() + desc[1].slice(1);
      const unit = units[i][1];
      const quantity = quantities[i][1] ? +quantities[i][1] : null;
      return { quantity, unit, description };
    });

    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    // console.error(err);
    throw err;
  }
};

export const fetchAllFullRecipes = async function () {
  try {
    const resultsID = state.search.results.map(res => res.id);
    const fetchResults = await Promise.all(
      resultsID.map(id => AJAX(`${API_URL}${id}?key=${KEY}`))
    );
    state.search.results = fetchResults.map(rec => createRecipeObject(rec));
    console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const sortResults = function (sortType, maxMin) {
  if (sortType === 'numberOfIngredients')
    return console.log(
      maxMin === 'FromMaxToMin'
        ? state.search.results.sort(
            (a, b) => b.ingredients.length - a.ingredients.length
          )
        : state.search.results.sort(
            (a, b) => a.ingredients.length - b.ingredients.length
          )
    );
  if (sortType === 'duration')
    return maxMin === 'FromMaxToMin'
      ? state.search.results.sort((a, b) => b.cookingTime - a.cookingTime)
      : state.search.results.sort((a, b) => a.cookingTime - b.cookingTime);
};

export const addMealtoCalendar = function (day, month, year) {
  const id = state.recipe.id;
  const publisher = state.recipe.publisher;
  const title = state.recipe.title;
  const image = state.recipe.image;
  const key = state.recipe.key && { key: state.recipe.key };
  const verifyNumb = Date.parse(new Date());
  //prettier-ignore
  state.meals.push({id, publisher, title, image, day, month, year, ...key, verifyNumb,});

  console.log(state.recipe);
  console.log(state.meals.at(-1));
  persistMeals();
};

export const getMealsForSelectedDay = function (day, month, year) {
  return state.meals.filter(
    meal => meal.day === day && meal.month === month && meal.year === year
  );
};

const persistMeals = function () {
  localStorage.setItem('meals', JSON.stringify(state.meals));
};

export const deleteMeal = function (verifyNumb) {
  console.log(verifyNumb);
  console.log(state.meals);
  const index = state.meals.findIndex(meal => meal.verifyNumb === +verifyNumb);
  console.log(index);
  state.meals.splice(index, 1);
  persistMeals();
};

export const clearMealsFromCalendar = function () {
  state.meals.length = 0;
  localStorage.removeItem('meals');
};

const getCalories = async function () {
  try {
    // const title = 'jajo';
    // const ingr = '1 egg';
    const food = { title: 'egg', unit: 'g', value: 100 };
    const key = 'db254b5cd61744d39a2deebd9c361444';
    const data = await AJAX(
      `https://api.spoonacular.com/recipes/guessNutrition?apiKey=${key}&title=${food}`
    );

    console.log(data);
    // if (!res.ok) throw new Error(`${data.message} ${res.status}`);
  } catch (err) {
    //Temp error handling
    console.error(`💥 ${err} 💥`);
    throw err;
  }
};
// getCalories();

//czy jak kopiujemy property a nie caly obiekt to tez jest jakies polaczenie ? NIE

// const obj = { rodzic: 'stary' };
// const obj2 = { rodzic: obj.rodzic };
// obj.rodzic = 'matka';
// console.log(obj);
// console.log(obj2);

// a jezeli bedzie to property jako obiekt(nested) to znow dzziala referencja ? TAK

// const objekt = { rodzic: { rodzic: 'stara' } };
// const objekt2 = { rodzic: objekt.rodzic };
// // objekt.rodzic.rodzic = 'stary';
// console.log(objekt);
// console.log(objekt2);

//czy mozemy modyfikowac obiekty utworzone z klasy w innym module ? recipeView.#data = (model.state.recipe); zamiast render ?
//MOzna jak nie private. Tylko tu chodzi chyba o to ze dzieki uzyciu funkcji robimy to wszystko za jednym razem dane generowanie itp a tu odpalamy jedna funkcje (w controller)

//wiemy ze obiekty maja live conection prototype sprawdzic czy jak dodamy dodatkowe metody i prywatne ogolne zmienne to tez sie pojawia?
// Pojawią  oprocz prywantch bo do nich nie ma dostepu z zewnatrz. trzeba je tworzyc w klasie

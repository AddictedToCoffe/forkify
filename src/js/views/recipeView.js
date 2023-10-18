'use strict';
import View from './View.js';
import icons from '../../img/icons.svg'; //parcel 1 //tez dzuala
// import icons from 'url:../img/icons.svg'; //parcel 2
import fracty from 'fracty';
import calendarView from './calendarView.js';
// console.log(Fraction);

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _calendarDays = document.querySelector('.days');
  _shoppingToast = document.querySelector('.shopping-toast');
  _message = '';
  _timerId = '';

  constructor() {
    super();
    this._fastCloseToastHandler();
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerAddIngToShoppingList(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--shopping');
      if (!btn) return;
      handler();
      clearTimeout(this._timerId);
      this._shoppingToast.classList.remove('hidden');
      this._timerId = setTimeout(
        () => this._shoppingToast.classList.add('hidden'),
        2000
      );
    });
  }

  addHandlerDeleteUploadedRecipe(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--delete_recipe');
      if (!btn) return;
      handler();
    });
  }

  addHandlerAddMealToCalendar(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--calendar');
      if (!btn) return;
      calendarView._recipeAddMealButtonHandler(handler);
    });
  }

  _generateMarkup() {
    return `
        <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
      <span>${this._data.title}</span>
      </h1>
      </figure>

      <div class="recipe__details">
      <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings - 1
        }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings + 1
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>

      <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
      </button>

      <button class="btn--round btn--shopping">
      <svg class="">
        <use href="${icons}#icon-shopping-cart"></use>
      </svg>
      </button>

      <button class="btn--round btn--calendar">
      <svg class="">
        <use href="${icons}#icon-calendar"></use>
      </svg>
      </button>

      <button class="btn--round btn--delete_recipe ${
        this._data.key ? '' : 'hidden'
      }" >
      <span class="del-icon">❌</span>
      </button>

      </div>

      <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients
        .map((ing, i) => this._generateMarkupIngredient(ing, i))
        .join('')}

      <h4 class="calories">
     ${(
       this._data.totalCalories / this._data.servings
     ).toFixed()} kcal/1 serving  ${this._data.totalCalories} kcal/Total
      </h4>
      </div>

      <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
      </p>
      <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
      >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </a>
      </div>
    `;
  }

  _generateMarkupIngredient(ing, i) {
    return `
<li class="recipe__ingredient">
<svg class="recipe__icon">
  <use href="${icons}#icon-check"></use>
</svg>
<div class="recipe__quantity">${
      ing.quantity ? fracty(ing.quantity).toString() : ''
    }</div>
<div class="recipe__description">
  <span class="recipe__unit">${ing.unit}</span>
  ${ing.description} 
  <span class="recipe__calories">${
    this._data.calories?.at(i) ? this._data.calories[i].toFixed() : ''
  } ${this._data.calories?.at(i) ? 'kcal' : ''}</span>
</div>
</li>
`;
  }

  _fastCloseToastHandler() {
    document.addEventListener(
      'click',
      () => {
        if (!this._shoppingToast.classList.contains('hidden'))
          this._shoppingToast.classList.add('hidden');
      },
      true
    );
    document.addEventListener(
      'keydown',
      e => {
        if (
          e.key === 'Escape' &&
          !this._shoppingToast.classList.contains('hidden')
        )
          this._shoppingToast.classList.add('hidden');
      },
      true
    );
  }
}

export default new RecipeView();

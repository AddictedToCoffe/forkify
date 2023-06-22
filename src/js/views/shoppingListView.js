import View from './View.js';
import icons from '../../img/icons.svg'; //parcel 1 //tez dzuala

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage =
    'No ingredients to buy yet. Find nice recipe and add ingredients to shopping list!';
  _message = '';
  _clearButton = document.querySelector('.shopping__clear');
  _shopping = document.querySelector('.shopping');

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(ing => {
        return `
        <li class="preview">
             <div class="preview__data2">
               <h4 class="preview__quantity">${
                 ing.quantity === null ? '' : ing.quantity
               }</h4>
               <h4 class="preview__unit">${ing.unit}</h4>
               <h4 class="preview__description">${ing.description}</h4>
               <h4 class="preview__delete">🗑️</h4>
         </div>
         </li>`;
      })
      .join('');
  }

  addHandlerClearShoppingList(handler) {
    this._clearButton.addEventListener('click', handler);
  }

  addHandlerDeleteIngredient(handler) {
    this._shopping.addEventListener('click', function (e) {
      const btn = e.target.closest('.preview__delete');
      if (!btn) return;
      // console.log(btn);
      const ingDescription = btn.previousElementSibling.textContent;
      // console.log(ingDescription);
      btn.closest('.preview').remove();
      handler(ingDescription);
    });
  }
}

export default new ShoppingListView();

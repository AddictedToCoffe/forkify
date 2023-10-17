import View from './View.js';
import icons from '../../img/icons.svg'; //parcel 1 //tez dzuala

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAddIng = document.getElementsByClassName('add__ing');
  _btnRemoveIng = document.getElementsByClassName('remove__ing');
  _ingredients = document.getElementsByClassName('ingredients');
  _allIngredients = document.getElementsByClassName('ingredient');
  _imageUrl = document.getElementsByClassName('image_url');
  _recipeUrl = document.getElementsByClassName('recipe_url');
  _activeIngredients = 6;
  _message = 'Recipe was succesfully uploaded !';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerAddRemoveIng();
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.openWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.closeWindow.bind(this));
    this._overlay.addEventListener('click', this.closeWindow.bind(this));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this._window.classList.contains('hidden'))
        this.closeWindow();
    });
  }

  // toogleWindow() {
  //   this._overlay.classList.toggle('hidden');
  //   this._window.classList.toggle('hidden');
  // }

  openWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  closeWindow(time) {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
    if (time) setTimeout(this._recreateForm.bind(this), time * 1000);
  }

  _validationInputs() {
    const ingQuantities = [...this._allIngredients]
      .filter(el => el.children[1].value !== '')
      .map(el => el.children[1].name.slice(0, -9));

    const ingUnits = [...this._allIngredients]
      .filter(el => el.children[2].value !== '')
      .map(el => el.children[2].name.slice(0, -5));

    const ingDescriptions = [...this._allIngredients]
      .filter(el => el.children[3].value !== '')
      .map(el => el.children[3].name);

    const descritpionsToFill = new Set([
      ...ingQuantities.filter(
        ing => !ingDescriptions.some(el => el.includes(ing))
      ),
      ...ingUnits.filter(ing => !ingDescriptions.some(el => el.includes(ing))),
    ]);

    if (descritpionsToFill.size !== 0) {
      descritpionsToFill.forEach(desc => {
        const invalidInput = document.querySelector(`.${desc}`).children[3];
        invalidInput.setCustomValidity('Write an ingredient');
        invalidInput.reportValidity();
        invalidInput.addEventListener('input', function () {
          this.setCustomValidity('');
        });
      });

      return;
    }

    const checkUnits = ingUnits.filter(
      units => !ingQuantities.some(quantity => quantity.includes(units))
    );
    // console.log(checkUnits);

    if (checkUnits.length !== 0) {
      checkUnits.forEach(unit => {
        const invalidInput = document.querySelector(`.${unit}`).children[1];
        invalidInput.setCustomValidity(
          'When units are filled quantities are required'
        );
        invalidInput.reportValidity();
        invalidInput.addEventListener('input', function () {
          this.setCustomValidity('');
        });
      });

      return;
    }

    const recipeUrlInput = this._recipeUrl[0].value;
    const imageUrlInput = this._imageUrl[0].value;
    // console.log(recipeUrlInput);
    // console.log(imageUrlInput);

    if (
      !recipeUrlInput.startsWith('https://') &&
      !recipeUrlInput.startsWith('http://')
    ) {
      this._recipeUrl[0].setCustomValidity('Not correct URL format');
      this._recipeUrl[0].reportValidity();
      this._recipeUrl[0].addEventListener('input', function () {
        this.setCustomValidity('');
      });
      return;
    }

    if (
      !imageUrlInput.startsWith('https://') &&
      !imageUrlInput.startsWith('http://')
    ) {
      this._imageUrl[0].setCustomValidity('Not correct URL format');
      this._imageUrl[0].reportValidity();
      this._imageUrl[0].addEventListener('input', function () {
        this.setCustomValidity('');
      });
      return;
    }

    if (
      imageUrlInput.startsWith('https://') ||
      imageUrlInput.startsWith('http://')
    ) {
      //prettier-ignore
      const imageFormats = ['DXF', 'DWF', 'DWG', 'AI', 'CDR', 'EPS', 'SVG', 'SWF', 'WMF', 'PDF', 'STL', 'JPEG', 'BMP', 'GIF', 'PNG', 'PSD', 'TIFF', 'RAW', 'HEIF', 'JPG', 'JPE', 'JIF', 'JFI', 'JFIF', '3FR', 'DNG', 'DATA', 'ARW', 'SR2', 'HEIF',
      ];

      const isImgValidate = imageFormats.some(format =>
        imageUrlInput.toLowerCase().endsWith(format.toLowerCase())
      );
      // console.log(isImgValidate);
      if (!isImgValidate) {
        this._imageUrl[0].setCustomValidity(
          'Url does not contain an image format'
        );
        this._imageUrl[0].reportValidity();
        this._imageUrl[0].addEventListener('input', function () {
          this.setCustomValidity('');
        });
        return;
      }
    }

    return 'validationOk';
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const validationStatus = this._validationInputs();
      if (validationStatus !== 'validationOk') return;
      const dataArr = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _addHandlerAddRemoveIng() {
    this._btnAddIng[0].addEventListener('click', this._addIng.bind(this));
    this._btnRemoveIng[0].addEventListener('click', this._removeIng.bind(this));
  }

  _addIng() {
    const num = (this._activeIngredients += 1);
    const markup = this._generateMarkupIngredient(num);
    this._ingredients[0].insertAdjacentHTML('beforeend', markup);
  }

  _removeIng() {
    if (this._activeIngredients < 2) return;
    // const ingToRemove = document.querySelector(
    //   `.ingredient-${this._activeIngredients}`
    // );
    //W ten sposob mozna wyrzucic ingredient-1 itp
    const ingToRemove = this._ingredients[0].lastElementChild;
    ingToRemove.remove();
    this._activeIngredients -= 1;
  }

  _recreateForm() {
    const markup = this._generateMarkupForm();
    this._parentElement.innerHTML = markup;
    this._activeIngredients = 6;
    this._addHandlerAddRemoveIng();
  }

  _generateMarkupIngredient(num) {
    return `<div class="ingredient ingredient-${num}">
  <label>Ingredient ${num}</label>
  <input
    value=""
    type="number"
    min="0.1"
    step="0.1"
    name="ingredient-${num}-quantity"
    placeholder="Quantity"
  />
  <input
    value=""
    type="text"
    pattern="[a-zA-Z ]*"
    name="ingredient-${num}-unit"
    placeholder="Unit"
  />
  <input
    value=""
    type="text"
    pattern="[a-zA-Z %,.]*"
    name="ingredient-${num}-description"
    placeholder="Description"
  />
  </div>`;
  }

  _generateMarkupForm() {
    return `<div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input
            placeholder="Recipe title..."
            required
            name="title"
            type="text"
            minlength="3"
          />
          <label>URL</label>
          <input
            placeholder="Recipe page URL..."
            required
            name="sourceUrl"
            type="url"
            class="recipe_url"
          />
          <label>Image URL</label>
          <input placeholder="Image URL..." required name="image" type="url" class="image_url" />
          <label>Publisher</label>
          <input
            placeholder="Publisher..."
            required
            name="publisher"
            type="text"
            minlength="4"
          />
          <label>Preparation time (minutes)</label>
          <input
            placeholder="Preparation time..."
            required
            name="cookingTime"
            type="number"
          />
          <label>Servings</label>
          <input
            placeholder="How many servings..."
            required
            name="servings"
            type="number"
          />
        </div>

        <div class="upload__column2">
        <h3 class="upload__heading">Ingredients</h3>
        <div class="ingredients">
        <div class="ingredient ingredient-1">
        <label>Ingredient 1</label>
        <input
          value=""
          min="0.1"
          step="0.1"
          type="number"
          name="ingredient-1-quantity"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z ]*"
          name="ingredient-1-unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z %,.]*"
          required
          name="ingredient-1-description"
          placeholder="Description"
        />
      </div>
      <div class="ingredient ingredient-2">
        <label>Ingredient 2</label>
        <input
          value=""
          min="0.1"
          step="0.1"
          type="number"
          name="ingredient-2-quantity"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z ]*"
          name="ingredient-2-unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z %,.]*"
          name="ingredient-2-description"
          placeholder="Description"
        />
      </div>
      <div class="ingredient ingredient-3">
        <label>Ingredient 3</label>
        <input
          value=""
          type="number"
          min="0.1"
          step="0.1"
          name="ingredient-3-quantity"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z ]*"
          name="ingredient-3-unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z %,.]*"
          name="ingredient-3-description"
          placeholder="Description"
        />
      </div>
      <div class="ingredient ingredient-4">
        <label>Ingredient 4</label>
        <input
          value=""
          type="number"
          min="0.1"
          step="0.1"
          name="ingredient-4-quantity"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z ]*"
          name="ingredient-4-unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z %,.]*"
          name="ingredient-4-description"
          placeholder="Description"
        />
      </div>
      <div class="ingredient ingredient-5">
        <label>Ingredient 5</label>
        <input
          value=""
          type="number"
          min="0.1"
          step="0.1"
          name="ingredient-5-quantity"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z ]*"
          name="ingredient-5-unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z %,.]*"
          name="ingredient-5-description"
          placeholder="Description"
        />
      </div>
      <div class="ingredient ingredient-6">
        <label>Ingredient 6</label>
        <input
          value=""
          type="number"
          min="0.1"
          step="0.1"
          name="ingredient-6-quantity"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z ]*"
          name="ingredient-6-unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          pattern="[a-zA-Z %,.]*"
          name="ingredient-6-description"
          placeholder="Description"
        />
      </div>
        </div>

        <div class="more__ingredients">
          <h2>Need more ingredients ?</h2>
          <span class="add__ing">+</span>
          <span class="remove__ing">-</span>
        </div>
      </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>`;
  }
}

export default new AddRecipeView();

//new FormData(tu wstawiamy element z form)

import View from './View.js';
import icons from '../../img/icons.svg'; //parcel 1 //tez dzuala

class PreviewView extends View {
  _parentElement = document.querySelector('.search-results');

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    // console.log(this._data);
    return `
         <li class="preview" ${
           this._data.verifyNumb ? `id="${this._data.verifyNumb}"` : ''
         }>
            <a class="preview__link ${
              this._data.id === id ? 'preview__link--active' : ''
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                <div class="preview__user-generated ${
                  this._data.key ? '' : 'hidden'
                }">
                <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
          <span class="preview__delete__meal ${
            this._data.day ? '' : 'hidden2'
          }">❌</span>
            </a>
          </li>`;
  }

  addHandlerSort(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target;
      if (!btn.classList.contains('sort__btn')) return;
      const { sortBy } = btn.dataset;
      const { maxMin } = btn.dataset;
      // console.log(btn.dataset);
      handler(sortBy, maxMin);
    });
  }
}

export default new PreviewView();

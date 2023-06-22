import View from './View.js';
import icons from '../../img/icons.svg'; //parcel 1 //tez dzuala
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find nice recipe and bookmark';
  _deleteAll = document.querySelector('.bookmarks__clear');
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  addHandlerDeleteAllBookmarks(handler) {
    this._deleteAll.addEventListener('click', e => {
      // this._parentElement.innerHTML = '';
      handler();
    });
  }
}

export default new BookmarksView();

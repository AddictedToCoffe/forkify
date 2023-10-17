import View from './View.js';
import icons from '../../img/icons.svg'; //parcel 1 //tez dzuala
import previewView from './previewView.js';
import recipeView from './recipeView.js';

class CalendarView extends View {
  _parentElement = document.querySelector('.meals');
  _calendar = document.querySelector('.daily-meals');
  _currentDate = document.querySelector('.current-date');
  _daysTag = document.querySelector('.days');
  _prevNextIcon = document.querySelectorAll('.icons span');
  _calendarButton = document.querySelector('.nav__btn--calendar');
  _overlay = document.querySelector('.overlay');
  _deleteAll = document.querySelector('.clear-meals');
  _days = this._daysTag.getElementsByTagName('li');
  _message = '';
  _errorMessage =
    'No planned meals on this day. Find nice recipe and add to chosen day';

  _date = new Date();
  _currYear = this._date.getFullYear();
  _currMonth = this._date.getMonth();
  //prettier-ignore
  _months = ['January','February','March','April','May','June','July','August',
            'September','October','Novemver','December',];
  // _handlerF = '';

  constructor() {
    super();
    this._renderCalendar();
    this._addButtonsHandler();
    this._addHandlerCloseCalender();
    this._addClickedDayHandler();
  }

  // addHandlerRender(handler) {
  //   window.addEventListener('load', () => {
  //     this._daysTag.addEventListener('click', e =>
  //       this._handlerToCalendarDays(e, handler)
  //     );
  //   });
  // }

  _renderCalendar() {
    //prettier-ignore
    const firstDayOfMonth = new Date(this._currYear,this._currMonth,1).getDay(); // Nr pierwszego dnia biezacego miesiaca 0-6

    const lastDateOfMonth = new Date(
      this._currYear,
      this._currMonth + 1,
      0
    ).getDate(); //ostatni dzien biezacego miesiaca,0

    const lastDayOfMonth = new Date(
      this._currYear,
      this._currMonth,
      lastDateOfMonth
    ).getDay(); // Nr ostatniego dnia biezacego miesiaca 0-6

    const lastDateOfLastMonth = new Date(
      this._currYear,
      this._currMonth,
      0
    ).getDate(); //Ostatni dzien poprzedniego miesiaca

    let liTag = '';
    let x;

    // Generowanie kalendarza
    for (let i = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateOfLastMonth + 1 - i}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday =
        i === new Date().getDate() &&
        this._currMonth === new Date().getMonth() &&
        this._currYear === new Date().getFullYear()
          ? 'active'
          : '';
      liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth + 1; i <= 7; i++) {
      x = i - lastDayOfMonth;
      liTag += `<li class="inactive">${i - lastDayOfMonth}</li>`;
    }

    this._currentDate.textContent = `${this._months[this._currMonth]} ${
      this._currYear
    }`;
    this._daysTag.innerHTML = liTag;

    //Generowanie dodatkowych 7 pol jezeli kalendarz ma 35 pol zamiast 42
    const numberOfDays = this._daysTag.children.length;
    if (numberOfDays < 42) {
      for (let i = x; i < x + 7; i++) {
        liTag += `<li class="inactive">${x + i - 1}</li>`;
      }
      this._daysTag.innerHTML = liTag;
    }
  }

  _addButtonsHandler() {
    this._prevNextIcon.forEach(icon =>
      icon.addEventListener('click', () => {
        this._currMonth =
          icon.id === 'prev' ? this._currMonth - 1 : this._currMonth + 1;

        if (this._currMonth < 0 || this._currMonth > 11) {
          this._date = new Date(this._currYear, this._currMonth);
          this._currYear = this._date.getFullYear();
          this._currMonth = this._date.getMonth();
        }
        this._renderCalendar();
        this.renderMessage('Choose day');
      })
    );
  }

  _addClickedDayHandler() {
    this._daysTag.addEventListener('click', e => {
      if (e.target.classList.contains('inactive') || !e.target.closest('li'))
        return;
      [...this._days].forEach(el => el.classList.remove('clicked'));
      const clickedDay = e.target.closest('li');
      clickedDay.classList.add('clicked');
    });
  }

  _closeCalender() {
    this._overlay.classList.add('hidden');
    this._calendar.classList.add('hidden');
  }

  _openCalender() {
    this._date = new Date();
    this._currYear = this._date.getFullYear();
    this._currMonth = this._date.getMonth();
    this._renderCalendar();
    this._overlay.classList.remove('hidden');
    this._calendar.classList.remove('hidden');
  }

  addHandlerOpenCalendar(handler) {
    this._daysTag.addEventListener('click', e =>
      this._handlerToCalendarDays(e, handler)
    );
    this._calendarButton.addEventListener('click', () => {
      this._openCalender();
      handler(this._date.getDate(), this._currMonth, this._currYear);
    });
  }

  _addHandlerCloseCalender() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this._calendar.classList.contains('hidden'))
        this._closeCalender();
    });

    this._overlay.addEventListener('click', () => {
      this._closeCalender();
    });
  }

  _generateMarkup() {
    return this._data.map(meal => previewView.render(meal, false)).join('');
  }

  _recipeAddMealButtonHandler(handler) {
    this._openCalender();
    handler(this._date.getDate(), this._currMonth, this._currYear, false);
    // const verifyNumb = Date.parse(new Date());
    // console.log(verifyNumb);

    const addHandler = e => {
      this._handlerToCalendarDays(e, handler);
    };

    this._daysTag.addEventListener('click', addHandler);

    document.addEventListener('keydown', () => {
      this._daysTag.removeEventListener('click', addHandler);
    });

    this._overlay.addEventListener('click', () => {
      this._daysTag.removeEventListener('click', addHandler);
    });
  }

  addHandlerDeleteMeal(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.preview__delete__meal');
      if (!btn) return;
      const meal = btn.closest('li');
      const verifyNumb = meal.id;
      // console.log(meal);
      // console.log(verifyNumb);
      handler(verifyNumb);
      meal.remove();
    });
  }

  addHandlerDeleteAllMeals(handler) {
    this._deleteAll.addEventListener('click', e => {
      // this._parentElement.innerHTML = '';
      handler();
    });
  }

  _handlerToCalendarDays = (e, handler) => {
    if (e.target.classList.contains('inactive') || +e.target.textContent > 31)
      return;
    const currentDay = +e.target.textContent;
    const currentMonth = this._currMonth;
    const currentYear = this._currYear;
    // const x = verifyNumb ? verifyNumb : '';
    handler(currentDay, currentMonth, currentYear);
  };
}

export default new CalendarView();

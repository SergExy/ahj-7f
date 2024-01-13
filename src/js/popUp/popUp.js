import './css/popUp.css';

import createElement from '../createElement/createElement';

export default class PopUp {
  constructor(title, element, callback) {
    this.title = title;
    this.element = element;
    this.callback = callback;
    this.create();
  }

  create() {
    this.popUpEl = createElement({
      name: 'div',
      classes: ['popUp'],
    });

    const popUpHeaderEl = createElement({
      name: 'div',
      classes: ['popUp__header'],
    });
    const popUpTitleEl = createElement({
      name: 'div',
      classes: ['popUp__title'],
      text: this.title,
    });
    popUpHeaderEl.appendChild(popUpTitleEl);

    this.popUpEl.appendChild(popUpHeaderEl);

    const popUpContentEl = createElement({
      name: 'div',
      classes: ['popUp__content'],
    });
    popUpContentEl.appendChild(this.element);
    this.popUpEl.appendChild(popUpContentEl);

    const popUpFooter = createElement({
      name: 'div',
      classes: ['popUp__footer'],
    });

    const yesBtnEl = createElement({
      name: 'div',
      classes: ['popUp__btn', 'popUp__btn_ok'],
      text: 'Ok',
    });
    yesBtnEl.onclick = this.callback;

    const noBtnEl = createElement({
      name: 'div',
      classes: ['popUp__btn', 'popUp__btn_cancel'],
      text: 'Отмена',
    });
    noBtnEl.onclick = () => {
      this.remove();
    };

    popUpFooter.appendChild(yesBtnEl);
    popUpFooter.appendChild(noBtnEl);
    this.popUpEl.appendChild(popUpFooter);
  }

  bindToDOM() {
    const body = document.querySelector('body');
    body.appendChild(this.popUpEl);
  }

  remove() {
    this.popUpEl.remove();
  }
}

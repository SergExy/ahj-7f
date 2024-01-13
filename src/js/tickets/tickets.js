import './css/tickets.css';

import App from '../app';
import createElement from '../createElement/createElement';
import PopUp from '../popUp/popUp';
import * as requestApi from '../requestApi/requestApi';
import TicketCard from '../ticketCard/ticketCard';

export default class Tickets {
  constructor(parent) {
    if (typeof (parent) === 'string') {
      this.parent = document.querySelector(parent);
    } else {
      this.parent = parent;
    }
    this.createEl();
    this.update();
  }

  async getTickets() {
    const ticketsColl = await requestApi.getData('?method=allTickets');

    this.ticketsColl = ticketsColl;
  }

  bindTickets() {
    const ticketsListEl = this.ticketsEl.querySelector('.tickets__list');

    if (this.ticketsColl.error) {
      ticketsListEl.textContent = 'Нет доступных тикетов';
      return;
    }

    ticketsListEl.textContent = '';

    this.ticketsColl.forEach((ticketData) => {
      const ticketCard = new TicketCard(ticketsListEl, ticketData);
      ticketCard.bindToDOM();
    });
  }

  async update() {
    await this.getTickets();
    this.bindTickets();
  }

  createEl() {
    this.ticketsEl = createElement({
      name: 'div',
      classes: ['tickets'],
    });
    const ticketsHeaderEl = createElement({
      name: 'div',
      classes: ['tickets__header'],
    });
    const ticketsAddBtnEl = createElement({
      name: 'div',
      classes: ['tickets__btn'],
      text: 'Добавить тикет',
    });
    ticketsAddBtnEl.onclick = async () => {
      const title = 'Добавить тикет';
      this.addFormEl = createElement({
        name: 'form',
        classes: ['form'],
      });
      const nameWrapEl = createElement({
        name: 'div',
        classes: ['wrapper'],
      });
      const nameTitleEl = createElement({
        name: 'div',
        classes: ['fieldTitle'],
        text: 'Краткое описание',
      });
      nameWrapEl.appendChild(nameTitleEl);
      const nameInput = createElement({
        name: 'input',
        classes: ['input'],
        attributes: [{ name: 'name', value: 'name' }],
      });
      nameWrapEl.appendChild(nameInput);
      this.addFormEl.appendChild(nameWrapEl);

      const descWrapEl = createElement({
        name: 'div',
        classes: ['wrapper'],
      });
      const descrTitleEl = createElement({
        name: 'div',
        classes: ['fieldTitle'],
        text: 'Подробное описание',
      });
      descWrapEl.appendChild(descrTitleEl);
      const descriptionTextarea = createElement({
        name: 'textarea',
        classes: ['textarea'],
        attributes: [{ name: 'name', value: 'description' }],
      });
      descWrapEl.appendChild(descriptionTextarea);
      this.addFormEl.appendChild(descWrapEl);

      this.popUp = new PopUp(title, this.addFormEl, this.onAddTicket);
      this.popUp.bindToDOM();
    };
    ticketsHeaderEl.appendChild(ticketsAddBtnEl);

    this.ticketsEl.appendChild(ticketsHeaderEl);

    const ticketsListEl = createElement({
      name: 'div',
      classes: ['tickets__list'],
    });
    this.ticketsEl.appendChild(ticketsListEl);
  }

  onAddTicket = async () => {
    const data = new FormData(this.addFormEl);
    await requestApi.postData('?method=createTicket', data);

    this.popUp.remove();
    App.updateTickets();
  };

  bindToDOM() {
    this.parent.appendChild(this.ticketsEl);
  }
}

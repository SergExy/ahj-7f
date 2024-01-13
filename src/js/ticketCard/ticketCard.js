import './css/ticketCard.css';

import App from '../app';
import createElement from '../createElement/createElement';
import * as requestApi from '../requestApi/requestApi';
import formatDate from '../formatDate/formatDate';
import PopUp from '../popUp/popUp';

export default class TicketCard {
  constructor(parent, data) {
    if (typeof (parent) === 'string') {
      this.parent = document.querySelector(parent);
    } else {
      this.parent = parent;
    }
    this.data = data;
    this.create();
  }

  create() {
    this.ticketEl = createElement({
      name: 'div',
      classes: ['ticketCard'],
      attributes: [{ name: 'id', value: this.data.id }],
    });

    const statusClasses = ['ticketCard__status', 'ticketCard__btn'];
    const status = JSON.parse(this.data.status);

    if (status) statusClasses.push('ticketCard__status_checked');

    const ticketStatus = createElement({
      name: 'div',
      classes: statusClasses,
    });
    ticketStatus.onclick = async (e) => {
      e.stopPropagation();
      const data = new FormData();
      data.append('status', !status);

      await requestApi.postData(`?method=updateById&id=${this.data.id}`, data);
      App.updateTickets();
    };
    this.ticketEl.appendChild(ticketStatus);

    const ticketContent = createElement({
      name: 'div',
      classes: ['ticketCard__body'],
    });
    const ticketTitle = createElement({
      name: 'div',
      classes: ['ticketCard__title'],
      text: this.data.name,
    });
    ticketContent.appendChild(ticketTitle);
    this.ticketEl.appendChild(ticketContent);

    const ticketDate = createElement({
      name: 'div',
      classes: ['ticketCard__title'],
      text: formatDate(this.data.created),
    });
    this.ticketEl.appendChild(ticketDate);

    const ticketEdit = createElement({
      name: 'div',
      classes: ['ticketCard__edit', 'ticketCard__btn'],
    });
    ticketEdit.innerHTML = '&#9998';
    ticketEdit.onclick = async (e) => {
      e.stopPropagation();
      if (!this.fullData) await this.getFullData();

      const title = 'Изменить тикет';
      this.editFormEl = createElement({
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
      nameInput.value = this.fullData.name;
      nameWrapEl.appendChild(nameInput);
      this.editFormEl.appendChild(nameWrapEl);

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
      descriptionTextarea.value = this.fullData.description;
      descWrapEl.appendChild(descriptionTextarea);
      this.editFormEl.appendChild(descWrapEl);

      this.popUp = new PopUp(title, this.editFormEl, this.onEditTicket);
      this.popUp.bindToDOM();
    };
    this.ticketEl.appendChild(ticketEdit);

    const ticketDelete = createElement({
      name: 'div',
      classes: ['ticketCard__delete', 'ticketCard__btn'],
    });
    ticketDelete.innerHTML = '&#10006';
    ticketDelete.onclick = (e) => {
      e.stopPropagation();
      const title = 'Удалить тикет?';
      const message = createElement({
        name: 'div',
        text: 'Вы уверены, что хотите удалить тикет? Это действие необратимо.',
      });

      this.popUp = new PopUp(title, message, this.onDeleteTicket);
      this.popUp.bindToDOM();
    };

    this.ticketEl.onclick = async () => {
      const currentDescr = this.ticketEl.querySelector('.ticketCard__descr');
      if (currentDescr) {
        currentDescr.remove();
        return;
      }
      if (!(this.fullData)) await this.getFullData();

      const ticketDescrEl = createElement({
        name: 'div',
        classes: ['ticketCard__descr'],
        text: this.fullData.description,
      });
      ticketContent.appendChild(ticketDescrEl);
    };
    this.ticketEl.appendChild(ticketDelete);
  }

  getFullData = async () => {
    this.fullData = await requestApi.getData(`?method=ticketById&id=${this.data.id}`);
  };

  onEditTicket = async () => {
    const data = new FormData(this.editFormEl);
    await requestApi.postData(`?method=updateById&id=${this.data.id}`, data);
    this.popUp.remove();
    App.updateTickets();
  };

  onDeleteTicket = async () => {
    await requestApi.getData(`?method=deleteById&id=${this.data.id}`);
    this.popUp.remove();
    App.updateTickets();
  };

  bindToDOM() {
    this.parent.appendChild(this.ticketEl);
  }
}

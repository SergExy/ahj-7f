import createElement from './createElement/createElement';
import Tickets from './tickets/tickets';

export default class App {
  static init() {
    this.app = createElement({
      name: 'div',
      classes: ['app'],
    });
    document.querySelector('body').appendChild(this.app);

    this.initTickets();
  }

  static initTickets() {
    this.tickets = new Tickets(this.app);
    this.tickets.bindToDOM();
  }

  static updateTickets() {
    this.tickets.update();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  App.init();
});

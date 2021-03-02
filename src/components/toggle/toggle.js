import events from '../../lib/events-emitter';

export default class Toggle {
    constructor(selector) {
        this.toggle = document.querySelector(selector);
        this.body = document.querySelector('body');
        this.toggleChecked = this.toggle.getAttribute("aria-checked");
        this.toggle.addEventListener('click', (evt) => {
            this.clickToggle(evt.target);
        });
    }

    clickToggle(el) {
        this.toggleChecked = !this.toggleChecked;
        el.setAttribute("aria-checked", this.toggleChecked);
        console.log('DISCO MODE', this.toggleChecked);
        this.body.style.backgroundColor = this.toggleChecked ? '#fda128' : '#fff';
    }
}
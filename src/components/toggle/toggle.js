import events from '../../lib/events-emitter';

export default class Toggle {
    constructor(selector) {
        this.toggle = document.querySelector(selector);
        this.discoLayer = document.querySelector('.disco-underlay');
        this.toggleChecked = false;
        console.log('this.toggleChecked', this.toggleChecked);
        this.toggle.addEventListener('click', (evt) => {
            this.clickToggle(evt.target);
        });
    }

    clickToggle(el) {
        console.log('check', !this.toggleChecked, this.toggleChecked), true, !true;
        this.toggleChecked = !this.toggleChecked;
        el.setAttribute("aria-checked", this.toggleChecked);
        console.log('DISCO MODE', this.toggleChecked);
        this.toggleChecked ? this.discoLayer.classList.add('show') : this.discoLayer.classList.remove('show');
        events.emit('disco mode', this.toggleChecked);
    }
}
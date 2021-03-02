import events from '../lib/events-emitter';
import svgs from '../assets/svgs.json';

export default class DiscoMode {
    constructor() {
        this.discoModeEnabled = false;

        this.foodImageEl = document.querySelector('.food-image');

        events.on('disco mode', (discoModeEnabled) => {
            this.discoModeEnabled = discoModeEnabled;
            console.log('discoModeEnabled', discoModeEnabled);
            this.discoModeEnabled ? this.enable() : this.disable();
        })
    }

    enable() {
        this.foodImage = this.foodImageEl.innerHTML;
        this.foodImageEl.innerHTML = svgs.aubergine;
        this.foodImageEl.classList.add('disco');
    }

    disable() {
        console.log('this.foodImage', this.foodImage);
        this.foodImageEl.innerHTML = this.foodImage;
        this.foodImageEl.classList.remove('disco');
    }
}
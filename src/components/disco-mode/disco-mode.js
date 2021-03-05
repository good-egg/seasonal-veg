import events from '../../lib/events-emitter';
import svgs from '../../assets/svgs.json';

export default class DiscoMode {
    constructor() {
        this.discoModeEnabled = false;
        this.foodImageEl = document.querySelector('.food-image');
        this.discoFood = document.querySelector('.food-image--disco-mode');
        this.foodSelected = 'aubergine';

        events.on('disco mode', (discoModeEnabled) => {
            this.discoModeEnabled = discoModeEnabled;
            console.log('discoModeEnabled', discoModeEnabled);
            this.discoModeEnabled ? this.enable() : this.disable();
        });

        events.on('food-selected', ({ food }) => {
            this.foodSelected = food;
        });
    }

    enable() {
        this.foodImageEl.classList.add('hide');
        this.discoFood.innerHTML = svgs[this.foodSelected];
        this.discoFood.classList.remove('hide');
        // this.foodImageEl.classList.add('disco');
    }

    disable() {
        console.log('this.foodImage', this.foodImage);
        this.foodImageEl.classList.remove('hide');
        this.discoFood.classList.add('hide');
    }
}
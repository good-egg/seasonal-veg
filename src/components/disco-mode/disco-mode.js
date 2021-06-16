import events from '../../lib/events-emitter';
import svgs from '../../assets/svgs.json';

export default class DiscoMode {
    constructor() {
        this.discoModeEnabled = false;
        this.foodImageEl = document.querySelector('.food-image');
        this.disco = document.querySelector('.food-image--disco-mode');
        this.discoFood = this.disco.querySelector('.food-container');
        this.interactiveContainer = document.querySelector('.seasonal-veg--container');
        this.foodSelected = 'aubergine';

        events.on('disco mode', (discoModeEnabled) => {
            this.discoModeEnabled = discoModeEnabled;
            console.log('discoModeEnabled', discoModeEnabled);
            this.discoModeEnabled ? this.enable() : this.disable();
        });

        events.on('food-selected', ({ food }) => {
            this.foodSelected = svgs[food] ? food : 'aubergine';
        });
    }

    enable() {
        this.foodImageEl.classList.add('hide');
        this.discoFood.innerHTML = svgs[this.foodSelected];
        this.disco.classList.remove('hide');
        this.interactiveContainer.classList.add('disco-mode');
    }

    disable() {
        console.log('this.foodImage', this.foodImage);
        this.foodImageEl.classList.remove('hide');
        this.disco.classList.add('hide');
        this.interactiveContainer.classList.remove('disco-mode');
    }
}
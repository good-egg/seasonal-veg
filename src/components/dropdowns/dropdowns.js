import data from '../../assets/data/data.min';
import events from '../../lib/events-emitter';

export default class Dropdowns {
    constructor() {
        this.resultsContainer = document.querySelector('.results-container');
        this.monthDropdown = document.querySelector('.dropdown-container--months');
        this.foodDropdown = document.querySelector('.dropdown-container--food');
        this.foodIDs = Object.keys(data);
        this.init();

        this.monthDropdown.addEventListener('change', (evt) => {
            this.monthSelected = evt.target.value;
            this.populateFoodDropdown();
        });
        this.foodDropdown.addEventListener('change', (evt) => {
            const index = evt.target.selectedIndex;
            this.foodSelected = evt.target.value;
            events.emit('food-selected', { food: this.foodSelected, index });
            this.resultsContainer.style.display = 'block';
        });
    }

    init() {
        this.monthSelected = 'all';
        this.populateFoodDropdown();
    }

    populateFoodDropdown() {
        const foodSelect = document.querySelector('#food-select');
        let markuptoOutput = '<option value="" selected="selected" disabled hidden=true>--Please choose an option--</option>';
        this.foodIDs.forEach((id, i) => {
            const foodType = data[id]['food-type'];
            const previousFoodType = i > 0 ? data[[this.foodIDs[i - 1]]]['food-type'] : foodType;
            if (i === 0 || foodType !== previousFoodType) markuptoOutput += `<option value="category-${foodType}" disabled>${foodType.charAt(0).toUpperCase() + foodType.slice(1)}</option>`;

            if ((this.monthSelected !== 'all' && data[id][this.monthSelected] !== 0) || this.monthSelected === 'all') {
                markuptoOutput += `<option value="${id}">${data[id].food}</option>`;
            }
        });
        foodSelect.innerHTML = markuptoOutput;
    }
}

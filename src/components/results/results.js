import events from '../../lib/events-emitter';
import data from '../../assets/data/data.min';

export default class Results {
    constructor() {
        this.resultsContainer = document.querySelector('.results-container');
        this.calendarTable = document.querySelector('.season-calendar--table');
        this.imageContainer = document.querySelector('.image-container');
        this.selectedImage = this.imageContainer.querySelector('.food-image');

        this.foodDropdown = document.querySelector('.dropdown-container--food');
        const nextFoodBtn = document.querySelector('.next-food');
        nextFoodBtn.addEventListener('click', () => {
            console.log('click next');
            this.availableFoods = Array.from(this.foodDropdown.querySelectorAll('option'));
            if (this.foodSelectedIndex < this.availableFoods.length - 1) this.changeFood(true);
        });
        const previousFoodBtn = document.querySelector('.previous-food');
        previousFoodBtn.addEventListener('click', () => {
            console.log('click previous');
            this.availableFoods = Array.from(this.foodDropdown.querySelectorAll('option'));
            if (this.foodSelectedIndex > 1) this.changeFood(false);
        });

        this.colours = {
            season: '#067253',
            available: '#06BF8E',
            'from-store': '#AAD6C4',
            none: '#fff',
        };

        this.monthSelected = 'all';

        events.on('month-selected', (month) => {
            this.monthSelected = month;
            console.log('month selected', this.monthSelected);
        });

        events.on('food-selected', ({ food, index }) => {
            this.foodSelected = food;
            this.foodSelectedIndex = index;
            if (document.querySelector('.season-calendar--highlight-circle:not(.hide)')) document.querySelector('.season-calendar--highlight-circle:not(.hide)').classList.add('hide');
            this.populateResults();
        });
    }

    populateResults() {
        const foodData = data[this.foodSelected];
        this.selectedImage.src = `./assets/img/${this.foodSelected}.svg`;
        const seasonCircles = document.querySelectorAll('.season-calendar--table_icon');
        const foodSeasonality = Object.entries(foodData).filter(([key, value]) => !key.includes('food'));
        foodSeasonality.forEach(([month, value], i) => {
            const season = value !== 0 ? value : 'none';
            seasonCircles[i].querySelector('circle').setAttribute('fill', this.colours[season]);
            if (month === this.monthSelected) document.querySelector(`.key-el--${value} .season-calendar--highlight-circle`).classList.remove('hide');
        });
    }

    changeFood(next) {
        console.log('update food!');
        this.foodSelectedIndex = next ? this.foodSelectedIndex + 1 : this.foodSelectedIndex - 1;
        // check if previous/next option is a category -> if so, jump another index (unless at the end)

        const newFoodOption = this.availableFoods[this.foodSelectedIndex];
        console.log('new food opt', newFoodOption);
        newFoodOption.selected = true;
        const foodSelected = newFoodOption.value;
        events.emit('food-selected', { food: foodSelected, index: this.foodSelectedIndex });
        // const foodDropdown = document.querySelector(`option[value='${food}']`);
        // foodDropdown.selected = true;
    }
}

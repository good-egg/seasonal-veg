import events from '../../lib/events-emitter';
import data from '../../assets/data/data.min';
import * as utils from '../../utils';
import config from '../../config';

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
        this.seasonCalendarCTA = document.querySelector('.season-calendar--cta');

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
        this.displaySeasonalityText();
        const seasonCircles = document.querySelectorAll('.season-calendar--table_icon');
        const foodSeasonality = Object.entries(foodData).filter(([key, value]) => !key.includes('food'));
        foodSeasonality.forEach(([month, value], i) => {
            const season = value !== 0 ? value : 'none';
            seasonCircles[i].querySelector('circle').setAttribute('fill', this.colours[season]);
            if (month === this.monthSelected) document.querySelector(`.key-el--${value} .season-calendar--highlight-circle`).classList.remove('hide');
        });
    }

    displaySeasonalityText() {
        const foodSelectedDisplay = this.getFoodDisplayName(this.foodSelected);
        const highlightFoodDisplay = this.formatHighlight(foodSelectedDisplay);
        const isOrAre = foodSelectedDisplay.charAt(foodSelectedDisplay.length - 1) === 's' ? 'are' : 'is'; // needs updating for foods with brackets
        this.seasonCalendarCTA.innerHTML = this.monthSelected === 'all' ? `Take a look below to see when ${highlightFoodDisplay} ${isOrAre} in season` : `In ${this.formatHighlight(config.months[this.monthSelected])}, ${highlightFoodDisplay} ${isOrAre}`;            
    }

    getFoodDisplayName(food) {
        return data[food]['food'];
    }

    formatHighlight(string) {
        return utils.createHighlightSpan(utils.capitalise(string));
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

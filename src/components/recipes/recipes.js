import events from '../../lib/events-emitter';
import data from '../../assets/data/data.min';
import recipeData from '../../assets/data/recipe-data';

export default class Recipes {
    constructor() {
        this.recipesContainer = document.querySelector('.recipes-container');
        this.recipeEls = this.recipesContainer.querySelectorAll('.recipe');
        this.currentRecipe = 0;
        this.attributes = ['title', 'author', 'course', 'prep', 'cook'];

        this.recipeCounterCurrent = document.querySelector('.recipe-counter__current');
        this.recipeCounterTotal = document.querySelector('.recipe-counter__total');

        const nextRecipeBtn = document.querySelector('.next-recipe');
        nextRecipeBtn.addEventListener('click', () => {
            console.log('click next');
            if (this.currentRecipe < 4) this.showRecipe(true);
        });
        const previousRecipeBtn = document.querySelector('.previous-recipe');
        previousRecipeBtn.addEventListener('click', () => {
            console.log('click previous');
            if (this.currentRecipe > 0) this.showRecipe(false);
        });

        events.on('food-selected', ({ food, index }) => {
            this.foodSelected = food;
            this.foodSelectedIndex = index;
            this.populateRecipes();
        });
    }

    updateFood(foodSelected) {
        this.food = foodSelected;
    }

    populateRecipes() {
        const recipes = recipeData[this.foodSelected];
        const totalRecipes = recipes.length;
        this.recipeCounterTotal.innerText = totalRecipes;
        this.recipeCounterCurrent.innerText = 1;
        recipes.forEach((recipe, i) => {
            const recipeEl = this.recipeEls[i];
            recipeEl.querySelector('.recipe--link').href = recipe.link;
            recipeEl.querySelector('.recipe--image').src = `./assets/img/generated-images/${this.foodSelected}.png`;
            this.attributes.forEach(attribute => {
                if (recipe[attribute]) recipeEl.querySelector(`.recipe--${attribute}`).innerText = recipe[attribute];
            });
            if (i === 0) recipeEl.classList.remove('hide');
        });
    }

    showRecipe(next) {
        console.log('called show recipe');
        this.currentRecipe = next ? this.currentRecipe + 1 : this.currentRecipe - 1;
        this.recipeCounterCurrent.innerText = this.currentRecipe + 1;
        console.log('current', this.currentRecipe);
        this.recipeEls.forEach((el, i) => {
            el.classList.add('hide');
            if (i === this.currentRecipe) el.classList.remove('hide');
        });
    }
}

const puppeteer = require('puppeteer');
const fs = require('fs');
const dataset = require('../src/assets/data/data.min.json');

let browser;
const pageToScrape = 'https://www.bbc.co.uk/food/search';
const foodIds = Object.keys(dataset);
const foodsToSearch = Object.values(dataset).map(el => el['food-to-search']);

const data = {};

async function runTheScripts() {
    await scrapePages();
}

async function scrapePages() {
    browser = await puppeteer.launch({
        headless: true
    });
    page = await browser.newPage();
    await asyncForEach(foodsToSearch, searchForItem);
    const dataToOutput = JSON.stringify(data, null, 2);

    fs.writeFile(`${__dirname}/../src/assets/data/recipe-data-1.json`, dataToOutput, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    closeBrowser();
}

async function searchForItem(food, i) {
    await page.goto(`https://www.bbc.co.uk/food/search?q=${food}`);
    await page.waitForSelector(".searchbar__input");
    data[foodIds[i]] = {};
    data[foodIds[i]].all = [...await getRecipes()];
    console.log('got recipes', data[foodIds[i]].all);
    console.log('getting veggie recipes....');
    await page.goto(`https://www.bbc.co.uk/food/search?q=${food}&diets=vegetarian`);
    await page.waitForSelector(".searchbar__input");
    data[foodIds[i]].veg = [...await getRecipes()];
}

async function getRecipes() {
    const recipesToReturn = [];
    const recipesToAdd = await page.evaluate(() => {
        const recipes = [];
        if (document.querySelector('.promo-collection')) {
            const recipesContainer = document.querySelector('.promo-collection');
            let first5Recipes = Array.from(recipesContainer.querySelectorAll('.promo'));
            if (first5Recipes.length > 5) first5Recipes = first5Recipes.slice(0, 5);
            first5Recipes.forEach(recipe => {
                recipes.push({
                    link: recipe.href,
                    title: recipe.querySelector('.promo__title').innerText,
                    author: recipe.querySelector('.promo__subtitle') ? recipe.querySelector('.promo__subtitle').innerText : false,
                    mealType: recipe.querySelector('.promo__type__recipe-info').innerText,
                    prep: recipe.querySelector('.promo__recipe-info__prep-time').innerText,
                    cook: recipe.querySelector('.promo__recipe-info').lastElementChild.innerText,
                    serves: recipe.querySelector('.promo__recipe-info__serving-size')? recipe.querySelector('.promo__recipe-info__serving-size').innerText : false,
                    img: recipe.querySelector('img') ? recipe.querySelector('img').dataset.src : false
                });
            });
        }
        return recipes;
    })
    .catch(error => {
        console.log('The following error occurred: ' + error);
    });
    recipesToReturn.push(...recipesToAdd);
    return recipesToReturn;
}

async function closeBrowser() {
    await browser.close();
}

// UTILS
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

runTheScripts();

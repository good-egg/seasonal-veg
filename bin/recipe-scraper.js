const puppeteer = require('puppeteer');
const fs = require('fs');
const dataset = require('../source/app/assets/data/data.min.json');

let browser;
const pageToScrape = 'https://www.bbc.co.uk/food/search';
const foodIds = Object.keys(dataset);
const foodsToSearch = Object.values(dataset).map(el => el['food-to-search']);

const data = {};

async function runTheScripts() {
    await scrapePages();
}

async function scrapePages() {
    let webpage = await loadWebpage();
    await asyncForEach(foodsToSearch, searchForItem);
    const dataToOutput = JSON.stringify(data, null, 2);

    fs.writeFile(`${__dirname}/../source/app/assets/data/recipe-data.json`, dataToOutput, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    closeBrowser();
}

async function loadWebpage() {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto(pageToScrape);
    await page.waitForSelector(".searchbar__input");
    return page;
}

async function searchForItem(food, i) {
    console.log('searching for ', food, 'id', foodIds[i]);
    await page.focus('.searchbar__input');
    await page.click('.searchbar__input', {clickCount: 3}); // select all input field
    await page.keyboard.press('Backspace'); // delete contents
    await page.keyboard.type(food, { delay: 100 });
    await page.keyboard.press('Enter', { delay: 100 });
    await page.waitForSelector(".promo-collection")
        .catch(error => {
           console.log('The following error occurred: ' + error);
        });
    data[foodIds[i]] = [...await getRecipes()];
    console.log('got recipes');
}

async function getRecipes() {
    const recipesToReturn = [];
    const recipesToAdd = await page.evaluate(() => {
        const recipesContainer = document.querySelector('.promo-collection');
        let first5Recipes = Array.from(recipesContainer.querySelectorAll('.promo'));
        if (first5Recipes.length > 5) first5Recipes = first5Recipes.slice(0, 5);
        const recipes = [];
        first5Recipes.forEach(recipe => {
            recipes.push({
                link: recipe.href,
                title: recipe.querySelector('.promo__title').innerText,
                author: recipe.querySelector('.promo__subtitle') ? recipe.querySelector('.promo__subtitle').innerText : false,
                mealType: recipe.querySelector('.promo__type__recipe-info').innerText,
                prep: recipe.querySelector('.promo__recipe-info__prep-time').innerText,
                cook: recipe.querySelector('.promo__recipe-info').lastElementChild.innerText,
                serves: recipe.querySelector('.promo__recipe-info__serving-size')? recipe.querySelector('.promo__recipe-info__serving-size').innerText : false
            });
        });
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

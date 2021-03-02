import Dropdowns from './components/dropdowns/dropdowns';
import Results from './components/results/results';
import Recipes from './components/recipes/recipes';
import Toggle from './components/toggle/toggle';

new Dropdowns();
new Results();
new Recipes();
new Toggle('.switch--disco-toggle');

enhanceContent();

function enhanceContent() {
    console.log('Hello!');
}


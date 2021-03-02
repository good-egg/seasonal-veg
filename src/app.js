import Dropdowns from './components/dropdowns/dropdowns';
import Results from './components/results/results';
import Recipes from './components/recipes/recipes';
import Toggle from './components/toggle/toggle';
import DiscoMode from './components/disco-mode';

new Dropdowns();
new Results();
new Recipes();
new Toggle('.switch--disco-toggle');
new DiscoMode();

enhanceContent();

function enhanceContent() {
    console.log('Hello!');
}


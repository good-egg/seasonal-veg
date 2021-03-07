const config = require('../../src/config.json');

const getMonths = () => {
    return Object.keys(config.months)
};
module.exports = getMonths;
const config = require('../../src/config.json');

const lookupConf = (key, nestedKey) => {
    return nestedKey ? config[key][nestedKey] : config[key];
};
module.exports = lookupConf;
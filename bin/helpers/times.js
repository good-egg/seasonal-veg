const times = (n) => {
    // super hacky for prototyping purposes. dont use this.
    const output = [];
    for (let index = 0; index < n; index++) {
        output.push(index);
    }
    return output
};

module.exports = times;

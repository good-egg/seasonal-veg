const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const replaceDashWithSpace = (string) => {
    return string.replace(/-/g, ' ');
}

const createHighlightSpan = (string) => {
    return `<span class="highlight">${string}</span>`
}

export { capitalise, replaceDashWithSpace, createHighlightSpan };
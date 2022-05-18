function isNumeric(str) {
    if (/^[\d ]+$/.test(str)) {
        return true;
    } else {
        return false;
    }
}

function compareNumeric(a, b) {
    if (a > b) return 1;
    if (a == b) return 0;
    if (a < b) return -1;
}

module.exports = {
    isNumeric,
    compareNumeric,
}
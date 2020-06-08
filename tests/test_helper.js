module.exports = {
    randomArrayIndex,
    randomArraySubset
};

function randomInt(min, max) {
    return Math.trunc(Math.random() * (max - min)) + min;
}

function randomArrayIndex(arr) {
    return randomInt(0, arr.length);
}

function randomArraySubset(arr) {
    const start = randomArrayIndex(arr);
    const end = randomInt(start, arr.length);

    return arr.slice(start, end + 1);
}
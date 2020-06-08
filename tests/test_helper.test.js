const { randomArrayIndex, randomArraySubset } = require('./test_helper');

const testArray = [1, 2, 3, 4, 5];

describe('randomArrayIndex', () => {
    const result = randomArrayIndex(testArray);

    test('returns a positive whole number', () => {
        expect(typeof result).toBe('number');
        expect(Math.trunc(result)).toBe(result);
        expect(result >= 0).toBe(true);
    });

    test('returns a valid index', () => {
        expect(result < testArray.length).toBe(true);
    });
});

describe('randomArraySubSet', () => {
    const result = randomArraySubset(testArray);

    test('returns an array', () => {
        expect(Array.isArray(result)).toBe(true);
    });

    test('returns an array of values inside the original', () => {
        expect(result.every(i => testArray.includes(i))).toBe(true);
    });

    test('returns an array where the ordering occurs in the original one', () => {
        expect(testArray.some((_, i, arr) => {
            return result.every((element, j) => element === arr[i + j]);
        })).toBe(true);
    });
});
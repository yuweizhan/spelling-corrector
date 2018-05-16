const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";

let wordCount = {};
fs.readFile(path.join(`${__dirname}/../public/`, 'big.txt'), (err, data) => {
    if (err)
        throw err;

    wordCount = getWordCount(data.toString());
});

function getWordCount(str) {
    const words = str.match(/(\w+)/g);
    const wordCount = {};

    _.each(words, (word) => {
        if (word in wordCount)
            wordCount[word]++;
        else
            wordCount[word] = 1;
    });

    return wordCount;
}

exports.correct = (word) => {
    const candidates = getCandidates(word);
    if (candidates.length === 0 || (candidates.length === 1 && candidates[0] == word))
        return word;

    return _.max(candidates, (candidate) => {
        return wordCount[candidate];
    });
};

function getCandidates(word) {
    const knownWords = getKnownWords([word]);
    if (!_.isEmpty(knownWords))
        return knownWords;

    const knownWordsWithOneEdit = getKnownWords(oneEdit(word));
    if (!_.isEmpty(knownWordsWithOneEdit))
        return knownWordsWithOneEdit;

    const knowWordsWithTwoEdits = getKnownWords(twoEdits(word));
    if (!_.isEmpty(knowWordsWithTwoEdits))
        return knowWordsWithTwoEdits;

    return [word];
}

function getKnownWords(words) {
    return _.filter(words, (word) => {
        return word in wordCount;
    });
}

function oneEdit(word) {
    let result = [];

    result = result.concat(remove(word));
    result = result.concat(transpose(word));
    result = result.concat(alternate(word));
    result = result.concat(insert(word));

    return result;
}

function twoEdits(word) {
    const wordsWithOneEdit = oneEdit(word);
    let result = [];

    _.each(wordsWithOneEdit, (wordWithOneEdit) => {
        result = result.concat(oneEdit(wordWithOneEdit));
    });

    return result;
}

function remove(word) {
    const result = [];
    for (let i = 0; i < word.length; i++)
        result.push(word.substring(0, i) + word.substring(i + 1));

    return result;
}

function transpose(word) {
    const result = [];

    for (let i = 0; i < word.length - 1; i++) {
        const letters = word.split("");

        let temp = letters[i];
        letters[i] = letters[i + 1];
        letters[i + 1] = temp;

        result.push(letters.join(""));
    }

    return result;
}

function alternate(word) {
    const result = [];

    for (let i = 0; i < word.length; i++)
        for (let j = 0; j < LOWER_CASE_LETTERS.length; j++)
            result.push(word.substring(0, i) + LOWER_CASE_LETTERS.charAt(j) + word.substring(i + 1));

    return result;
}

function insert(word) {
    const result = [];

    for (let i = 0; i <= word.length; i++)
        for (let j = 0; j < LOWER_CASE_LETTERS.length; j++)
            result.push(word.substring(0, i) + LOWER_CASE_LETTERS.charAt(j) + word.substring(i));

    return result;
}
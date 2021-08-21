const {readFile, writeFile} = require('fs').promises;
const {join} = require('path');
const {orderBy} = require('lodash');

const inputPath = join(__dirname, './data/tim-ferris-1.txt');
const outputPath = join(__dirname, './out/tokens.json');
const threshold = 10;
const minLen = 3

const blacklist = [];

function isTokenAccepted(token) {
    return !blacklist.includes(token) && token.length >= minLen;
}

function extractMeaningfulTokens(tokens) {
    return Object.entries(tokens).reduce((prev, [key, value]) => {
        if (value > threshold) {
            prev.push({token: key, popularity: value})
        }
        return prev;
    }, []);
}

function buildResult(meaningfulTokens) {
    return orderBy(meaningfulTokens, ['popularity'], ['desc']);
}

function generateTokens(fileContent) {
    const tokensCount = {};
    fileContent.split(' ').forEach(rawToken => {
        const token = rawToken.toLowerCase().replace(/[,.\-;\r\n]/g, '');

        if (isTokenAccepted(token)) {
            if (tokensCount[token]) {
                tokensCount[token]++;
            } else {
                tokensCount[token] = 1;
            }
        }
    })
    return tokensCount
}

(async () => {

    const fileContent = await readFile(inputPath, { encoding: 'utf-8' });
    const tokens = generateTokens(fileContent);

    const meaningfulTokens = extractMeaningfulTokens(tokens);

    await writeFile(outputPath, JSON.stringify(buildResult(meaningfulTokens), null, 2), 'utf-8');

})();



const {readFile, writeFile} = require('fs').promises;
const {join} = require('path');
const {uniq} = require("lodash");

const inputPath = join(__dirname, './data/tim-ferris-1-it.txt');
const outputPath = join(__dirname, './out/nouns-1.json');

(async () => {
    const fileContent = await readFile(inputPath, { encoding: 'utf-8' });
    const normalizedText = fileContent.toLowerCase().replace(/,;:\+-\[]\(\)/g, '')
    const pattern = /\s(il|lo|gli|la|l'|un|una|dei|degli|le) \w+/g
    const results = uniq(normalizedText.match(pattern))

    await writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');
})();



const fs = require('fs'),
    charactersString = fs.readFileSync('./characters.json', "utf8"),
    characters = JSON.parse(charactersString);

const group = "aoeuinyxk/.['-]";

const chars = Object.keys(characters);

let toSort = [];

for(let i = 0; i < group.length; i++) {
    let char = group.charAt(i);
    toSort.push({char, freq: characters[char]});
}

toSort = toSort.sort((a, b) => {return b.freq - a.freq});

console.log(toSort);

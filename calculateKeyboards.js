const fs = require('fs'),
    charactersString = fs.readFileSync('./characters.json', "utf8"),
    characters = JSON.parse(charactersString);

const group = "aoeuinyxk/.['-]";
const opposite = oppositeGroup(group);
const chars = Object.keys(characters).join("");


let toSort = [];
let toSortOpposite = [];

for(let i = 0; i < group.length; i++) {
    let char = group.charAt(i);
    toSort.push({char, freq: characters[char]});
}

for(let i = 0; i < opposite.length; i++) {
    let char = opposite.charAt(i);
    toSortOpposite.push({char, freq: characters[char]})
}

toSort = toSort.sort((a, b) => {return b.freq - a.freq});

console.log(toSort);
toSortOpposite = toSortOpposite.sort((a, b) => {return b.freq - a.freq});

console.log(toSortOpposite);


function oppositeGroup(groupIn) {
    const chars = Object.keys(characters).join("");
    let opposite = chars + "";

    for(let i = 0; i < groupIn.length; i++) {
        opposite = opposite.replace(groupIn.charAt(i), "");
    }

    return opposite;
}
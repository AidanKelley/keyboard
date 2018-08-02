const fs = require('fs'),
    bigramsString = fs.readFileSync("./bigrams.json", "utf8"),
    bigrams = JSON.parse(bigramsString),
    chars = "abcdefghijklmnopqrstuvwxyz-=[];',./";

let totalCount = 0;

for(let i = 0; i < chars.length; i++) {
    for(let j = 0; j < chars.length; j++) {
        totalCount += bigrams[chars.charAt(i)][chars.charAt(j)];
    }
}

console.log(totalCount);
let bigramsRank = [];

for(let i = 0; i < chars.length; i++) {
    for(let j = 0; j < chars.length; j++) {
        bigrams[chars.charAt(i)][chars.charAt(j)] /= totalCount;
        bigramsRank.push({bigram: chars.charAt(i) + chars.charAt(j), fraction: bigrams[chars.charAt(i)][chars.charAt(j)]});
    }
}

bigramsRank.sort((a, b) => b.fraction - a.fraction);

for(let i = 0; i < 100; i++) {
    console.log(bigramsRank[i]);
}


// printBigrams();





function getToken(char) {
    if (('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z')) {
        return char.toLowerCase();
    }
    else {
        //todo:: Potential future change: Why do these have to remain the way they are?
        const specialChars = "-=[];',./";

        if(specialChars.indexOf(char) >= 0) {
            return char;
        }
        else {
            let rules = {
                '_':'-',
                '+':'=',
                '{':'[',
                '}':']',
                ':':';',
                '"':'\'',
                '<':',',
                '>':'.',
                '?':'/'
            };

            if(Object.prototype.hasOwnProperty.call(rules, char)) {
                return rules[char];
            }
            else {
                return "";
            }
        }

    }
}



function printBigrams() {
    let line = " ";

    for(let i = 0; i < chars.length; i++) {
        line += "\t\t" + chars.charAt(i);
    }
    console.log(line);

    for(let i = 0; i < chars.length; i++) {
        line = chars.charAt(i);
        for(let j = 0; j < chars.length; j++) {
            line += "\t" + bigrams[chars.charAt(i)][chars.charAt(j)];
        }
        console.log(line);
    }
}

function calculateBigramsForGroup(groupIn, bigrams) {

    let group = "";

    for(let i = 0; i < groupIn.length; i++) {
        group += getToken(groupIn.charAt(i));
    }

    let total = 0;

    for(let i = 0; i < group.length; i++) {
        for(let j = 0; j < group.length; j++) {
            total += bigrams[group.charAt(i)][group.charAt(j)];
        }
    }

    return total;
}

let qwertyLeft = "qwertasdfgzxcvb";
let qwertyRight = "yuiop[]-=hjkl;'nm,./";

let dvorakLeft = "',.pyaoeui;qjkx";
let dvorakRight = "fgcrl/=[]dhtns-bmwvz";

console.log(calculateBigramsForGroup(qwertyLeft, bigrams));
console.log(calculateBigramsForGroup(qwertyRight, bigrams));
console.log(calculateBigramsForGroup(dvorakLeft, bigrams));
console.log(calculateBigramsForGroup(dvorakRight, bigrams));

let group = dvorakLeft, opposite = dvorakRight, response;

for(let i = 0; i < 10; i++) {
    response = findSwitch(group, opposite);
    group = response.group;
    opposite = response.opposite;

    // console.log(cost(group, opposite));
}

function randomGroup(size) {
    let copy = chars + "", out = "";

    for(let i = 0; i < size; i++) {
        let index = Math.floor(Math.random() * copy.length);
        out += copy.charAt(index);

        copy = copy.substring(0, index) + copy.substring(index + 1);

    }

    return {group:out, opposite: copy};
}

function cost(group, opposite) {
    return calculateBigramsForGroup(group, bigrams) + calculateBigramsForGroup(opposite, bigrams);
}

function diff(group, opposite) {
    //estimates the change in cost if a letter switched to the other group

    let letters = {}, letter = "", cost = 0;

    for(let i = 0; i < group.length; i++) {
        letter = group.charAt(i);
        cost = 0;
        for(let j = 0; j < group.length; j++) {
            cost -= bigrams[letter][group.charAt(j)]
        }

        for(let j = 0; j < opposite.length; j++) {
            cost += bigrams[letter][opposite.charAt(j)]
        }

        letters[letter] = cost;
    }

    // console.log(letters);

    return letters;
}

function minChar(letters) {
    let keys = Object.keys(letters);
    let minLetter = keys[0], min = letters[minLetter];

    for(let i = 0; i < keys.length; i++) {
        let key = keys[i];

        if(letters[key] < min) {
            min = letters[key];
            minLetter = key;
        }
    }

    return minLetter;
}

function findSwitch(group, opposite) {
    let minGroup = minChar(diff(group, opposite)), minOpposite = minChar(diff(opposite, group));

    // console.log(minGroup + " <=> " + minOpposite);

    group = group.replace(minGroup, minOpposite);
    opposite = opposite.replace(minOpposite, minGroup);

    return {group, opposite};
}


let minGroup = "", minCost = 1;

for(let i = 0; i < 10000; i++) {
    let {group, opposite} = randomGroup(15);
    let oldCost = 1, newCost = 1;

    let count = 0;
    do {
        count ++;
        oldCost = newCost;

        let response = findSwitch(group, opposite);

        group = response.group;
        opposite = response.opposite;

        newCost = cost(group, opposite);
    } while(oldCost > newCost);

    // console.log(group + " " + newCost);

    let response = findSwitch(group, opposite);

    group = response.group;
    opposite = response.opposite;

    if(oldCost < minCost) {
        minCost = oldCost;
        minGroup = group;
    }
}

console.log(minGroup + " " + minCost);
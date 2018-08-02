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

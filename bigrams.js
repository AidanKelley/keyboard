const fs = require("fs"),
    readline = require("readline");
let bigrams = {};

const chars = "abcdefghijklmnopqrstuvwxyz-=[];',./";

let charsObject = {};



for(let i = 0; i < chars.length; i++) {
    charsObject[chars.charAt(i)] = 0;
}

for(let i = 0; i < chars.length; i++) {
    let char = chars.charAt(i);

    bigrams[char] = {};

    Object.assign(bigrams[char], charsObject);
}

let instream = fs.createReadStream('./source.txt');
let rl = readline.createInterface({input: instream, crlfDelay: Infinity});



let charCount = 0;
let lineCount = 0;
rl.on('line', line => {
    if(line.length >= 2) {
        let second = getToken(line.charAt(0)), first;

        for(let i = 1, l = line.length; i < l; i++) {
            first = second;
            second = getToken(line.charAt(i));

            if(first.length === 1 && second.length === 1) {
                bigrams[first][second] ++;
            }
        }
    }

    charCount += line.length + 1;
    lineCount ++;

    if(lineCount % 1000 === 0) {
        console.log("Processed " + lineCount + " lines and " + charCount + " characters");
    }

});

rl.on('close', () => {
    fs.writeFile("./bigrams.json", JSON.stringify(bigrams), (err) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("saved file");
        }
    })
});

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
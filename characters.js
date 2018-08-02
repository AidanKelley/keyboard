const fs = require("fs"),
    readline = require("readline");
let bigrams = {};

const chars = "abcdefghijklmnopqrstuvwxyz-=[];',./";

let charsCount= {};



for(let i = 0; i < chars.length; i++) {
    charsCount[chars.charAt(i)] = 0;
}


let instream = fs.createReadStream('./source.txt');
let rl = readline.createInterface({input: instream, crlfDelay: Infinity});



let charCount = 0;
let lineCount = 0;
rl.on('line', line => {
    for(let i = 0; i < line.length; i++) {
        let token = getToken(line.charAt(i));
        if(token.length === 1) {
            charsCount[token]++;
        }
    }

    charCount += line.length + 1;
    lineCount ++;

    if(lineCount % 1000 === 0) {
        console.log("Processed " + lineCount + " lines and " + charCount + " characters");
    }

});

rl.on('close', () => {
    fs.writeFileSync("./characters.json", JSON.stringify(charsCount));
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
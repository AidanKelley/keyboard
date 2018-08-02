const fs = require('fs');

let totalString = "";

let fileCount = 0;


//todo:: optimize https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node/43370201#43370201

function getDir(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let path = dir + "/" + file;
        let stats = fs.statSync(path);

        // console.log(stats);

        if(stats.isDirectory()) {
            console.log("dir: " + path);
            getDir(path);
        }
        else if(stats.isFile()) {
            totalString += path + fs.readFileSync(path, "utf8");
            // console.log(totalString);
            fileCount ++;

            if(fileCount % 10 === 0) {
                console.log(fileCount);
            }
        }


    });
}

getDir("../backend/node_modules");

fs.writeFileSync("./source.txt", totalString);
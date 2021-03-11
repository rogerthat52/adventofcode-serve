const path = require("path");
const request = require('request');
const http = require('http');
const fs = require('fs');
const { resolve } = require("path");

const session = require("./session.js");
async function downloadFile(year, day, inputFilePath){

    let file = fs.createWriteStream(inputFilePath);

    await new Promise((resolve, reject) => {
        let stream = request({
            /* Here you should specify the exact link to the file you are trying to download */
            uri: `https://adventofcode.com/${year}/day/${day}/input`,
            headers: {
                cookie: `session=${session.id}` }, // session id goes here
            /* GZIP true for most of the websites now, disable it if you don't need it */
            gzip: true
        })
        .pipe(file)
        .on('finish', () => {
            console.log(`Input ${year}/${day} had been downloaded`);
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
    .catch(error => {
        console.log(`Something happened: ${error}`);
    });
}

function mainPage(req, res){
    switch(req.url.extname) {
        case(".js"):
            res.writeHead(200, { 'content-type': 'text/javascript' })
            fs.createReadStream("main/main.js").pipe(res);
            break;
        case(".css"):
            res.writeHead(200, { 'content-type': 'text/css' })
            fs.createReadStream("shared/style.css").pipe(res);
            break;
        default:
            res.writeHead(200, { 'content-type': 'text/html' })
            fs.createReadStream("main/index.html").pipe(res);
    }
}

function invalidPage(req, res){
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream("shared/404.html").pipe(res);
}

async function solutionPage(req, res){
    var basename = path.basename(req.url);          // get date from url
    var specific = req.url.split('/');

    const year = specific[2];                       // split date into vars
    const day = specific[3];

    const folderPath = `solutions/${year}/${day}/`            // folder to look for

    const solutionFilePath = `${folderPath}solution.js`;    // get unique file paths
    const inputFilePath = `${folderPath}input.txt`;

    switch(basename) {                          // valid
        case("solution.js"):
            res.writeHead(200, { 'content-type': 'text/javascript' })
            fs.createReadStream(solutionFilePath).pipe(res);
            break;
        case("printsolution.js"):
            res.writeHead(200, { 'content-type': 'text/plain' })
            fs.createReadStream(solutionFilePath).pipe(res);
            break;
        case("adventlib.js"):
            res.writeHead(200, { 'content-type': 'text/javascript' })
            fs.createReadStream("shared/adventlib.js").pipe(res);
            break;
        case("input.txt"):
            console.log(inputFilePath);
            if(!fs.existsSync(inputFilePath)){                  // check if downloaded
                await downloadFile(year, day, inputFilePath);                        // if not, download
            }
            res.writeHead(200, { 'content-type': 'text/plain' })
            fs.createReadStream(inputFilePath).pipe(res);
            break;
        case("styles.css"):
            res.writeHead(200, { 'content-type': 'text/css' })
            fs.createReadStream("shared/styles.css").pipe(res);
            break;
        default:
            res.writeHead(200, { 'content-type': 'text/html' })
            fs.createReadStream("shared/solution.html").pipe(res);
    }
}


const server = http.createServer(async (req, res) => {
    try {
    if(req.url == "/adventofcode/") {               // we're home
        mainPage(req, res);
    } else if(path.extname(req.url) != "" || fs.existsSync(req.url.replace("/adventofcode/","solutions/")+"solution.js")){ // check if folder exists and has files
            solutionPage(req, res);
    } else { // 404
        invalidPage(req, res);
    } }
    catch {
        invalidPage(req, res);
    }
})
server.addListener;

server.listen(process.env.PORT || 3000);
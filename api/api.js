import {propellerize, nerdify, duncify, dimmadomify, makeCompatibility2characters, makeCompatibilityOther, makeProgress} from "./imageFusion.js";
import {getCodeFromName} from "./main.js";
import http from "http";
import fs from "fs";
import path from "path";

const hatDict = {
    "propeller" : propellerize,
    "nerd" : nerdify,
    "dunce" : duncify,
    "dimmadome": dimmadomify
}

async function addHat(body, res) {
    const resultPath = await hatDict[body.hat]({
        name : (body.name == "" != body.surname != "") ? body.name + " " + body.surname : "default",
        code : body.code
    })

    try {
        const file = await fs.promises.readFile(path.resolve(resultPath));
        res.writeHead(200, {"Content-Type" : "image/png"});
        res.end(file);
    } catch (err) {
        res.writeHead(404);
        res.end("An error occured : ", err.message);
    }
}

async function getCompatibility(body, res) {
    let resultPath = ""

    console.log("In get compativility")

    if (body.mode == "") {
        resultPath = await makeCompatibility2characters(body.thing1, body.thing2);
    } else if (body.mode == "-o") {
        resultPath = await makeCompatibilityOther(body.thing1, body.thing2);
    }

    try {
        const file = await fs.promises.readFile(path.resolve(resultPath));
        res.writeHead(200, {"Content-Type" : "image/png"});
        res.end(file);
    } catch (err) {
        res.writeHead(404);
        res.end("An error has occured : ", err.message)
    }

}

async function getProgress(body, res) {

    const resultPath = await makeProgress(body.fight, body.progress);

    try {
        const file = await fs.promises.readFile(path.resolve(resultPath));
        res.writeHead(200, {"Content-Type" : "image/png"});
        res.end(file);
    } catch (err) {
        res.writeHead(404);
        res.end("An error has occured : ", err.message)
    }

}

http.createServer((req, res) => {

    let body = [];

    if(req.url == '/hat') {

        req.on("data", chunk => {
            body.push(chunk);
        }).on("end", async () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);

            console.log("body : ", body);

            if(body.code != "") {
                console.log("code exits before")
                await addHat(body, res);
            } else if (body.name != "" && body.surname != "" && body.server != "") {
                body.code = await getCodeFromName(body.name, body.surname, body.server);
                console.log("code got : ", body);
                await addHat(body, res);
            } else {
                res.statusMessage = "Missing character code";
                res.writeHead(500, {"Content-Type" : "text/plain"});
                res.end();
            }
        
        });

    } else if (req.url == "/progress") {

        req.on("data", chunk => {
            body.push(chunk);
        }).on("end", async () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            console.log("body : ", body);
            await getProgress(body, res);
        });


    } else if (req.url == "/compatibility") {

        req.on("data", chunk => {
            body.push(chunk);
        }).on("end", async () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);

            console.log("body : ", body);

            if(body.thing1.name && body.thing1.surname && body.thing1.server) {

                body.thing1.code = await getCodeFromName(body.thing1.name, body.thing1.surname, body.thing1.server);
                console.log("Got code 1");

                if(body.mode == "") {
                    
                    if(body.thing2.name && body.thing2.surname && body.thing2.server) {
                        
                        body.thing2.code = await getCodeFromName(body.thing2.name, body.thing2.surname, body.thing2.server);
                        console.log("Got code 2");
                        await getCompatibility(body, res);

                    } else {
                        res.statusMessage = "Wrong mode selected";
                        res.writeHead(500, {"Content-Type" : "text/plain"});
                        res.end();
                    }

                } else if (body.mode == "-o") {
                    
                    await getCompatibility(body, res);

                } else {
                    res.statusMessage = "Wrong mode selected";
                    res.writeHead(500, {"Content-Type" : "text/plain"});
                    res.end();
                }


            } else {
                res.statusMessage = "Missing character info on the first character";
                res.writeHead(500, {"Content-Type" : "text/plain"});
                res.end();
            }
        
        });

    } else {
        res.writeHead(404, "Requested content not found");
        res.end();
    }

}).listen(3000);
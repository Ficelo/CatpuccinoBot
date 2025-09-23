import {propellerize, nerdify, duncify } from "./imageFusion.js";
import {getCodeFromName} from "./main.js";
import http from "http";
import fs from "fs";
import path from "path";

const hatDict = {
    "propeller" : propellerize,
    "nerd" : nerdify,
    "dunce" : duncify
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

    } else {
        res.writeHead(404, "Requested content not found");
        res.end();
    }

}).listen(3000);
import { getImageFromCode, addProppellerHat, propellerize } from "./imageFusion.js";
import http from "http";
import fs from "fs";
import path from "path";

http.createServer((req, res) => {

    let body = [];

    if(req.url == '/hat') {

        req.on("data", chunk => {
            body.push(chunk);
        }).on("end", async () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);

            if( body.code != "" || (body.name == "" != body.surname != "" && body.server != "")) {
                
                //TODO : implement getting the code from a name

                if(body.code != "") {
                    const resultPath = await propellerize({
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

                } else {
                    res.statusMessage = "Missing character code";
                    res.writeHead(500, {"Content-Type" : "text/plain"});
                    res.end();
                }

            } else {
                res.statusMessage = "Missing information";
                res.writeHead(500, {"Content-Type" : "text/plain"});
                res.end();
            }
        
        });

    } else {
        res.writeHead(404, "Requested content not found");
        res.end();
    }

}).listen(3000);
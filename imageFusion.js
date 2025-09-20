import puppeteer from "puppeteer";
import fs from "fs";
import https from "https";
import sharp from "sharp";

const ponker = {name : "Ponker Borgir", code : "38173609"}

export async function getImageFromCode(character) {

    const browser = await puppeteer.launch({headless : true});
    const page = await browser.newPage();

    await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${character.code}/`);
    await page.setViewport({width : 1080, height: 1024});

    await page.waitForSelector('.character-block__face', {timeout : 10000});

    const imageLink = await page.$eval('img.character-block__face', img => {
        return img.src
        }
    );

    https.get(imageLink, res => {
        const file = fs.createWriteStream(`./images/${character.name}.jpg`);
        res.pipe(file);
        file.on("finish", () => file.close());
    })

    await browser.close();
}

export async function addProppellerHat(imagePath) {
    
    const resultPath = imagePath.split(".").at(1) + ".png"
    
    await sharp("propeller.png")
    .resize({
        fit : sharp.fit.fill,
        width : 256,
        height : 192
    })
    .toBuffer({resolveWithObject : true})
    .then(({data, info}) => {
        sharp(imagePath)
            .extend(
                {
                    top : 64,
                    left : 0,
                    right: 0,
                    bottom : 0,
                    background : {r : 0, g : 0, b : 0, alpha : 0}
                }
            )
            .toFormat("png")
            .composite(
                [{
                    input : data,
                    top : 0,
                    left : 0
                }])
            .toFile("." + resultPath, function(err) {
                console.log("error : ", err)
            });
    })
    .catch(err => {
       console.log("error : ", err)
    })

    return "." + resultPath;

}

//addProppellerHat("ponker.jpg");

export async function propellerize(character = { name: "ponker", code : 38173609}) {
    await getImageFromCode(character)
    const resultPath = await addProppellerHat(`./images/${character.name}.jpg`)
    //await fs.promises.unlink(`./images/${character.name}.jpg`);
    return resultPath;
}
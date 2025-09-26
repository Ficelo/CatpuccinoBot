import puppeteer from "puppeteer";
import fs from "fs";
import https from "https";
import sharp from "sharp";

const ponker = {name : "Ponker Borgir", code : "38173609"}

export async function getImageFromCode(character) {

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled',
            '--start-maximized'
        ],
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/120.0.0.0 Safari/537.36'
    );

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
    
    const {data : hatBuffer} = await sharp("./hats/propeller.png")
    .resize({
        fit : sharp.fit.fill,
        width : 256,
        height : 192
    })
    .toBuffer({resolveWithObject : true})


    await sharp(imagePath)
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
                input : hatBuffer,
                top : 0,
                left : 0
            }])
        .toFile("." + resultPath);
  

    return "." + resultPath;

}

export async function addNerd(imagePath) {
    const resultPath = imagePath.split(".").at(1) + ".png"

    const {data : fingerBuffer} = await sharp("./hats/finger.png")
        .resize({
            fit : sharp.fit.fill,
            width : 128,
            height : 128
        })
        .toBuffer({resolveWithObject : true})

    const {data : glassesBuffer} = await sharp("./hats/nerd-glasses.png")
        .resize({
            fit: sharp.fit.fill,
            width : 192,
            height : 98
        })
        .toBuffer({resolveWithObject : true})

    await sharp(imagePath)
        .toFormat("png")
        .composite([
            {
                input : glassesBuffer,
                top : 98,
                left : 32
            },
            {
                input : fingerBuffer,
                top : 128,
                left: -32
            }
        ])
        .toFile("." + resultPath)


    return "." + resultPath;
}

export async function addDunce(imagePath) {

    const resultPath = imagePath.split(".").at(1) + ".png"

    const {data : hatBuffer} = await sharp("./hats/dunce.png")
    .resize({
        fit : sharp.fit.fill,
        width : 192,
        height : 228
    })
    .toBuffer({resolveWithObject : true})

    await sharp(imagePath)
        .extend(
            {
                top : 96,
                left : 0,
                right: 0,
                bottom : 0,
                background : {r : 0, g : 0, b : 0, alpha : 0}
            }
        )
        .toFormat("png")
        .composite(
            [{
                input : hatBuffer,
                top : 0,
                left : 32
            }])
        .toFile("." + resultPath);
  

    return "." + resultPath;

}

export async function addDimmadome(imagePath) {

    const resultPath = imagePath.split(".").at(1) + ".png";

    const {data : hatBuffer} = await sharp("./hats/dimmadome.png")
    .resize({
        fit: sharp.fit.fill,
        width: 256,
        height: 900
    })
    .toBuffer({resolveWithObject: true})

    await sharp(imagePath)
    .extend(
        {
            top: (900 - 160),
            left: 0,
            right: 0,
            bottom: 0,
            background: {r: 0, g: 0, b: 0, alpha: 0}
        }
    )
    .toFormat("png")
    .composite(
        [
            {
                input: hatBuffer,
                top: 0,
                left: 0
            }
        ]
    )
    .toFile("." + resultPath);

    return "." + resultPath;

}

export async function propellerize(character = { name: "ponker", code : 38173609}) {
    await getImageFromCode(character);
    const resultPath = await addProppellerHat(`./images/${character.name}.jpg`);
    return resultPath;
}

export async function nerdify(character) {
    await getImageFromCode(character);
    const resultPath = await addNerd(`./images/${character.name}.jpg`);
    return resultPath;
}

export async function duncify(character) {
    await getImageFromCode(character);
    const resultPath = await addDunce(`./images/${character.name}.jpg`);
    return resultPath;
}

export async function dimmadomify(character) {
    await getImageFromCode(character);
    const resultPath = await addDimmadome(`./images/${character.name}.jpg`);
    return resultPath;
}
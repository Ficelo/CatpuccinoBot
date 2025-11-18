import puppeteer from "puppeteer";
import fs from "fs";
import https from "https";
import sharp from "sharp";
import crypto from "crypto";
import fetch from "node-fetch";

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

    return `./images/${character.name}.jpg`;
}

async function getOtherImagePath(other) {
    const headers = {
        "User-Agent": "MyApp/1.0 (https://example.com; myemail@example.com)"
    };

    async function fetchImage(title) {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Failed to fetch page info: ${response.status}`);
        const data = await response.json();

        const pageId = Object.keys(data.query.pages)[0];
        if (data.query.pages[pageId].original?.source) {
            return data.query.pages[pageId].original.source;
        }
        return null;
    }

    let imageUrl = await fetchImage(other);

    if (!imageUrl) {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(other)}&limit=1&namespace=0&format=json`;
        const searchRes = await fetch(searchUrl, { headers });
        if (!searchRes.ok) throw new Error(`Search failed: ${searchRes.status}`);
        const searchData = await searchRes.json();
        const closestTitle = searchData[1][0];
        if (!closestTitle) throw new Error("No matching Wikipedia articles found");
        imageUrl = await fetchImage(closestTitle);
        if (!imageUrl) throw new Error("Closest article has no image");
        other = closestTitle;
    }

    const ext = imageUrl.split(".").at(-1);
    const filePath = `./images/${other}.${ext}`;

    const imageRes = await fetch(imageUrl, { headers });
    if (!imageRes.ok) throw new Error(`Failed to download image: ${imageRes.status}`);
    const buffer = await imageRes.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return filePath;
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

function getRandomPercent(image1Path, image2Path) {

    const combined = [image1Path, image2Path].sort().join("|");
    const hash = crypto.createHash("md5").update(combined).digest("hex");
    const num = parseInt(hash.slice(0, 8), 16);
    const percent = num % 101;
    return percent + "%";

}

export async function makeCompatibility(image1Path, image2Path) {

    const resultPath = "/compatibility" + ".png"

    const text = getRandomPercent(image1Path, image2Path);

    const textedSVG = Buffer.from(
        `<svg width="500" height="100">
            <text x="50%" y="50%" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">
                ${text}
            </text>
        </svg>`
    );

    const {data : char1Buffer} = await sharp(image1Path)
        .toFormat("png")
        .resize({
            fit : sharp.fit.fill,
            width : 256,
            height : 256
        })
        .toBuffer({resolveWithObject : true});

    const {data : char2Buffer} = await sharp(image2Path)
        .toFormat("png")
        .resize({
            fit : sharp.fit.fill,
            width : 256,
            height : 256
        })
        .toBuffer({resolveWithObject : true});

    const {data : heartBuffer} = await sharp("./hats/heart.png")
        .toFormat("png")
        .resize({
            fit : sharp.fit.fill,
            width : 256,
            height : 256
        })
        .toBuffer({resolveWithObject : true});
    
    await sharp("./bases/base 512.png")
        .toFormat("png")
        .composite([
            {
                input : char1Buffer,
                top : 0,
                left : 0
            },
            {
                input : char2Buffer,
                top : 0,
                left : 256
            },
            {
                input : heartBuffer,
                top : 0,
                left : 128
            },
            {
                input : textedSVG,
                gravity : "center"
            }
        ])
        .toFile("." + resultPath)

    return "." + resultPath;

}

export async function makeProgress(fight, progress) {
    const resultPath = "/progress.png"

    const titleSVG = Buffer.from(
        `<svg width="500" height="100" viewBox="0 0 500 100" >
            <text
                x="10"
                y="50"
                font-size="24"
                font-family="Arial"
                fill="white"
                dominant-baseline="middle"
            >
                ${fight}
            </text>
        </svg>`
    );

    const percentSVG = Buffer.from(
        `<svg width="380" height="32">
            <text x="50%" y="50%" font-family="Arial" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle">
                ${progress}%
            </text>
        </svg>`
    );

    const percentBarSVG = Buffer.from(
        `<svg width="${Math.round(progress * 4)}" height="100">
            <rect width="100%" height="100%" fill="#50C878" />
        </svg>`
    );

    const percentBarBackgroundSVG = Buffer.from(
        `<svg width="400" height="100">
            <rect width="100%" height="100%" fill="#6D8DD6" />
        </svg>`
    );

    const {data : frame} = await sharp("./bases/progress-frame.svg")
        .toFormat("png")
        .resize({
            fit : sharp.fit.fill,
            width : 500,
            height : 100
        })
        .toBuffer({resolveWithObject : true});

    const {data : ultimaBuffer} = await sharp("./hats/ultima.jpg")
        .toFormat("png")
        .resize({
            fit : sharp.fit.fill,
            width : 80,
            height : 80
        })
        .toBuffer({resolveWithObject : true});
    
    await sharp("./bases/base100x500.png")
        .toFormat("png")
        .composite([
            {
                input : ultimaBuffer,
                top: 10,
                left: 10
            },
            {
                input : percentBarSVG,
                top : 50,
                left: 102
            },
            {
                input: percentSVG,
                top: 50,
                left: 112
            },
            {
                input: frame,
                top: 0,
                left: 0
            },
            {
                input: titleSVG,
                top: -20,
                left: 92
            }
        ])
        .toFile("." + resultPath)

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

export async function makeCompatibility2characters(character1, character2) {

    // Change this it's kinda sus

    const image1Path = await getImageFromCode(character1);
    console.log("Got image 1 : " + image1Path);
    const image2Path = await getImageFromCode(character2);
    console.log("Got image 2 : " + image2Path)

    const resultPath = await makeCompatibility(image1Path, image2Path);
    return resultPath;

}

export async function makeCompatibilityOther(character1, other) {

    const image1Path = await getImageFromCode(character1);
    console.log("Got image 1 : " + image1Path);
    const image2Path = await getOtherImagePath(other);
    console.log("Got image 2 : " + image2Path);

    const resultPath = await makeCompatibility(image1Path, image2Path);
    return resultPath;
}
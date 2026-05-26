import https from "https";
import fs from "fs";
import type { Character } from "../models/characters.js";
import { BrowserService } from "./browserService.js";

export async function downloadImage(imageUrl: string, filePath: string) : Promise<string> {

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https.get(imageUrl, response => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filePath, () => {});
        reject(new Error(`Failed to fetch image with link ${imageUrl} : ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(() => resolve(filePath));
      });

      file.on("error", err => {
        fs.unlink(filePath, () => {});
        reject(err);
      });

    }).on("error", err => {
      file.close();
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

export async function getCharacterFacePortrait(character: Character): Promise<string> {

  console.log("Getting portrait for : ", character);

  const browserService = await BrowserService.getInstance();
  
  const url = `https://eu.finalfantasyxiv.com/lodestone/character/${character.ffxiv_id}/`;

  return await browserService.doWebOperation(url, async (page) : Promise<string> => {
    await page.waitForSelector('.character-block__face', { timeout: 10000 });

    const imageLink = await page.$eval('img.character-block__face', img => {
        return img.src
    }
    );

    const filePath = `/usr/src/app/images/${character.name}.jpg`;
    await downloadImage(imageLink, filePath);
    return `images/${character.name}.jpg`;
  });
}

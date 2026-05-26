import type { Character } from "../models/characters.js"
import { formatName } from "../utils/textUtils.js";
import { BrowserService } from "./browserService.js";
import { getDataCenter } from "../constants/dataCenters.js";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_API_URL;
 
export async function getCharacterCode(character: Character) : Promise<string> {

  const response = await fetch("http://" + databaseUrl + "/characters/" + formatName(character.name));
  const characterData : Character = await response.json();

  if (characterData.ffxiv_id) {
    return characterData.ffxiv_id;
  }

  return await getCharacterCodeFromNameOnLodestone(character);
}


export async function getCharacterCodeFromNameOnLodestone(character: Character) : Promise<string> {

  const browserService = await BrowserService.getInstance();
 
  const server = character.server.toLowerCase();
  const dataCenter = getDataCenter(character.server); 

  const url = `https://eu.finalfantasyxiv.com/lodestone/character/?q=${character.name}+${character.surname}&worldname=${dataCenter}&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=`

  return await browserService.doWebOperation<string>(url, async (page) : Promise<string> => {

    await page.waitForSelector('.entry__name', {timeout: 10000});

    const results = await page.$$eval(
      '.entry__link',
      (elements: Element[], server: string) => {
        return elements
          .map((a) => {
            const serverElement = a.querySelector('div.entry__box--world > p.entry__world');
            if(serverElement && serverElement.textContent.toLowerCase().includes(server.toLowerCase())) {
              return (a as HTMLAnchorElement).href.split("/").at(-2) ?? null;
            }
            return null;
          })
          .filter((id): id is string => id !== null);
        }, 
        server
    );

    return results[0] ?? "";
  });

}


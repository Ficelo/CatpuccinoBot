import type { Character } from "../models/characters.ts"
import puppeteer from "puppeteer";

const databaseUrl = "";

export async function getCharacterCode(character: Character) : Promise<string> {

  const response = await fetch("http://" + databaseUrl + "/characters" + formatName(character.name));
  const characterData : Character = await response.json();

  if (characterData.ffxiv_id) {
    return characterData.ffxiv_id;
  }

  return await getCharacterCodeFromNameOnLodestone(character);
}


export async function getCharacterCodeFromNameOnLodestone(character: Character) : Promise<string> {

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? "",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/120.0.0.0 Safari/537.36'
  );
  
  const server = character.server.toLowerCase();
  const url = `https://eu.finalfantasyxiv.com/lodestone/character/?q=${character.name}+${character.surname}&worldname=${dc_from_server[character.server.toLowerCase()]}&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=`

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.setViewport({ width: 1080, height: 1024 });
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

  await browser.close();
  return results[0] ?? "";

}


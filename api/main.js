import puppeteer from "puppeteer";
import { getImageFromCode, addProppellerHat, propellerize } from "./imageFusion.js";
import fs from "fs";

const patches = [
  { patch: "2.0", achievement: "Leaving Limsa Lominsa" },
  { patch: "2.0", achievement: "Gone from Gridania" },
  { patch: "2.0", achievement: "Out of Ul'dah" },
  { patch: "2.0", achievement: "Back from the Wood" },
  { patch: "2.0", achievement: "Skeletons" },
  { patch: "2.0", achievement: "Those Who Wait" },
  { patch: "2.0", achievement: "History Repeating" },
  { patch: "2.1", achievement: "Free Wing Night" },
  { patch: "2.1", achievement: "Warrior of Light" },
  { patch: "2.2", achievement: "A Realm Awoken" },
  { patch: "2.2", achievement: "Through the Maelstrom" },
  { patch: "2.3", achievement: "Eorzea Defended" },
  { patch: "2.4", achievement: "Dreams of Ice" },
  { patch: "2.55", achievement: "My Left Arm" },
  { patch: "2.55", achievement: "Lucky Number 7" },
  { patch: "3.0", achievement: "Gaol Break" },
  { patch: "3.0", achievement: "Orthodox Mayhem" },
  { patch: "3.0", achievement: "You Say You Want a Revolution" },
  { patch: "3.0", achievement: "The Faith That Drives Us" },
  { patch: "3.0", achievement: "Hope Enkindled" },
  { patch: "3.0", achievement: "Looking Up" },
  { patch: "3.1", achievement: "So It Goes" },
  { patch: "3.15", achievement: "First Gear" },
  { patch: "3.3", achievement: "Floor the Horde" },
  { patch: "3.4", achievement: "No Retreat, No Surrender" },
  { patch: "3.5", achievement: "School's Out Forever" },
  { patch: "3.56", achievement: "Five Minutes of Fate" },
  { patch: "4.0", achievement: "Incidentally Speaking" },
  { patch: "4.0", achievement: "Destination Unknown" },
  { patch: "4.0", achievement: "Unexplained" },
  { patch: "4.0", achievement: "Put Your Wings Up" },
  { patch: "4.0", achievement: "Crimson Footprints" },
  { patch: "4.0", achievement: "Catch Me if You Can" },
  { patch: "4.0", achievement: "Cheek to Cheek" },
  { patch: "4.0", achievement: "The Measure of His Reach" },
  { patch: "4.1", achievement: "More Heroes" },
  { patch: "4.2", achievement: "Solar Cycle" },
  { patch: "4.3", achievement: "Lunar Cycle" },
  { patch: "4.4", achievement: "A History of Violet" },
  { patch: "4.5", achievement: "What Is It Good For" },
  { patch: "4.56", achievement: "Swan Song" },
  { patch: "5.0", achievement: "Between Two Worlds" },
  { patch: "5.0", achievement: "Realpolitik" },
  { patch: "5.0", achievement: "Journey to the Past" },
  { patch: "5.0", achievement: "Shrouded in Darkness" },
  { patch: "5.0", achievement: "Warden of Light" },
  { patch: "5.0", achievement: "Shadowbringers" },
  { patch: "5.1", achievement: "Black and White" },
  { patch: "5.2", achievement: "Way More Heroes" },
  { patch: "5.3", achievement: "Hope's Legacy" },
  { patch: "5.4", achievement: "Pen and Sword" },
  { patch: "5.5", achievement: "Not for Naught" },
  { patch: "5.55", achievement: "Under the Darkened Moon" },
  { patch: "6.0", achievement: "On Wings of Hope" },
  { patch: "6.0", achievement: "Rise Up Through the Night" },
  { patch: "6.0", achievement: "Higher" },
  { patch: "6.0", achievement: "Oh, Higher" },
  { patch: "6.0", achievement: "Carrying Our Song" },
  { patch: "6.0", achievement: "Fast Within Your Arms" },
  { patch: "6.0", achievement: "That Its Chorus Might Ring for All" },
  { patch: "6.1", achievement: "Newfound Adventure" },
  { patch: "6.2", achievement: "Into the Light" },
  { patch: "6.3", achievement: "Hallowed and Harrowed" },
  { patch: "6.4", achievement: "You Win or You Dais" },
  { patch: "6.5", achievement: "For Others to Follow" },
  { patch: "6.55", achievement: "Tomorrows Unknown" },
  { patch: "7.0", achievement: "A Promise for the People" },
  { patch: "7.0", achievement: "Peaceful Intentions" },
  { patch: "7.0", achievement: "In Rite Triumphant" },
  { patch: "7.0", achievement: "The Worth of a Soul" },
  { patch: "7.0", achievement: "The Burden of Legacy" },
  { patch: "7.0", achievement: "In the Glow of a New Dawn" },
  { patch: "7.1", achievement: "Crossroads" },
  { patch: "7.2", achievement: "Seekers of Eternity" },
  { patch: "7.3", achievement: "In Memoriam" }
];

const fcMembers = [
    {name : "", code : ""}
]

const reversedPatches = patches.reverse();
const ponkerCode = 38173609;
const MikelCode = 44351509;

export async function getCodeFromName(name, surname, server) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
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

  const url = `https://na.finalfantasyxiv.com/lodestone/community/search/?q=${name}+${surname}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForSelector('.frame__chara__name', { timeout: 15000 });

  let previousHeight;
  for (let i = 0; i < 10; i++) {
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) {
      console.log('Finished scrolling');
      break;
    }
  }

  await page.screenshot({ path: `/usr/src/app/debug-${name}.png`, fullPage: true });

  const results = await page.$$eval('.entry__link--line', (res, server) => {
    return res.map(a => {
      const serverElement = a.querySelector('div.frame__chara__box > .frame__chara__world');
      if (serverElement && serverElement.textContent.toLowerCase().includes(server.toLowerCase())) {
        return a.href.split("/").at(-2);
      }
      return null;
    }).filter(Boolean);
  }, server);

  await browser.close();
  return results[0] || "";
}
async function getAllFcNames() {

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

    await page.goto(`https://eu.finalfantasyxiv.com/lodestone/freecompany/9280089244661998516/member/`);
    await page.setViewport({width: 1080, height: 1024});

    await page.waitForSelector('.entry__bg', {timeout: 10000});

    const members = await page.$$eval('a.entry__bg', mbrs => 
        mbrs.map(a => {
            const nameElement = a.querySelector('div.entry__flex > div.entry__freecompany__center > p.entry__name');

            return {
                code : a.href.split("/").at(-2),
                name : nameElement ? nameElement.textContent : null
            }
        })
    );

    // C'est caca de faire comme ça faudrait automatiser

    await page.goto(`https://eu.finalfantasyxiv.com/lodestone/freecompany/9280089244661998516/member/?page=2`);
    await page.waitForSelector('.entry__bg', {timeout: 10000});

    const members2 = await page.$$eval('a.entry__bg', mbrs => 
        mbrs.map(a => {
            const nameElement = a.querySelector('div.entry__flex > div.entry__freecompany__center > p.entry__name');

            return {
                code : a.href.split("/").at(-2),
                name : nameElement ? nameElement.textContent : null
            }
        })
    );

    await browser.close();

    return members.concat(members2);

}

async function checkLatestPatch(characterCode) {

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

    await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${characterCode}/achievement/category/76/#anchor_achievement`, {waitUntil: "domcontentloaded"})
    await page.setViewport({width: 1080, height: 1024});

    await page.waitForSelector('.entry__activity__txt', {timeout : 10000});

    const achivements = await page.$$eval('a.entry__achievement--complete > div.entry__achievement--list > p', 
        nodes => nodes.map(
            node => node.textContent
        )
    );

    await browser.close();

    for (let patch of reversedPatches) {
        if(achivements.includes(patch.achievement)) {
            return patch.patch;
        }
    }
    return "Achivements Hidden";
}


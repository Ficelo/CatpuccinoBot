import { type Request, type Response } from 'express';
import type { Character } from '../models/characters.js';
import { addDimmadome, addDunce, addNerd, addProppellerHat, makePregnant, makeUndertale } from '../services/imageService.js';
import { downloadImage, getCharacterFacePortrait } from '../services/downloaderService.js';
import path from "path";
import { getCharacterCode } from '../services/characterService.js';

const hats : Map<string, Function> = new Map([
  ["propeller", addProppellerHat],
  ["nerd", addNerd],
  ["dunce", addDunce],
  ["dimmadome", addDimmadome],
  ["undertale", makeUndertale],
  ["pregnant", makePregnant]
]);


export const addHat = async (req: Request, res: Response) => {

  try {


    // TODO : add the function to go get the xiv id if it doesn't exist
    const character : Character = {
      name: req.body.name,
      surname: req.body.surname,
      server: req.body.server,
      discord_id: req.body.discord_id ?? ""
    };

    character.ffxiv_id = await getCharacterCode(character);

    const hat = req.body.hat ?? "propeller";

    if (!hats.has(hat)) {
      console.error(`Could not find hat : ${hat}`);
      return res.status(400);
    }

    const characterPortraitPath = await getCharacterFacePortrait(character);
    const editedPortraitPath = await hats.get(hat)!(characterPortraitPath);

    return res.sendFile(path.resolve(editedPortraitPath));

  } catch (error : any) {
    console.error(error);
    return res.status(500).json({
      error: "Could not add a hat",
      details: error.message
    });
  }
}

export const addHatWithDisocrdAvatar = async (req: Request, res: Response) => {

  try {

    const filePath = 'images/hat_avatar.png';
    const hat = req.body.hat ?? "pregnant";
    const discordAvatarPath = await downloadImage(req.body.avatar, filePath);
    const editedAvatar = await hats.get(hat)!(discordAvatarPath);

    if (!hats.has(hat)) {
      console.error(`Could not find hat : ${hat}`);
      return res.status(400);
    }

    return res.sendFile(path.resolve(editedAvatar));

  } catch (error : any) {
    console.error(error);
    return res.status(500).json({
      error: "Could not add a hat",
      details: error.message
    });
  }

}

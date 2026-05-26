import { type Request, type Response } from 'express';
import type { Character } from '../models/characters.js';
import { addDimmadome, addDunce, addNerd, addProppellerHat, makeUndertale } from '../services/imageService.js';
import { getCharacterFacePortrait } from '../services/downloaderService.js';
import path from "path";
import { getCharacterCode } from '../services/characterService.js';

const hats : Map<string, Function> = new Map([
  ["propeller", addProppellerHat],
  ["nerd", addNerd],
  ["dunce", addDunce],
  ["dimmadome", addDimmadome],
  ["undertale", makeUndertale]
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
      return;
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

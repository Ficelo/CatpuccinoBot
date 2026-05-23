import { type Request, type Response, type NextFunction } from 'express';
import type { Character } from '../models/characters.ts';

const databaseUrl = "";

export const addCharacter = async (req: Request, res: Response, next: NextFunction) => {

  // add xiv id get here
  const xivId = "temp";
  
  try {

    const newCharacter : Character = {
     ffxiv_id: xivId,
     name: req.body.name,
     surname: req.body.surname,
     server: req.body.server,
     discord_id: req.body.discord_id
    };

    const result = await fetch(`${databaseUrl}/characters`, {
      method: 'POST',
      body: JSON.stringify(newCharacter),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(result);

  } catch ( error ) {
    console.error(error);
    next(error);
  }
}


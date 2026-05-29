import { type Request, type Response } from 'express';
import { Quote } from '../models/quotes';
import { downloadImage } from '../services/downloaderService';
import path from "path";
import { makeQuoteImage } from '../services/imageService';

export const addQuote = async (req: Request, res: Response) => {

  const avatarImagePath = `/usr/src/app/images/avatar.png`;
 
  try {

    const quote : Quote = {
      authorAvatarUrl: req.body.author_avatar,
      text: req.body.text
    };

    await downloadImage(quote.authorAvatarUrl, avatarImagePath);

    const quoteImageResultPath = await makeQuoteImage(avatarImagePath, quote.text);

    return res.sendFile(path.resolve(quoteImageResultPath));

  } catch (err : any) {
    console.error(err);
    return res.status(500).json({
      error: "Could not make quote",
      details: err.message
    });
  }
}


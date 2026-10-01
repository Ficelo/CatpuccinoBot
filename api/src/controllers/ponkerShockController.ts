import { randomUUID } from 'crypto';
import { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { downloadImage } from '../services/downloaderService.js';
import { makePonkerShockImage } from '../services/imageService.js';

const allowedAttachmentHosts = new Set(['cdn.discordapp.com', 'media.discordapp.net']);

export const makePonkerShock = async (req: Request, res: Response) => {
  const imageUrl = req.body.image;

  if (typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'An image attachment URL is required' });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return res.status(400).json({ error: 'The image attachment URL is invalid' });
  }

  if (parsedUrl.protocol !== 'https:' || !allowedAttachmentHosts.has(parsedUrl.hostname)) {
    return res.status(400).json({ error: 'The image URL must be a Discord attachment' });
  }

  const inputPath = path.join(process.cwd(), 'images', `ponker-shock-${randomUUID()}.jpg`);

  try {
    await fs.promises.mkdir(path.dirname(inputPath), { recursive: true });
    await downloadImage(imageUrl, inputPath);
    const resultPath = await makePonkerShockImage(inputPath);
    await fs.promises.rm(inputPath, { force: true });

    return res.sendFile(path.resolve(resultPath), error => {
      void fs.promises.rm(resultPath, { force: true });
      if (error && !res.headersSent) {
        res.status(500).json({ error: 'Could not send the Ponker Shock image' });
      }
    });
  } catch (error) {
    await fs.promises.rm(inputPath, { force: true });
    console.error(error);
    return res.status(500).json({
      error: 'Could not make Ponker Shock image',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
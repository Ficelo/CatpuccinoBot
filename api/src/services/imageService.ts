import { createCanvas, loadImage } from 'canvas';
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { makeTextQuote } from '../utils/textUtils';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export async function addProppellerHat(baseImagePath: string) : Promise<string> {

  const resultPath = path.join(
    path.dirname(baseImagePath),
    path.basename(baseImagePath, path.extname(baseImagePath))
    + '.png'
  );

  const characterImage = await loadImage(path.join(__dirname, '../../', baseImagePath));
  const hatImage = await loadImage(path.join(__dirname, '../../hats/propeller.png'));

  const hatWidth = 256;
  const hatHeight = 192;
  const extraTopSpace = 64;

  const canvas = createCanvas(characterImage.width, characterImage.height + extraTopSpace);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(characterImage, 0, extraTopSpace, characterImage.width, characterImage.height);
  ctx.drawImage(hatImage, 0, 0, hatWidth, hatHeight);

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(resultPath, buffer);

  return resultPath;

}

export async function addNerd(baseImagePath: string) : Promise<string> {

  const resultPath = path.join(
    path.dirname(baseImagePath),
    path.basename(baseImagePath, path.extname(baseImagePath))
    + '.png'
  );

  const characterImage = await loadImage(path.join(__dirname, '../../', baseImagePath));
  const glassesImage = await loadImage(path.join(__dirname, '../../hats/nerd-glasses.png'));
  const fingerImage = await loadImage(path.join(__dirname, '../../hats/finger.png'));

  const fingerWidth = 128;
  const fingerHeight = 128;

  const glassesWidth = 192;
  const glassesHeight = 98;

  const canvas = createCanvas(characterImage.width, characterImage.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(characterImage, 0, 0, characterImage.width, characterImage.height);
  ctx.drawImage(glassesImage, 32, 98, glassesWidth, glassesHeight);
  ctx.drawImage(fingerImage, -32, 128, fingerWidth, fingerHeight);

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(resultPath, buffer);

  return resultPath;

}

export async function addDunce(baseImagePath: string) : Promise<string> {

  const resultPath = path.join(
    path.dirname(baseImagePath),
    path.basename(baseImagePath, path.extname(baseImagePath))
    + '.png'
  );

  const characterImage = await loadImage(path.join(__dirname, '../../', baseImagePath));
  const dunceHatImage = await loadImage(path.join(__dirname, '../../hats/dunce.png'));

  const dunceHatWidth = 192;
  const dunceHatHeight = 228;
  const extraTopSpace = 96;

  const canvas = createCanvas(characterImage.width, characterImage.height + extraTopSpace);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(characterImage, 0, extraTopSpace, characterImage.width, characterImage.height);
  ctx.drawImage(dunceHatImage, 32, 0, dunceHatWidth, dunceHatHeight);

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(resultPath, buffer);

  return resultPath;

}

export async function addDimmadome(baseImagePath: string) : Promise<string> {

  const resultPath = path.join(
    path.dirname(baseImagePath),
    path.basename(baseImagePath, path.extname(baseImagePath))
    + '.png'
  );

  const characterImage = await loadImage(path.join(__dirname, '../../', baseImagePath));
  const dimmadomeImage = await loadImage(path.join(__dirname, '../../hats/dimmadome.png'));

  const dimmadomeWidth = 256;
  const dimmadomeHeight = 900;
  const extraTopSpace = 740;

  const canvas = createCanvas(characterImage.width, characterImage.height + extraTopSpace);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(characterImage, 0, extraTopSpace, characterImage.width, characterImage.height);
  ctx.drawImage(dimmadomeImage, 0, 0, dimmadomeWidth, dimmadomeHeight);

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(resultPath, buffer);

  return resultPath;

}

export async function makeUndertale(baseImagePath: string) : Promise<string> {

  const resultPath = path.join(
    path.dirname(baseImagePath),
    path.basename(baseImagePath, path.extname(baseImagePath))
    + '.png'
  );

  const characterImage = await loadImage(path.join(__dirname, '../../', baseImagePath));
  const undertaleImage = await loadImage(path.join(__dirname, '../../bases/undertale.jpg'));

  const characterWidth = 45;
  const characterHeight = 35;
  
  const canvas = createCanvas(undertaleImage.width, undertaleImage.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(undertaleImage, 0, 0, undertaleImage.width, undertaleImage.height);
  ctx.drawImage(characterImage, 473, 100, characterWidth, characterHeight);

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(resultPath, buffer);

  return resultPath;

}

export async function makeQuoteImage(avatarImagePath: string, text: string) : Promise<string> {

  const resultPath = path.join(
    path.dirname(avatarImagePath),
    path.basename(avatarImagePath, path.extname(avatarImagePath))
    + '.png'
  );

  const characterImage = await loadImage(path.join(avatarImagePath));
  
  const characterImageSize = 256;

  const canvas = createCanvas(600, characterImageSize);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 600, characterImageSize);

  ctx.drawImage(characterImage, 0, 0, characterImageSize, characterImageSize);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, characterImageSize, characterImageSize);

  const quoteText = makeTextQuote(text);
  const words = quoteText.split(' ');
  const maxWidth = 600 - 275 - 10;
  const lineHeight = 40;
  const fontSize = 28;

  ctx.fillStyle = 'white';
  ctx.font = `${fontSize}px Arial`;

  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = ctx.measureText(testLine);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine);

  const totalTextHeight = lines.length * lineHeight;
  const startY = (characterImageSize - totalTextHeight) / 2 + fontSize;

  lines.forEach((line, i) => {
    ctx.fillText(line, 275, startY + i * lineHeight);
  });

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(resultPath, buffer);
  return resultPath;
}


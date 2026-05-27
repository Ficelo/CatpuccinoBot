export function formatName(name: string) : string {
  return name.substring(0,1).toUpperCase() + name.substring(1).toLowerCase();
}

export function makeTextQuote(text : string) : string {

  if (text.charAt(0) != '"' && text.charAt(text.length - 1) != '"') {
    return '"' + text + '"';
  }

  return text;
}

export function wrapText(text : string, maxCharsPerLine : number = 22) : string[] {

  const words = text.split(" ");
  const lines = [];

  let currentLine = "";

  for( const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;

    if (testLine.length > maxCharsPerLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }

  }

  if (currentLine) { 
    lines.push(currentLine)
  }

  return lines;

}

export function formatName(name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
}

export function makeTextQuote(text) {

  if (text.charAt(0) != '"' && text.charAt(text.length - 1) != '"') {
    return '"' + text + '"';
  }

  return text;
}

export function wrapText(text, maxCharsPerLine = 22) {

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



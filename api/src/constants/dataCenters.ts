export const dc_from_server = {
  Aether:  ["adamantoise", "cactuar", "faerie", "gilgamesh", "jenova", "midgardsormr", "sargatanas", "siren"],
  Crystal: ["balmung", "brynhildr", "coeurl", "diabolos", "goblin", "malboro", "mateus", "zalera"],
  Primal:  ["behemoth", "excalibur", "exodus", "famfrit", "hyperion", "lamia", "leviathan", "ultros"],
  Dynamis: ["halicarnassus", "maduin", "marilith", "seraph", "cuchulainn", "golem", "kraken", "rafflesia"],
  Chaos:   ["cerberus", "louisoix", "moogle", "omega", "phantom", "ragnarok", "sagittarius", "spriggan"],
  Light:   ["raiden", "alpha", "lich", "odin", "phoenix", "shiva", "twintania", "zodiark"],
};

export function getDataCenter(server : string) : string {

  const dataCenter = Object.keys(dc_from_server).find(dc => {
    return dc_from_server[dc as keyof typeof dc_from_server].includes(server.toLowerCase());
  });

  return "dc_" + dataCenter;
}


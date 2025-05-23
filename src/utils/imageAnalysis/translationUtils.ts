
// Translation utilities for image analysis

// Translate common labels to Czech
export const translateLabelToCzech = (label: string): string => {
  const translations: {[key: string]: string} = {
    "person": "osoba",
    "people": "lidé",
    "man": "muž",
    "woman": "žena",
    "child": "dítě",
    "dog": "pes",
    "cat": "kočka",
    "car": "auto",
    "building": "budova",
    "tree": "strom",
    "sky": "obloha",
    "water": "voda",
    "beach": "pláž",
    "mountain": "hora",
    "food": "jídlo",
    "flower": "květina",
    "computer": "počítač",
    "phone": "telefon",
    "furniture": "nábytek",
    "plant": "rostlina",
    "animal": "zvíře",
    "vehicle": "vozidlo",
    "bird": "pták",
    "grass": "tráva",
    "forest": "les",
    "architecture": "architektura",
    "cloud": "mrak",
    "street": "ulice",
    "river": "řeka",
    "lake": "jezero",
    "city": "město",
    "house": "dům",
    "smile": "úsměv",
    "road": "cesta",
    "window": "okno",
    "door": "dveře",
    "table": "stůl",
    "chair": "židle",
    "book": "kniha",
    "television": "televize",
    "laptop": "notebook",
    "fashion": "móda",
    "room": "pokoj"
    // Add more translations as needed
  };
  
  return translations[label.toLowerCase()] || label;
};

// Similar function for objects
export const translateObjectToCzech = (objectName: string): string => {
  return translateLabelToCzech(objectName); // Reuse the same translations for simplicity
};

// Translate likelihood levels to Czech
export const translateLikelihoodToCzech = (likelihood: string): string => {
  const translations: {[key: string]: string} = {
    "VERY_LIKELY": "velmi pravděpodobné",
    "LIKELY": "pravděpodobné",
    "POSSIBLE": "možné",
    "UNLIKELY": "nepravděpodobné",
    "VERY_UNLIKELY": "velmi nepravděpodobné",
    "UNKNOWN": "neznámé"
  };
  
  return translations[likelihood] || likelihood;
};

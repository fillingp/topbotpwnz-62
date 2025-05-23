
import { ImageAnalysisResult } from "./types";

export const formatAnalysisResult = (result: ImageAnalysisResult): string => {
  let formattedResult = `# Analýza obrázku 📸\n\n`;
  
  if (result.description) {
    formattedResult += `## Popis\n${result.description}\n\n`;
  }
  
  if (result.tags && result.tags.length > 0) {
    formattedResult += `## Štítky 🏷️\n${result.tags.join(', ')}\n\n`;
  }
  
  if (result.objects && result.objects.length > 0) {
    formattedResult += `## Rozpoznané objekty 🔍\n${result.objects.join(', ')}\n\n`;
  }
  
  if (result.text) {
    formattedResult += `## Rozpoznaný text 📝\n${result.text}\n\n`;
  }
  
  if (result.faces && result.faces.length > 0) {
    formattedResult += `## Rozpoznané tváře 👤\n`;
    result.faces.forEach((face, index) => {
      formattedResult += `Tvář ${index + 1}:\n- Emoce: ${face.emotions.join(', ')}\n`;
      if (face.age > 0) {
        formattedResult += `- Přibližný věk: ${face.age} let\n`;
      }
      if (face.gender !== "nespecifikováno") {
        formattedResult += `- Pohlaví: ${face.gender}\n`;
      }
      formattedResult += '\n';
    });
  }

  if (result.landmarks && result.landmarks.length > 0) {
    formattedResult += `## Rozpoznané památky 🏛️\n${result.landmarks.join(', ')}\n\n`;
  }
  
  if (result.safeSearch) {
    formattedResult += `## Bezpečnostní analýza 🔒\n`;
    formattedResult += `- Nevhodný obsah: ${result.safeSearch.adult}\n`;
    formattedResult += `- Parodie: ${result.safeSearch.spoof}\n`;
    formattedResult += `- Medicínský obsah: ${result.safeSearch.medical}\n`;
    formattedResult += `- Násilí: ${result.safeSearch.violence}\n`;
    formattedResult += `- Provokativní obsah: ${result.safeSearch.racy}\n\n`;
  }
  
  if (result.webEntities && result.webEntities.length > 0) {
    formattedResult += `## Webové entity 🌐\n${result.webEntities.join(', ')}\n\n`;
  }
  
  if (result.dominantColors && result.dominantColors.length > 0) {
    formattedResult += `## Dominantní barvy 🎨\n`;
    result.dominantColors.forEach((color, index) => {
      formattedResult += `- Barva ${index + 1}: ${color.color} (skóre: ${Math.round(color.score * 100)}%)\n`;
    });
    formattedResult += '\n';
  }
  
  formattedResult += `\n_Analýza provedena pomocí pokročilého systému počítačového vidění. Výsledky jsou orientační._`;
  
  return formattedResult;
};

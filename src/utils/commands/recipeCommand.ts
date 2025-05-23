
import { CommandResult } from './types';
import { getStructuredResponseFromGemini } from '@/services/gemini/textService';
import { getRecipeListSchema } from '@/services/gemini/schemaService';
import { toast } from 'sonner';

export const recipeCommand = async (foodName: string): Promise<CommandResult> => {
  if (!foodName) {
    return { 
      content: "A na co jako chceš recept? Zadej název jídla! 🍲", 
      type: 'error' 
    };
  }
  
  try {
    toast.info(`Hledám recept na ${foodName}, trpělivost chvíli...`);
    
    const recipeQuery = `Najdi recept na ${foodName}. Uveď název receptu, všechny ingredience s množstvím a podrobný postup přípravy krok za krokem.`;
    
    const recipes = await getStructuredResponseFromGemini(recipeQuery, getRecipeListSchema());
    
    // Bezpečné ověření, zda recipes je pole a zda má položky
    if (!Array.isArray(recipes) || recipes.length === 0) {
      return {
        content: `Bohužel jsem nenašel recept na ${foodName}. Zkus to s jiným jídlem. 😕`,
        type: 'text'
      };
    }
    
    // Formátování receptu pro markdown
    const recipe = recipes[0]; // Bereme první recept
    const formattedRecipe = `
# 🍽️ ${recipe.recipeName}

## Ingredience
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

## Postup
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Dobrou chuť! 😋
    `;
    
    return {
      content: formattedRecipe.trim(),
      type: 'text'
    };
  } catch (error) {
    console.error('Error getting recipe:', error);
    return {
      content: `Nepodařilo se získat recept: ${error instanceof Error ? error.message : "Neznámá chyba"}. Zkus to znovu později. 🤔`,
      type: 'error'
    };
  }
};


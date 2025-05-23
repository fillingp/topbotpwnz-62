
// Schema definitions for structured responses

/**
 * Gets the schema for recipe lists
 */
export const getRecipeListSchema = () => {
  return {
    type: "array",
    items: {
      type: "object",
      properties: {
        recipeName: {
          type: "string"
        },
        ingredients: {
          type: "array",
          items: {
            type: "string"
          }
        },
        instructions: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: ["recipeName", "ingredients", "instructions"]
    }
  };
};

// Add other schemas here as needed

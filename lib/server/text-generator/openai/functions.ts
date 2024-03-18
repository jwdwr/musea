export const museumFunction = {
  name: "generateMuseum",
  description: "Generate a museum.",
  parameters: {
    type: "object",
    properties: {
      theme: {
        type: "string",
        description: "museum theme",
      },
      prompts: {
        type: "array",
        description: "prompts for generating paintings",
        items: {
          type: "string",
        },
      },
      palette: {
        type: "object",
        properties: {
          light: {
            type: "string",
            description: "light color",
          },
          medium: {
            type: "string",
            description: "medium color",
          },
          dark: {
            type: "string",
            description: "dark color",
          },
        },
        required: ["light", "medium", "dark"],
      },
    },
    required: ["theme", "prompt", "palette"],
  },
};

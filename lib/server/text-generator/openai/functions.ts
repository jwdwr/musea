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
      prompt: {
        type: "string",
        description: "prompt for generating paintings",
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

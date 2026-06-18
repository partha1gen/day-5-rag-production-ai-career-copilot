import { openAiClient } from "../utils/openai.js";
export const ragAnalyzer = async (context, question) => {
  try {
    const prompt = `
                    Answer using ONLY
                    the supplied context.

                    Context:

                    ${context}

                    Question:

                    ${question}
                    `;
    const response = await openAiClient.chat.completions.create({
      model: "gpt-5.5",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return response;
  } catch (e) {
    throw new Error("from rag service", { cause: e.message });
  }
};

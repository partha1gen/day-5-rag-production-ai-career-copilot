import { openAiClient } from "../utils/openai.js";
export const ragAnalyzer = async (context, question, existingmsg) => {
  try {
    const prompt = `
                    Answer using ONLY
                    the supplied context.

                    Context:

                    ${context}

                    Question:

                    ${question}
                    `;
    existingmsg.push({
      role: "user",
      content: prompt,
    });
    console.log("existv:", existingmsg);
    const response = await openAiClient.chat.completions.create({
      model: "gpt-5.5",

      messages: existingmsg,
    });
    return response;
  } catch (e) {
    throw new Error("from rag service", { cause: e.message });
  }
};

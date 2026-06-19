import ResumeModel from "../model/ResumeModel.js";
import { ragAnalyzer } from "../services/ragService.js";
import Chat from "../schema/chatSchema.js";
import mongoose from "mongoose";

export const questionChat = async (req, res) => {
  try {
    const uri =
      "mongodb+srv://parthachowdhury78_db_user:dr7fwltRmNzQwupS@cluster0.yzlfedx.mongodb.net/?appName=Cluster0";
    await mongoose.connect(uri);

    if (!req.body?.queryString) {
      return res.status(400).json({ message: "question param not present" });
    }
    const { sessionId, queryString } = req.body;
    const session = await Chat.findOne({
      sessionId,
    });
    const history = session?.messages || [];

    const systemPrompt = `
You are an expert technical recruiter and career coach.

Rules:

- Use only the provided context.
- Never fabricate information.
- If information is unavailable, say:
  "I don't have enough information."
- Be concise and factual.
- When possible, mention the source document.
- Focus on experience, skills, projects, leadership, and job matching.
`;
    const messages = [];
    messages.push({
      role: "system",
      content: systemPrompt,
    });

    history.push({
      role: "user",
      content: queryString,
    });
    messages.push(...history);
    const searchText = queryString;
    console.log(searchText);
    const serachResults = await ResumeModel.queryEmbeddingFromSearch(
      searchText,
      true,
    );
    console.log("results:,,,,--", serachResults);
    //source attribution
    const sources = serachResults.metadatas[0].map((item) => ({
      source: item.source,
      page: item.page,
    }));
    //build context
    const context = serachResults.documents[0].join("\n");
    const response = await ragAnalyzer(context, searchText, messages);
    // return res.status(200).json({ serachResults });
    history.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });
    //store in mongodb
    await Chat.findOneAndUpdate(
      { sessionId },

      {
        sessionId,
        messages: history,
      },

      { upsert: true },
    );

    return res.status(200).json({
      answer: response.choices[0].message.content,
      sources,
    });
  } catch (e) {
    return res.status(500).json({ message: e.cause });
  }
};

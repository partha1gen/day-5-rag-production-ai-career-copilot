import ResumeModel from "../model/ResumeModel.js";
import { ragAnalyzer } from "../services/ragService.js";

export const questionChat = async (req, res) => {
  console.log(req.body);
  if (!req.body?.question) {
    return res.status(400).json({ message: "question param not present" });
  }
  const searchText = req.body.question;
  console.log(searchText);
  const serachResults = await ResumeModel.queryEmbeddingFromSearch(searchText);
  console.log("results:,,,,--", serachResults);
  //build context
  const context = serachResults.documents[0].join("\n");
  const response = await ragAnalyzer(context, searchText);
  // return res.status(200).json({ serachResults });
  return res.status(200).json({
    answer: response.choices[0].message.content,
    sources: serachResults.metadatas[0],
  });
};

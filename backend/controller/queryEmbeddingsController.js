import ResumeModel from "../model/ResumeModel.js";

export const queryEmbedding = async (req, res) => {
  console.log(req.body);
  if (!req.body?.queryString) {
    return res.status(400).json({ message: "query param not present" });
  }
  const searchText = req.body.queryString;
  console.log(searchText);
  const serachResults = await ResumeModel.queryEmbeddingFromSearch(
    searchText,
    false,
  );
  console.log(serachResults);
  return res.status(200).json({ serachResults });
};

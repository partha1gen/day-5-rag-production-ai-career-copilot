import ResumeModel from "../model/ResumeModel.js";
import { chunkText } from "../services/pdfService.js";

export const uploadAndChunk = async (req, res) => {
  console.log("in chunk cons");
  if (!req.file) {
    return res.status(500).json({ message: "file is required" });
  }
  if (req.file) {
    try {
      const pdfText = await ResumeModel.extractPdfText(req.file.path);
      //console.log(pdfText);
      //generate chunks
      const chunks = await chunkText(pdfText);
      //generate embedding per text and save to chroma
      for (const chunk of chunks) {
        const embedding = await ResumeModel.generateEmbeddingFromText(
          chunk.pageContent,
        );

        // Save to Chroma
        //store embedding
        await ResumeModel.storeEmbeddings(
          embedding,
          req.file.originalname,
          chunk.pageContent,
        );
      }

      res.status(200).json({ message: "chunking successful" });
    } catch (e) {
      res.status(500).json({ error: e.message, message: e.cause });
    }
  }
};

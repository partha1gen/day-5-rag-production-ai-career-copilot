import { PDFParse } from "pdf-parse";
import { generateEmbedding } from "../services/embeddingService.js";
import { getCollection } from "../services/chromaService.js";
import crypto from "crypto";
import fs from "node:fs/promises";

class ResumeModel {
  async extractPdfText(filePath) {
    try {
      const parser = new PDFParse({
        url: filePath,
      });

      const result = await parser.getText();
      await fs.unlink(filePath);

      return result.text;
    } catch (e) {
      throw new Error("from pdf extraction", { cause: e.message });
    }
  }

  async generateEmbeddingFromText(text) {
    const embedding = await generateEmbedding(text);
    return embedding;
  }

  async storeEmbeddings(embedding, filename, text) {
    try {
      const uniqueId = crypto.randomUUID();

      const collection = await getCollection();

      const initialCount = await collection.count();

      const resp = await collection.add({
        ids: [uniqueId],
        embeddings: [embedding],
        metadatas: [
          {
            fileName: filename,
          },
        ],
        documents: [text],
      });
      console.log(resp);
      const finalCount = await collection.count();
      console.log(
        `Success: Added ${finalCount - initialCount} item(s).`,
        finalCount,
        initialCount,
      );
    } catch (e) {
      throw new Error("from storeemdedding", { cause: e.message });
    }
  }

  async queryEmbeddingFromSearch(text, rag = false) {
    try {
      const queryEmbedding = await generateEmbedding(text);

      const collection = await getCollection();

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 5,
      });
      console.log(results);
      if (rag) {
        return results;
      }
      return results.metadatas[0];
    } catch (e) {
      throw new Error("from query emdedding", { cause: e.message });
    }
  }
}
export default new ResumeModel();

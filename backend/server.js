import express from "express";
import cors from "cors";
import { upload } from "./middleware/multer.js";
import { uploadResumeAndEmbed } from "./controller/uploadresumeController.js";
import { queryEmbedding } from "./controller/queryEmbeddingsController.js";
import { uploadAndChunk } from "./controller/uploadAndChunkController.js";
import { questionChat } from "./controller/questionChatController.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/upload-resume", upload.single("resume"), uploadResumeAndEmbed);
app.post("/search", queryEmbedding);
app.post("/chat", questionChat);

app.post("/upload-document-rag", upload.single("resume"), uploadAndChunk);

app.listen(3000, () => {
  console.log("server started");
});

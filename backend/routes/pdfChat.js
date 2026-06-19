import express from "express";
import { upload } from "../middleware/multer.js";
import { uploadAndChunk } from "../controller/uploadAndChunkController.js";
import { questionChat } from "../controller/questionChatController.js";

const pdfChatRouter = express.Router();

pdfChatRouter.post("/upload-document", upload.single("resume"), uploadAndChunk);
pdfChatRouter.post("/chat", questionChat);

export default pdfChatRouter;

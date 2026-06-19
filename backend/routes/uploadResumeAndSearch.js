import express from "express";
import { uploadResumeAndEmbed } from "../controller/uploadresumeController.js";
import { queryEmbedding } from "../controller/queryEmbeddingsController.js";
import { upload } from "../middleware/multer.js";

const resumeRouter = express.Router();

resumeRouter.post(
  "/upload-resume",
  upload.single("resume"),
  uploadResumeAndEmbed,
);
resumeRouter.post("/search", queryEmbedding);

export default resumeRouter;

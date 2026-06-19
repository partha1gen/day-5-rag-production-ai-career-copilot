import express from "express";
import cors from "cors";
import resumeRouter from "./routes/uploadResumeAndSearch.js";
import pdfChatRouter from "./routes/pdfChat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/resume-search", resumeRouter);
app.use("/pdf-chat", pdfChatRouter);

app.listen(3000, () => {
  console.log("server started");
});

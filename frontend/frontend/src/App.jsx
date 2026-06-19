import "./App.css";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [file, setFile] = useState(null);
  const [statusText, setStatusText] = useState(null);
  const [query, setQuery] = useState("");
  const [searchtresult, setSearchResult] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState(null);
  const [documentType, setDocumentType] = useState("resume");
  const [sessionId] = useState(() => {
    let existingSessionId = localStorage.getItem("sessionId");

    if (!existingSessionId) {
      existingSessionId = uuidv4();

      localStorage.setItem("sessionId", existingSessionId);
    }
    return existingSessionId;
  });

  const uploadResume = async (e) => {
    const urlTarget = e.target.dataset.info;
    let url;
    if (urlTarget === "pdf-chat") {
      url = "http://localhost:3000/pdf-chat/upload-document";
    } else if (urlTarget === "resume-search") {
      url = "http://localhost:3000/resume-search/upload-resume";
    }

    const formData = new FormData();
    setStatusText(" ");
    formData.append("resume", file);
    formData.append("documentType", documentType);
    try {
      const response = await axios.post(url, formData);

      if (response.status === 200) {
        setStatusText("upload success");
      } else {
        setStatusText("error in upload");
      }
    } catch (e) {
      setStatusText("error in upload" + e.message);
    }
  };

  const handlesearch = async (e) => {
    try {
      const urlTarget = e.target.dataset.info;
      let url, queryString;
      if (urlTarget === "pdf-chat") {
        queryString = question;
        url = "http://localhost:3000/pdf-chat/chat";
      } else if (urlTarget === "resume-search") {
        queryString = query;
        url = "http://localhost:3000/resume-search/search";
      }
      const response = await axios.post(url, {
        queryString,
        sessionId,
      });
      console.log(response.data);
      if (urlTarget === "resume-search")
        setSearchResult(response.data.serachResults);
      else if (urlTarget === "pdf-chat") setQuestionAnswer(response.data);
    } catch (e) {
      alert(e.message, e.cause);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="*.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button data-info="resume-search" onClick={uploadResume}>
        upload resume
      </button>
      <button data-info="pdf-chat" onClick={uploadResume}>
        upload resume and pdf chat with rag
      </button>
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
      >
        <option value="resume">Resume</option>

        <option value="jd">JD</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <button data-info="resume-search" onClick={handlesearch}>
        search
      </button>
      {statusText && <p>{statusText}</p>}
      {searchtresult.length > 0 && (
        <ul>
          {searchtresult.map((x) => (
            <li>{x.fileName}</li>
          ))}
        </ul>
      )}
      {!(searchtresult.length > 0) && <p>no result to display</p>}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button data-info="pdf-chat" onClick={handlesearch}>
        Send question
      </button>
      <div>Session: {sessionId}</div>
      {questionAnswer && <div>{questionAnswer.answer}</div>}
      {questionAnswer && (
        <ul>
          {questionAnswer.sources.map((item) => (
            <li>
              {item.source}
              <li>page:{item.page}</li>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;

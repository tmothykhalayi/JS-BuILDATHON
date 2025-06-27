import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { AzureChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize LangChain's AzureChatOpenAI model client
const chatModel = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_INFERENCE_SDK_KEY,
  azureOpenAIApiInstanceName: process.env.INSTANCE_NAME, // In target url: https://<INSTANCE_NAME>.services...
  azureOpenAIApiDeploymentName: process.env.DEPLOYMENT_NAME, // i.e "gpt-4o"
  azureOpenAIApiVersion: "2024-08-01-preview", // In target url: ...<VERSION>
  temperature: 1,
  maxTokens: 4096,
});

// Session-based in-memory store
const sessionMemories = {};

// PDF content storage
let pdfContent = "";

// Helper function to get/create a session history
function getSessionMemory(sessionId) {
  if (!sessionMemories[sessionId]) {
    const history = new ChatMessageHistory();
    sessionMemories[sessionId] = new BufferMemory({
      chatHistory: history,
      returnMessages: true,
      memoryKey: "chat_history",
    });
  }
  return sessionMemories[sessionId];
}

// Load PDF content (for RAG functionality)
async function loadPDF() {
  if (pdfContent) return; // Already loaded
  
  try {
    const pdfPath = path.join(process.cwd(), "data", "employee_handbook.pdf");
    if (fs.existsSync(pdfPath)) {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      pdfContent = data.text;
      console.log("📚 PDF loaded successfully");
    } else {
      console.log("📚 No PDF found, skipping RAG functionality");
    }
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
}

// Simple text retrieval function (basic RAG implementation)
function retrieveRelevantContent(query) {
  if (!pdfContent) return [];
  
  const queryLower = query.toLowerCase();
  const sentences = pdfContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  return sentences
    .filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return queryLower.split(' ').some(word => 
        word.length > 3 && sentenceLower.includes(word)
      );
    })
    .slice(0, 3); // Return top 3 relevant sentences
}

// Chat endpoint with memory support
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const useRAG = req.body.useRAG === undefined ? true : req.body.useRAG;
  const sessionId = req.body.sessionId || "default";

  let sources = [];

  const memory = getSessionMemory(sessionId);
  const memoryVars = await memory.loadMemoryVariables({});

  if (useRAG) {
    await loadPDF();
    sources = retrieveRelevantContent(userMessage);
  }

  // Prepare system prompt
  const systemMessage = useRAG
    ? {
        role: "system",
        content: sources.length > 0
          ? `You are a helpful assistant for Contoso Electronics. You must ONLY use the information provided below to answer.\n\n--- EMPLOYEE HANDBOOK EXCERPTS ---\n${sources.join('\n\n')}\n--- END OF EXCERPTS ---`
          : `You are a helpful assistant for Contoso Electronics. The excerpts do not contain relevant information for this question. Reply politely: "I'm sorry, I don't know. The employee handbook does not contain information about that."`,
      }
    : {
        role: "system",
        content: "You are a helpful and knowledgeable assistant. Answer the user's questions concisely and informatively.",
      };

  try {
    // Build final messages array
    const messages = [
      systemMessage,
      ...(memoryVars.chat_history || []),
      { role: "user", content: userMessage },
    ];

    const response = await chatModel.invoke(messages);

    await memory.saveContext({ input: userMessage }, { output: response.content });

    res.json({ reply: response.content, sources });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Model call failed",
      message: err.message,
      reply: "Sorry, I encountered an error. Please try again."
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running with LangChain.js and conversation memory!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🧠 LangChain.js integration with conversation memory enabled!");
  console.log("📚 RAG functionality available if employee_handbook.pdf exists in data/ folder");
});

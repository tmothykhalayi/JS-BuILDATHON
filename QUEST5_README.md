# Quest 5: Conversation Memory with LangChain.js

## 🎯 What's New

This implementation adds conversation memory to your AI chat application using LangChain.js. The key improvements include:

### 🧠 Conversation Memory
- **Session-based memory**: Each conversation session maintains its own history
- **Context awareness**: The AI can reference previous messages in the conversation
- **Persistent across messages**: Ask "You can call me Terry" then later "What's my name?" and the AI will remember!

### 🔧 LangChain.js Integration
- **Simplified AI model interaction**: Using `@langchain/openai` instead of direct REST calls
- **Memory management**: Built-in `BufferMemory` and `ChatMessageHistory`
- **Modular architecture**: Easy to extend with additional LangChain features

### 🎨 Enhanced UI
- **Modern chat interface**: Beautiful, responsive design
- **Session management**: Switch between different conversation sessions
- **RAG toggle**: Enable/disable RAG functionality
- **Real-time typing indicators**: Better user experience

## 🚀 Quick Start

1. **Configure your environment**:
   Update the `.env` file with your Azure AI credentials:
   ```
   AZURE_INFERENCE_SDK_ENDPOINT=https://your-instance.openai.azure.com/
   AZURE_INFERENCE_SDK_KEY=your-api-key
   INSTANCE_NAME=your-instance-name
   DEPLOYMENT_NAME=gpt-4o-mini
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Test conversation memory**:
   - Open http://localhost:3000/chat.html
   - Say: "Hey, you can call me Terry. What should I call you?"
   - Then ask: "Quiz time. What's my name?"
   - The AI should remember your name!

## 📁 Project Structure

```
JS-BuILDATHON/
├── server.js           # Main server with LangChain.js integration
├── chat.html           # Beautiful chat interface
├── package.json        # Dependencies including LangChain.js
├── .env                # Environment configuration
└── data/
    └── employee_handbook.pdf  # Optional: For RAG functionality
```

## 🔍 Key Features

### Memory Management
- **Session-based**: Each user/session gets its own memory
- **Automatic cleanup**: Memory is managed efficiently
- **Cross-message context**: AI remembers the entire conversation

### RAG Integration
- **Toggle-able**: Enable/disable RAG functionality
- **PDF processing**: Automatically processes employee handbook
- **Relevant retrieval**: Finds relevant content based on user queries

### Error Handling
- **Graceful degradation**: Continues working even if some features fail
- **User-friendly errors**: Clear error messages in the UI
- **Logging**: Comprehensive server-side logging

## 🧪 Testing the Memory

Try these conversation flows:

1. **Name Memory**:
   - "You can call me Alex"
   - "What's my name?"

2. **Context Memory**:
   - "I work in the marketing department"
   - "What department do I work in?"

3. **Multi-turn Conversation**:
   - "I need help with vacation policies"
   - "How many days do I get?"
   - "What about sick days?" (should understand context)

## 🔧 Configuration

The server supports several configuration options:

- `PORT`: Server port (default: 3000)
- `AZURE_INFERENCE_SDK_ENDPOINT`: Your Azure OpenAI endpoint
- `AZURE_INFERENCE_SDK_KEY`: Your Azure OpenAI API key
- `INSTANCE_NAME`: Azure OpenAI instance name
- `DEPLOYMENT_NAME`: Model deployment name (e.g., gpt-4o-mini)

## 🎉 Quest Complete!

You've successfully implemented conversation memory using LangChain.js! The AI can now:
- Remember user names and preferences
- Maintain context across multiple messages
- Provide more coherent and personalized responses
- Switch between different conversation sessions

Ready to commit and push your changes to complete Quest 5! 🚀

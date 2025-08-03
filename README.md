# Property AI - LangGraph Development Environment

A TypeScript + LangChain.js agent architecture for property-related AI tools, built on LangGraph workflows and integrated with Ollama.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Ollama:**
   - Install Ollama locally
   - Pull the granite model: `ollama pull granite3.2:8b`
   - Ensure Ollama is running on `http://localhost:11434` (default)

3. **Configure environment (optional):**
   ```bash
   # Create .env file if you need custom settings
   OLLAMA_URL=http://localhost:11434
   LANGSMITH_API_KEY=your_key_here
   LANGSMITH_TRACING=true
   ```

4. **Run the agent:**
   ```bash
   # Development mode
   npm run dev
   
   # Or build and run
   npm run build
   npm start
   
   # Test agent directly
   npx ts-node src/agent.ts
   ```

## Current Implementation

This project is a LangGraph-based property AI agent using:
- **LangGraph StateGraph** with MessagesAnnotation for conversation state
- **Ollama ChatOllama** with granite3.2:8b model
- **MemorySaver** for persistent conversation memory
- **Thread-based conversations** with UUID identifiers
- **Pirate personality** system prompt (configurable)

### Project Structure

- `src/requirements-agent.ts` - LangGraph agent that handles requirement gathering with memory and personality
- `src/workflow.ts` - Defines the StateGraph-based workflow logic
- `src/cli-chat.ts` - CLI interface for chatting with the agent
- `package.json` - Dependencies including @langchain/langgraph and @langchain/ollama
- `tsconfig.json` - TypeScript configuration with CommonJS modules

## Usage

Currently the agent runs a single test conversation. The architecture supports:
- Persistent conversation memory across sessions
- Configurable system prompts via ChatPromptTemplate
- State management through LangGraph's MessagesAnnotation
- Local Ollama model inference

### Current Test Flow
```typescript
// Creates a simple workflow that processes messages through the model
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", CallModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// Each conversation gets a unique thread
const config = { configurable: { thread_id: uuidv4() } };
const output = await app.invoke({ messages: input }, config);
```

## Development

### Available Scripts

- `npm run dev` - Run cli-chat.ts in development mode with ts-node
- `npm run build` - Build TypeScript to JavaScript in ./dist
- `npm start` - Run the built application from dist/cli-chat.js
- `npm run watch` - Run with file watching using nodemon
- `tsc --noEmit` - Type check without building

### Architecture Notes

- Uses LangGraph's state-based workflow management
- Memory persistence through MemorySaver checkpointer
- CommonJS modules for Node.js compatibility
- Strict TypeScript configuration with source maps
- Environment variables loaded via dotenv
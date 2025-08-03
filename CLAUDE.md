# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Install dependencies**: `npm install`
- **Development mode**: `npm run dev` (runs `ts-node src/chat.ts`)
- **Build TypeScript**: `npm run build` or `tsc`
- **Run built application**: `npm start` (runs `node dist/chat.js`)
- **Watch mode with auto-restart**: `npm run watch` (uses nodemon)
- **Type check only**: `tsc --noEmit`
- **Test agent directly**: `npx ts-node src/agent.ts` or `npx tsx src/agent.ts`

## Project Architecture

This is a LangChain.js agent development environment built with TypeScript. Currently in early development stage with a simple two-file architecture intended to evolve into a full agent system.

### Current Implementation

- **`src/agent.ts`**: LangGraph workflow implementation using `ChatOllama` with `granite3.2:8b` model and pirate personality. Uses `StateGraph` with `MessagesAnnotation`, `MemorySaver` for persistence, and `ChatPromptTemplate` for system prompts. Connects to local Ollama instance (configurable via `OLLAMA_URL` env var, defaults to `http://localhost:11434`).

- **`src/chat.ts`**: Simple test harness that invokes the agent workflow with a hardcoded message and UUID-based thread configuration. Currently demonstrates basic agent invocation pattern.

### Target Architecture (To Be Implemented)

The project is designed to evolve into a full LangChain agent system with:
- `BasicAgent` class wrapping LangChain's `AgentExecutor`
- Terminal readline-based chat interface with commands (`quit`, `clear`, `help`)
- Built-in tools (echo, calculator) using LangChain's `DynamicTool` pattern
- `BufferMemory` for conversation history management
- Support for both Ollama (local) and OpenRouter (cloud) models

### Environment Configuration

**Required environment variables:**
- `OLLAMA_URL`: Ollama server endpoint (defaults to `http://localhost:11434`)
- `OPENROUTER_API_KEY`: For OpenRouter cloud models (when implemented)
- `LANGSMITH_API_KEY`: For LangSmith tracing and debugging
- `LANGSMITH_TRACING`: Enable/disable LangSmith tracing

### Development Notes

- Uses CommonJS modules (`"type": "commonjs"` in package.json)
- TypeScript strict mode enabled, compiled to `./dist` directory with source maps and declarations
- Primary development workflow uses `ts-node` for direct TypeScript execution
- LangSmith tracing is configured but may show 403 errors if credentials not properly set
- All async operations should use async/await pattern
- Current architecture uses LangGraph's `StateGraph` with `MessagesAnnotation` for state management
- Memory persistence handled by `MemorySaver` with thread-based configuration
- Environment variables loaded via `dotenv` package

### Current Implementation Details

- **Model**: Ollama with `granite3.2:8b` model (configured in agent.ts)
- **Temperature**: Set to 0.7 for balanced creativity/consistency
- **Max Retries**: Set to 2 for reliability
- **System Prompt**: Currently configured with pirate personality ("You are a helpful assistant ath talks like a pirate")
- **State Management**: Uses LangGraph's `MessagesAnnotation` for handling conversation state
- **Workflow**: Single-node graph that processes messages through the model
- **Threading**: Each conversation gets a unique thread ID via `uuidv4()`

## Development Guidance

The repository owner wants to handle all LangChain implementation coding personally for learning purposes. Claude should only assist with:
- Tool development and testing
- Repository management and configuration
- Non-LangChain utility code
- Documentation and setup
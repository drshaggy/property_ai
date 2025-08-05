# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Install dependencies**: `npm install`
- **Development mode**: `npm run dev` (runs `ts-node src/cli-chat.ts`)
- **Build TypeScript**: `npm run build` or `tsc`
- **Run built application**: `npm start` (runs `node dist/cli-chat.js`)
- **Watch mode with auto-restart**: `npm run watch` (uses nodemon)
- **Type check only**: `tsc --noEmit`
- **Test requirements agent**: `npx ts-node src/requirements-agent.ts`
- **Test custom agent**: `npx ts-node src/agent.ts`

## Project Architecture

This is a LangChain.js agent development environment built with TypeScript. Currently in early development stage with a simple two-file architecture intended to evolve into a full agent system.

### Current Implementation

- **`src/requirements-agent.ts`**: ReAct agent built with `createReactAgent` from LangGraph prebuilt. Uses `ChatOllama` with `granite3.2:8b` model, configured for estate agent requirements gathering. Includes `TavilySearch` tool for web searches and `MemorySaver` for conversation persistence.

- **`src/agent.ts`**: Custom LangGraph workflow using manual `StateGraph` construction with `ToolNode`. Demonstrates lower-level graph building with explicit tool integration and TavilySearch integration.

- **`src/workflow.ts`**: Workflow definition module that works with the agent system, defining StateGraph-based conversation flow.

- **`src/cli-chat.ts`**: Terminal-based chat interface that connects to the requirements agent, providing interactive conversation flow with the estate agent.

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
- `TAVILY_API_KEY`: For TavilySearch web search functionality
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

### Known Issues & Solutions

**Type Errors with TavilySearch and ToolNode:**
- Issue: "Type instantiation is excessively deep and possibly infinite" when using `TavilySearch` with `ToolNode`
- Root cause: Zod version compatibility issues between LangChain packages
- Solution: Added Zod version override in package.json:
  ```json
  "overrides": {
    "zod": "3.25.67"
  }
  ```
- Reference: [LangGraphJS Issue #1453](https://github.com/langchain-ai/langgraphjs/issues/1453)

### Current Implementation Details

- **Model**: Ollama with `granite3.2:8b` model 
- **Temperature**: Set to 0.7 for balanced creativity/consistency
- **Max Retries**: Set to 2 for reliability
- **Requirements Agent**: Estate agent personality for property requirement gathering
- **Tools**: TavilySearch for web search capabilities
- **State Management**: Uses LangGraph's `MessagesAnnotation` for handling conversation state
- **Workflows**: 
  - `createReactAgent`: Prebuilt ReAct agent (requirements-agent.ts)
  - Custom `StateGraph`: Manual graph construction (agent.ts)
  - StateGraph workflow definitions (workflow.ts)
- **Threading**: Each conversation gets a unique thread ID via `uuidv4()`

## Development Guidance

**CRITICAL: The repository owner wants to handle ALL LangChain and agent implementation coding personally for learning purposes.**

**Claude's Role: Teaching Assistant**
Instead of directly modifying LangChain/agent code, Claude should act as a knowledgeable teaching assistant, providing:
- Explanations of LangChain concepts, patterns, and best practices
- Guidance on debugging approaches and error interpretation
- Direction toward relevant documentation and examples
- Analysis of current implementation issues and potential solutions
- Code review insights and architectural suggestions
- Step-by-step learning guidance to help build understanding

**Claude MUST NOT:**
- Directly modify any LangChain/LangGraph code in `src/requirements-agent.ts`, `src/workflow.ts`, or related agent files
- Write or rewrite agent workflows, state management, or LangGraph configurations
- Implement ChatOllama model settings, system prompts, or agent behavior changes
- Code StateGraph workflow structures or MessagesAnnotation implementations
- Implement MemorySaver, threading, or conversation persistence logic
- Write tool definitions or agent executor configurations

**Claude MAY assist with:**
- Explaining LangChain errors, types, and expected patterns
- Teaching LangGraph concepts and workflow design principles
- Reviewing code for learning opportunities and best practices
- Pointing to relevant documentation and examples
- Non-LangChain utility functions and helper code
- CLI interface improvements (readline, user interaction)
- Repository configuration (package.json, tsconfig.json, environment setup)
- Documentation, setup instructions, and project organization
- General TypeScript/Node.js development tasks unrelated to the agent system
- Testing frameworks and test utilities (but not agent testing logic)

## Commit Guidelines

- Do not include any mention of Claude in the commit messages
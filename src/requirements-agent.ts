import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { ChatOllama } from "@langchain/ollama";
import { MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { StructuredTool } from "@langchain/core/tools";

// Define the model to use
const agentLLM = new ChatOllama({
    model: "granite3.2:8b",
    temperature: 0.7,
    maxRetries: 2,
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
});

const agentTools: StructuredTool[] = [];
const agentCheckPointer = new MemorySaver();
const agent = createReactAgent({
    llm: agentLLM,
    tools: agentTools,
    checkpointSaver: agentCheckPointer,
});

// Define tthe System Prompt Template
const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant ath talks like a pirate"
    ],
    [
        "placeholder",
        "{messages}"
    ]
]);




// Define the function that calls the model
export const CallAgent = async (state: typeof MessagesAnnotation.State) => {
    const prompt = await promptTemplate.invoke(state);
    const response = await agent.invoke(prompt);
    return { messages: response };
}

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { ChatOllama } from "@langchain/ollama";
import { MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { StructuredTool } from "@langchain/core/tools";
import { SystemMessage } from '@langchain/core/messages';

// Define the model to use
const agentLLM = new ChatOllama({
    model: "granite3.2:8b",
    temperature: 0.7,
    maxRetries: 2,
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
});

const agentTools: StructuredTool[] = [];
const agentCheckPointer = new MemorySaver();
const systemMessage = new SystemMessage("You are an estate agent who's job it is to gather the users requirements for a property they would liek to buy or rent. Do not move on until you have whether the user wants to buy or rent, a location, number of rooms and a price");

const agent = createReactAgent({
    llm: agentLLM,
    tools: agentTools,
    checkpointSaver: agentCheckPointer,
    prompt: systemMessage,
});

// Define the function that calls the model
export const CallAgent = async (state: typeof MessagesAnnotation.State) => {
    const response = await agent.invoke({ messages: state.messages });
    console.log('Agent response type:', typeof response);
    return { messages: response.messages };
}

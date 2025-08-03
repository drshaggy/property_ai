import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { ChatOllama } from "@langchain/ollama";
import { MessagesAnnotation } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the model to use
const llm = new ChatOllama({
    model: "granite3.2:8b",
    temperature: 0.7,
    maxRetries: 2,
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
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
export const CallModel = async (state: typeof MessagesAnnotation.State) => {
    const prompt = await promptTemplate.invoke(state);
    const response = await llm.invoke(prompt);
    return { messages: response };
}

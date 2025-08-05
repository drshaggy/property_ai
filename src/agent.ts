import { TavilySearch } from "@langchain/tavily";
import { ChatOllama } from "@langchain/ollama";
import { MessagesAnnotation, START, END, StateGraph, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { config as dotenvConfig } from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";

dotenvConfig();

const tavilyTool = new TavilySearch({ maxResults: 3, topic: "general" });
const tools = [tavilyTool];
const toolNode: ToolNode = new ToolNode(tools);

const llama = new ChatOllama({
    model: "llama3.1:8b",
    temperature: 0.7,
    maxRetries: 2,
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
});

const granite = new ChatOllama({
    model: "granite3.2:8b",
    temperature: 0.7,
    maxRetries: 2,
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
});

const chat = new ChatOpenAI(
    {
        model: 'openai/gpt-4.1-mini',
        temperature: 0.7,
        streaming: true,
        configuration: {
            baseURL: 'https://openrouter.ai/api/v1',
        }
    },
);

const tooledModel = chat.bindTools(tools);


async function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;
    console.log(lastMessage);
    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    return END;
}

async function callAgent(state: typeof MessagesAnnotation.State) {
    const response = await tooledModel.invoke(state.messages);
    return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callAgent)
    .addEdge(START, "agent")
    .addNode("tools", toolNode)
    .addEdge("agent", "tools")
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue)

export const requirementAgent = workflow.compile();





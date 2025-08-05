import { config as dotenvConfig } from 'dotenv';
import { ChatOllama } from "@langchain/ollama";
import { MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { StructuredTool } from "@langchain/core/tools";
import { SystemMessage } from '@langchain/core/messages';
import { TavilySearch } from "@langchain/tavily";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from '@langchain/openai';

dotenvConfig();

// Define the model to use
const llama = new ChatOllama({
    model: "llama3.1:8b",
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

const searchTool = new TavilySearch({ maxResults: 3, topic: "general" })
const agentTools = [searchTool];
const noTools: StructuredTool[] = [];
const agentCheckPointer = new MemorySaver();
const systemMessage = "You are an estate agent who's job it is to gather the users requirements for a property they would liek to buy or rent. Do not move on until you have whether the user wants to buy or rent, a location, number of rooms and a price.";
const testMessage = "You are a helpful assitant with these tools available to help solve the query {tools}";
const reactPrompt = new SystemMessage(`Answer the following questions as best you can. 
  You have access to the following tools:

  {tools}

  Use the following format:

  Question: the input question you must answer
  Thought: you should always think about what to do
  Action: the action to take, should be one of [{tool_names}]
  Action Input: the input to the action
  Observation: the result of the action
  ... (this Thought/Action/Action Input/Observation can repeat N times)
  Thought: I now know the final answer
  Final Answer: the final answer to the original input question

  Begin!

  Question: {input}
  Thought: {agent_scratchpad}`);

const agent = createReactAgent({
    llm: chat,
    tools: agentTools,
    checkpointSaver: agentCheckPointer,
    prompt: reactPrompt,
});

// Define the function that calls the model
export const CallAgent = async (state: typeof MessagesAnnotation.State) => {
    const response = await agent.invoke({ messages: state.messages });
    return { messages: response.messages };
}

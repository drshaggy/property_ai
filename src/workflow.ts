import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import { requirementAgent } from './agent';

// Defines the state graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", requirementAgent)
    .addEdge(START, "agent")
    .addEdge("agent", END);

// add memory
const memory = new MemorySaver();
export const app = workflow.compile({ checkpointer: memory });
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import { CallAgent } from './requirements-agent';

// Defines the state graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", CallAgent)
    .addEdge(START, "model")
    .addEdge("model", END);

// add memory
const memory = new MemorySaver();
export const app = workflow.compile({ checkpointer: memory });
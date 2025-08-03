import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import { CallModel } from './requirements-agent';

// Defines the state graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", CallModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// add memory
const memory = new MemorySaver();
export const app = workflow.compile({ checkpointer: memory });
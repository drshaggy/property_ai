"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llm = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ollama_1 = require("@langchain/ollama");
exports.llm = new ollama_1.ChatOllama({
    model: "granite3.2:8b",
    temperature: 0.7,
    maxRetries: 2,
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
});
//# sourceMappingURL=agent.js.map
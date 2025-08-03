"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
async function testAgent() {
    const aiMsg = await agent_1.llm.invoke([
        [
            "system",
            "You are a helpful assistant that translates English to French. Translate the user sentence.",
        ],
        ["human", "I love programming."],
    ]);
    console.log(aiMsg);
}
testAgent().catch(console.error);
//# sourceMappingURL=chat.js.map
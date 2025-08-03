import { app } from './workflow';
import { v4 as uuidv4 } from "uuid";

const input = [
    {
        role: "user",
        content: "Hello how are you?"
    }
]

// define config
const config = { configurable: { thread_id: uuidv4() } };

async function chat() {
    const output = await app.invoke({ messages: input }, config);
    console.log(output.messages[output.messages.length - 1]);
}

chat().catch(console.error);
import { app } from './workflow';
import { v4 as uuidv4 } from "uuid";
import readline from "readline";
import { AIMessage } from '@langchain/core/messages';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const messages: { role: string, content: string }[] = []

// define config

function promptUser(): Promise<string> {
    return new Promise((resolve) => {
        rl.question("> ", resolve);
    });
}

async function main() {
    const thread_id = uuidv4();
    while (true) {
        const userInput = await promptUser();

        if (userInput === "exit") {
            rl.close();
            break;
        }
        messages.push({ role: 'user', content: userInput });
        const config = { configurable: { thread_id: thread_id } };
        const output = await app.invoke({ messages }, config);
        const reply = output.messages[output.messages.length - 1].content;

        console.log("> ", reply);
        messages.push({ role: 'assistant', content: reply.toString() });

    }
}
main();
import { useSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { data } = req.body;

    if (!data) {
        return res.status(400).json({ error: "Please provide data." });
    }

    try {
        const list = await openai.beta.assistants.list();
        const assistant = list.data.filter((assistant) => assistant.name === data.assistant)[0];

        if (!assistant) {
            throw new Error("Assistant not found. Please contact support.");
        }

        let thread = null;
        let save_thread = false;

        if (!data.thread_id) {
            // create a new thread
            save_thread = true;
            thread = await openai.beta.threads.create();
        } else {
            // get the thread
            thread = await openai.beta.threads.retrieve(data.thread_id);
        }

        let lastMessageIdBeforeRun = 0;
        const lastMessageBeforeRun = await openai.beta.threads.messages.list(thread.id, { order: "desc", limit: 1 });
        if (lastMessageBeforeRun && lastMessageBeforeRun.data.length > 0) {
            lastMessageIdBeforeRun = lastMessageBeforeRun.data[0].id;

            console.log('Last message before run:', lastMessageBeforeRun);
            console.log('Last message ID before run:' + lastMessageIdBeforeRun);
        }

        // create a new message in the thread
        const message = await openai.beta.threads.messages.create(
            thread.id, 
            { role: "user", content: data.message }
        );
        if (message.error) return res.status(400).json({ error: message.error });

        // create a new run
        let run = await openai.beta.threads.runs.create(
            thread.id, { assistant_id: assistant.id }
        );
        
        while (run.status === "in_progress" || run.status === "queued") {
            await new Promise((resolve) => setTimeout(resolve, 500));
            run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (run.status === "failed") {
            return res.status(400).json({ error: run.error });
        }

        // send the response back
        let messages = null;
        if (lastMessageIdBeforeRun > 0) {
            messages = await openai.beta.threads.messages.list(thread.id, { after: lastMessageIdBeforeRun, limit: 1 });
        } else {
            messages = await openai.beta.threads.messages.list(thread.id, { order: "desc", limit: 1 });
        }

        console.log('Messages:', messages);

        return res.status(200).json({ assistant: assistant, thread: thread, run: run, messages: messages, save_thread: save_thread });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
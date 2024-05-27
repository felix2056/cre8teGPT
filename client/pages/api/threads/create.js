import { useSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

import axios from 'axios'
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: "Please provide data." });
        }

        try {
            const assistants = await openai.beta.assistants.list();
            const assistant = assistants.data.filter((assistant) => assistant.name === data.assistant);

            if (!assistant || assistant.length === 0) {
                return res.status(400).json({ error: "Assistant not found. Please contact support." });
            }

            let thread = null;
            let save_thread = false;

            if (!data.thread_id) {
                // create a new thread
                save_thread = true;
                thread = await openai.beta.threads.create();
                const run = await openai.beta.threads.runs.create(
                    thread.id, { assistant_id: assistant.id }
                );
            } else {
                // get the thread
                thread = await openai.beta.threads.retrieve(data.thread_id);
            }

            // create a new message in the thread
            const message = await openai.beta.threads.messages.create(
                thread.id, { role: "user", content: data.message }
            );

            if (message.error) {
                return res.status(400).json({ error: message.error });
            }

            res.status(200).json({ thread: thread, message: message, save_thread: save_thread });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
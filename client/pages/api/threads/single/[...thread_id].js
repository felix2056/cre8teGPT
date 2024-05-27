import { useSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { thread_id } = req.query;

        if (!thread_id) {
            return res.status(400).json({ error: "Please provide a thread ID." });
        }

        try {
            const thread = await openai.beta.threads.retrieve(thread_id);
            if (!thread) {
                return res.status(400).json({ error: "Thread not found. Please contact support." });
            }

            const messages = await openai.beta.threads.messages.list(thread.id, { order: "asc" });
            res.status(200).json({ thread: thread, messages: messages });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
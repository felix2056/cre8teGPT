import { useSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

import axios from 'axios'
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { parameters } = req.body;

        if (!parameters) {
            return res.status(400).json({ error: "Please provide parameters." });
        }

        try {
            let assistant = null;

            // check if the assistant already exists where the name is the same
            const assistants = await openai.beta.assistants.list();
            const assistant_exists = assistants.data.filter((assistant) => assistant.name === parameters.name);
            
            if (assistant_exists.length > 0) {
                assistant = assistant_exists[0];
            } else {
                assistant = await openai.beta.assistants.create({
                    name: parameters.name,
                    instructions: parameters.instructions,
                    tools: parameters.tools,
                    model: parameters.model,
                });
            }

            res.status(200).json({ assistant: assistant });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
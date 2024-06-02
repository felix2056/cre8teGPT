import fs from "fs";
import path from "path";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const speechFile = path.join(process.cwd(), "public", "audio", "speech.mp3");

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: "Please provide data." });
        }

        if (data.language) {
            data.input += `\n\n Use ${data.language} language and accent for the speech.`;
        }
        
        try {
            const mp3 = await openai.audio.speech.create({
                model: data.model || "tts-1",
                voice: data.voice || "alloy",
                input: data.input,
            });

            console.log(speechFile);
            const buffer = Buffer.from(await mp3.arrayBuffer());
            await fs.promises.writeFile(speechFile, buffer);

            res.status(200).json({ audio: `/audio/speech.mp3` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
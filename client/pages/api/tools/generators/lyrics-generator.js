import { getSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    const session = await getSession({ req });

    // if (!session) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }

    if (req.method === "POST") {
        const { data } = req.body;

        try {
            // prompt = `Write a ${data.genre} song about ${data.theme}. Use a ${data.mood} tone. The song should have the following structure: ${data.structure}. Include these keywords: ${data.keywords}. Write from a ${data.perspective} perspective. Use ${data.pronouns} pronouns. The target audience is ${data.audience}. Make it similar to the style of ${data.style_inspiration}. Additional details: ${data.special_requests}.`;

            let prompt = `Write a `
            if (data.genre) prompt += `${data.genre} `
            prompt += `song about ${data.theme}. `
            if (data.mood) prompt += `Use a ${data.mood} tone. `
            if (data.structure) prompt += `The song should have the following structure: ${data.structure}. `
            if (data.keywords) prompt += `Include these keywords: ${data.keywords}. `
            if (data.perspective) prompt += `Write from a ${data.perspective} perspective. `
            if (data.pronouns) prompt += `Use ${data.pronouns} pronouns. `
            if (data.audience) prompt += `The target audience is ${data.audience}. `
            if (data.style_inspiration) prompt += `Make it similar to the style of ${data.style_inspiration}. `
            if (data.special_requests) prompt += `Additional details: ${data.special_requests}. `

            console.log("Prompt:", prompt);

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });
    
            const lyrics = response.choices[0].message.content;
            res.status(200).json({ lyrics });
        } catch (error) {
            console.error("Error generating lyrics:", error);
            res.status(500).json({ error: "Error generating lyrics" });
        } 
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
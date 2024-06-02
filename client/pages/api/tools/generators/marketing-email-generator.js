import { getSession } from "next-auth/react";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { data } = req.body;

    try {
        const prompt = `Write a marketing email for a product named ${data.productName}. 
        The product description is: ${data.description}. 
        The goal of the email is: ${data.goal}. 
        The target audience is: ${data.audience}.`;

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

        if (response.choices && response.choices.length > 0) {
            const email = response.choices[0].message.content;
            return res.status(200).json({ email });
        } else {
            throw new Error("No response from OpenAI API");
        }
    } catch (error) {
        console.error("Error generating email:", error);
        res.status(500).json({ error: "Error generating email", details: error.message });
    }
}

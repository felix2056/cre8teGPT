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
        let prompt = `Write an ad copy for a product named ${data.productName}.`;
        if (data.description) prompt += `The product description is: ${data.description}.`;
        if (data.usp) prompt += `The unique selling proposition is: ${data.usp}.`;
        if (data.cta) prompt += `The goal of the ad is: ${data.cta}.`;
        if (data.targetAudience) prompt += `The target audience is: ${data.targetAudience}.`;
        if (data.platform) prompt += `The ad will be published on ${data.platform}.`;
        if (data.tone) prompt += `The tone of the ad should be ${data.tone}.`;
        if (data.specialOffers) prompt += `Special offers: ${data.specialOffers}.`;
        if (data.keywords) prompt += `Keywords: ${data.keywords}.`;
        if (data.additionalDetails) prompt += `Additional details: ${data.additionalDetails}.`;

        prompt += `The ad should be generated in this format: "Headline: [Your headline here] Description: [Your description here]"`;

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
            const adCopy = response.choices[0].message.content;

            // put the ad copy in an object to match the provided format
            let headline = adCopy.split("Description:")[0].trim();
            let description = adCopy.split("Description:")[1].trim();

            // strip out the "Headline: " and "Description: " prefixes
            headline = headline.replace("Headline: ", "");
            description = description.replace("Description: ", "");
            
            const adCopyObject = { headline, description, cta: data.cta, platform: data.platform };
            return res.status(200).json({ adCopy: adCopyObject });
        } else {
            throw new Error("No response from OpenAI API");
        }
    } catch (error) {
        console.error("Error generating ad copy:", error);
        res.status(500).json({ error: "Error generating ad copy", details: error.message });
    }
}

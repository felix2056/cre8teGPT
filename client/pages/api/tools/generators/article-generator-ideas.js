import { getSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { structure } = req.body;

  try {
    if (!structure) {
      throw new Error("Structure is required");
    }

    const ideas = await getSeoStructureIdeas(structure);
    return res.status(200).json({ ideas });
  } catch (error) {
    console.error("Error extracting domain keywords ideas:", error);
    res.status(500).json({ title: "Error extracting domain keywords ideas", message: error.message });
  }
}

async function getSeoStructureIdeas(structure) {
  let prompt = `Given the below keyword structure, generate 10 comma-separated relevant ideas that can serve as the correct value for the variable wrapped with {}.`;
  
  prompt += `\n\nFor example, for the keyword structure "how to book an appointment with {professional} online?", generate 10 structures similar to these:`;
  prompt += `\ndoctor, dentist, lawyer, accountant, therapist, consultant, coach, tutor, stylist, trainer`;
  prompt += `\n\nDo not list the results, make them comma-separated and make sure each one is accurate to the structure variable that is wrapped with {}.`;
  prompt += `\n\nBelow is the keyword structure to work with:`;
  prompt += `\n"Keyword Structure: ${structure}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const ideas = [];
  if (response.choices && response.choices.length > 0) {
    response.choices[0].message.content.split(',').forEach(idea => {
        ideas.push(idea.trim());
    });
  }

  return ideas;
}

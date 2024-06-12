import { getSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { keyword, domain } = req.body;

  try {
    if (!keyword) {
      throw new Error("Keyword is required");
    }

    const structures = await getSeoKeywordStructures(keyword, domain);
    return res.status(200).json({ structures });
  } catch (error) {
    console.error("Error extracting domain keyword structures:", error);
    res.status(500).json({ title: "Error extracting domain keyword structures", message: error.message });
  }
}

async function getSeoKeywordStructures(keyword, domain) {
  let prompt;
  
  prompt = `Develop 10 comma-separated search-friendly keyword structures that incorporate relevant variables. Think about the different ways users might search for information related to the target keyword, and use those variations to create keyword phrases that will help their content rank well in search engines.`;
  
  if (domain) {
    prompt = `Develop 10 comma-separated search-friendly keyword structures that incorporate relevant variables. Think about the different ways users might search for information related to the target keyword for the website: ${domain}, and use those variations to create keyword phrases that will help ${domain} content rank well in search engines.`;
  }
  
  prompt += `\n\nFor example, for the keyword "online appointment", generate 10 structures similar to these:`;
  prompt += `\nhow to book an appointment with {professional} online?, how do I cancel an online appointment with {professional}?, what is the cost of an online appointment with {professional}?`;
  prompt += `\n\nDo not list the results, make them comma-separated and make each one have a relevant variable wrapped with {}.`;
  prompt += `\n\nBelow is the keyword to work with:`;
  prompt += `\n"Keyword: ${keyword}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const structures = [];
  if (response.choices && response.choices.length > 0) {
    response.choices[0].message.content.split(',').forEach(structure => {
      structures.push(structure.trim());
    });
  }

  return structures;
}

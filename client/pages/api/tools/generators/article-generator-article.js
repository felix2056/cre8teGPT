import { getSession } from "next-auth/react";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { title, domain } = req.body;

  try {
    if (!title) {
      throw new Error("Title is required");
    }

    const article = await getSeoArticle(title, domain);
    return res.status(200).json({ article });
  } catch (error) {
    console.error("Error generating SEO article:", error);
    res.status(500).json({ title: "Error generating SEO article", message: error.message });
  }
}

async function getSeoArticle(title, domain) {
    let prompt;

    prompt = `Write a 500-word SEO article about ${title}. The article should be informative, engaging, and optimized for search engines. Include relevant keywords, phrases, and topics that will help the article rank well in search results.`;

    if (domain) {
        let prompt = `Write a 500-word SEO article about ${title} that is relevant to the website: ${domain}. The article should be informative, engaging, and optimized for search engines. Include relevant keywords, phrases, and topics that will help the article rank well in search results.`;
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
        {
            role: "user",
            content: prompt,
        },
        ],
    });

    let article = "";
    if (response.choices && response.choices.length > 0) {
        article = response.choices[0].message.content;
    }

    return article;
}

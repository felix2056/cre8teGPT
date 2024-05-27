import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { ingredients } = req.body;

        if (!ingredients) {
            return res.status(400).json({ error: "Please provide a list of ingredients." });
        }

        // parse ingredients into a list
        const ingredientList = ingredients.split(",");
        
        try {
            
            let message = "I have limited ingredients and don't know what to cook. Help me suggest multiple delicious dishes with detailed instructions on how to prepare them based on my available ingredients listed below.";
            message += "\n\n- " + ingredientList.join("\n- ");
            message += "\n\n---";

            // templating the response
            message += "Your output should follow the following template:";
            message += "\n\n<div class='recipe_wrapper'>";
            message += "\n  <h3 class='recipe_title'>Recipe Title</h3>";
            message += "\n  <p class='recipe_description'>Recipe Description</p>";
            message += "\n  <ul class='recipe_ingredients'>";
            message += "\n    <li>Ingredient 1</li>";
            message += "\n    <li>Ingredient 2</li>";
            message += "\n    <li>Ingredient 3</li>";
            message += "\n  </ul>";
            message += "\n  <ol class='recipe_steps'>";
            message += "\n    <li>Step 1: Step description</li>";
            message += "\n    <li>Step 2: Step description</li>";
            message += "\n    <li>Step 3: Step description</li>";
            message += "\n  </ol>";
            message += "\n</div>";

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
            });

            // return res.status(200).json(response);

            res.status(200).json({ response: await parseRecipeResponse(response.choices[0].message.content) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function parseRecipeResponse(response) {
    // Split the response string into individual recipe sections
    const recipeSections = response.split("<div class='recipe_wrapper'>").slice(1);

    // Parse each recipe section and format it into an object
    const recipes = await Promise.all(recipeSections.map(async (section) => {
        // Extract title
        const title = section.match(/<h3 class='recipe_title'>(.*?)<\/h3>/)[1];

        // Extract description
        const description = section.match(/<p class='recipe_description'>(.*?)<\/p>/)[1];

        // Extract ingredients list
        const ingredientsMatch = section.match(/<ul class='recipe_ingredients'>(.*?)<\/ul>/s);
        const ingredientsList = ingredientsMatch[1].match(/<li>(.*?)<\/li>/g);
        const ingredients = ingredientsList.map(ingredient => ingredient.match(/<li>(.*?)<\/li>/)[1]);

        // Extract steps list
        const stepsMatch = section.match(/<ol class='recipe_steps'>(.*?)<\/ol>/s);
        const stepsList = stepsMatch[1].match(/<li>(.*?)<\/li>/g);
        const steps = stepsList.map(step => step.match(/<li>(.*?)<\/li>/)[1]);
        
        // fetch image from the google search api
        const image = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${title}&searchType=image&num=1`)
            .then(res => res.json())
            .then(data => data.items[0].link)
            .catch(err => console.log(err));

        // Create recipe object
        return {
            title,
            description,
            ingredients,
            steps,
            image,
        };
    }));
}
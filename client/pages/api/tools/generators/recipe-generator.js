import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { ingredients } = req.body;
        
    try {
        if (!ingredients) {
            throw new Error("Ingredients list is required");
        }

        const recipes = await getRecipes(ingredients);
        return res.status(200).json({ recipes });
    } catch (error) {
        console.error("Error generating recipe:", error);
        res.status(500).json({ title: "Error generating recipe", message: error.message });
    } 
}

async function getRecipes(ingredients) {
    let ingredientCount = ingredients.split(',').length;

    let prompt = `I'm facing a bit of a cooking dilemma! I have a limited selection of ingredients and I'm unsure what to make. Could you please suggest more than 3 mouth-watering dishes that I can prepare using the below ingredients I have on hand? I'd love it if you could provide detailed, step-by-step instructions for each recipe.`;
    prompt += `\n\nHere are the ingredients I have available:`;
    prompt += `\n${ingredients}`;

    prompt += `\n\nYour output must follow the following format:`;
    prompt += `\n<div class="recipe_wrapper">`;
        prompt += `\n<h3 class="recipe_title">[Recipe Title]</h3>`;
        prompt += `\n<p class="recipe_description">[Recipe Description]</p>`;
        prompt += `\n<p class="recipe_difficulty">[Recipe Difficulty]</p>`;
        prompt += `\n<p class="recipe_servings">[Recipe Servings]</p>`;
        
        prompt += `\n<ul class="recipe_ingredients">`;
        for (let i = 0; i < ingredientCount; i++) {
            prompt += `\n<li>[Ingredient ${i + 1}]</li>`;
        }
        prompt += `\n</ul>`;

        prompt += `\n<ul class="recipe_nutritional_info">`;
        prompt += `\n<li>[Calories]</li>`;
        prompt += `\n<li>[Fat]</li>`;
        prompt += `\n<li>[Carbs]</li>`;
        prompt += `\n<li>[Protein]</li>`;
        prompt += `\n</ul>`;

        prompt += `\n<ol class="recipe_steps">`;
        for (let i = 1; i <= Math.floor(Math.random() * 5) + 2; i++) {
            prompt += `\n<li>[Step ${i} Instructions]</li>`;
        }
        prompt += `\n</ol>`;
    prompt += `\n</div>`;

    // console.log("Prompt:", prompt);

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a chef assistant. Your task is to suggest multiple delicious dishes with detailed instructions on how to prepare them based on the available ingredients provided by the user. You should always provide at least two to three recipes and always format your output in the given format.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    // console.log(response.choices[0].message.content);

    const recipes = await parseRecipeResponse(response.choices[0].message.content);
    console.log(recipes);
    return recipes;
}

async function parseRecipeResponse(response) {
    // split the response string into individual recipe sections
    const recipeSections = response.split('<div class="recipe_wrapper">').slice(1);

    if (!recipeSections || recipeSections.length === 0) {
        throw new Error("No recipes found in response");
    }

    // parse each recipe section and format it into an object
    const recipes = await Promise.all(recipeSections.map(async (section) => {
        // extract title
        const title = section.match(/<h3 class="recipe_title">(.*?)<\/h3>/)[1];
        console.log("Title:", title);

        // extract description
        const description = section.match(/<p class="recipe_description">(.*?)<\/p>/)[1];
        console.log("Description:", description);

        // extract difficulty
        const difficulty = section.match(/<p class="recipe_difficulty">(.*?)<\/p>/)[1];
        console.log("Difficulty:", difficulty);

        // extract servings
        const servings = section.match(/<p class="recipe_servings">(.*?)<\/p>/)[1];
        console.log("Servings:", servings);

        // extract ingredients list
        const ingredientsMatch = section.match(/<ul class="recipe_ingredients">(.*?)<\/ul>/s);
        const ingredientsList = ingredientsMatch[1].match(/<li>(.*?)<\/li>/g);
        const ingredients = ingredientsList.map(ingredient => ingredient.match(/<li>(.*?)<\/li>/)[1]);
        console.log("Ingredients:", ingredients);

        // extract nutritional info
        const nutritionalInfoMatch = section.match(/<ul class="recipe_nutritional_info">(.*?)<\/ul>/s);
        const nutritionalInfoList = nutritionalInfoMatch[1].match(/<li>(.*?)<\/li>/g);
        const nutrients = nutritionalInfoList.map(info => info.match(/<li>(.*?)<\/li>/)[1]);
        console.log("Nutritional Info:", nutrients);

        // extract steps list
        const stepsMatch = section.match(/<ol class="recipe_steps">(.*?)<\/ol>/s);
        const stepsList = stepsMatch[1].match(/<li>(.*?)<\/li>/g);
        const steps = stepsList.map(step => step.match(/<li>(.*?)<\/li>/)[1]);
        console.log("Steps:", steps);

        // fetch image from the google search api
        const image = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${title}&searchType=image&num=1`)
            .then(res => res.json())
            .then(data => data.items[0].link)
            .catch(err => console.log(err));
        await new Promise(r => setTimeout(r, 1000)); // delay to avoid rate limiting
        console.log("Image:", image);

        return { title, description, difficulty, servings, ingredients, nutrients, steps, image };
    }));

    return recipes;
}
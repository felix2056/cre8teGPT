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

// [
//     {
//         "title": "Beef and Bean Chili",
//         "description": "A hearty and flavorful chili that is perfect for a cozy night in.",
//         "ingredients": [
//             "1 lb beef, cubed",
//             "1 onion, diced",
//             "1 can of beans, drained and rinsed"
//         ],
//         "steps": [
//             "Step 1: In a large pot, brown the beef over medium heat.",
//             "Step 2: Add the diced onions and cook until they are translucent.",
//             "Step 3: Stir in the beans and any additional seasonings (such as chili powder, cumin, and paprika) and simmer for 20-30 minutes."
//         ],
//         "image": "https://assets.epicurious.com/photos/578d20a00103fcdb27360fe8/master/pass/beef-and-bean-chili.jpg"
//     },
//     {
//         "title": "Beef and Bean Burritos",
//         "description": "A simple and delicious meal that the whole family will love.",
//         "ingredients": [
//             "1 lb beef, cooked and shredded",
//             "1 onion, diced",
//             "1 can of beans, drained and rinsed",
//             "Tortillas"
//         ],
//         "steps": [
//             "Step 1: Heat the tortillas in a skillet or microwave.",
//             "Step 2: Fill each tortilla with beef, onions, and beans.",
//             "Step 3: Roll up the tortillas and serve with your favorite toppings (such as salsa, cheese, and avocado)."
//         ],
//         "image": "https://www.thespruceeats.com/thmb/Cg945UW4HaqDtMigGILsCMok_DA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/beef-and-bean-burritos-3057244-hero-01-19b9e15579e74f04ad5de73d0ac47ed9.jpg"
//     }
// ]

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
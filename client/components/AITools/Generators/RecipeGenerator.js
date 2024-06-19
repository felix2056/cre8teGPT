import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import Separator from "@/pages/separator";
import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const RecipeGenerator = () => {
    const { data: session } = useSession();
    const router = useRouter();

    let [isLoading, setIsLoading] = useState(false);
    let [recipes, setRecipes] = useState([]);

    const testimonials = [
        {
            id: 1,
            name: "Sarah M.",
            title: "Busy Professional",
            stars: 5,
            review: "Cre8teGPT turned my leftovers into a gourmet meal! It's a game-changer for my kitchen",
            image: "/images/testimonials/sarah.jpg",
        },
        {
            id: 2,
            name: "Tom R.",
            title: "College Student",
            stars: 5,
            review: "I love how it suggests recipes based on what I already have. No more last-minute grocery runs!",
            image: "/images/testimonials/tom.jpg",
        },
        {
            id: 3,
            name: "Lina S.",
            title: "Food Enthusiast",
            stars: 5,
            review: "The variety of recipes is amazing! I’ve tried dishes from cuisines I never thought I could cook.",
            image: "/images/testimonials/lina.jpg",
        },
        {
            id: 4,
            name: "Karen D.",
            title: "Budget-Conscious Mom",
            stars: 5,
            review: "I’m saving so much money by using up ingredients instead of letting them go to waste.",
            image: "/images/testimonials/karen.jpg",
        },
        {
            id: 5,
            name: "Jason P.",
            title: "Aspiring Chef",
            stars: 5,
            review: "The step-by-step instructions are so clear. Even as a beginner, I’m cooking like a pro!",
            image: "/images/testimonials/jason.jpg",
        },
        {
            id: 6,
            name: "Emily J.",
            title: "Fitness Enthusiast",
            stars: 5,
            review: "The nutritional information helps me keep track of what I’m eating. It’s perfect for my diet plans.",
            image: "/images/testimonials/emily.jpg",
        },
        {
            id: 7,
            name: "David K.",
            title: "Home Cook",
            stars: 5,
            review: "I never knew I could make such delicious meals with what’s in my pantry. Cre8teGPT is incredible!",
            image: "/images/testimonials/david.jpg",
        },
        {
            id: 8,
            name: "Michelle A.",
            title: "Creative Cook",
            stars: 5,
            review: "The ingredient substitution suggestions are so helpful. I can always find a way to make a recipe work.",
            image: "/images/testimonials/michelle.jpg",
        },
        {
            id: 9,
            name: "Chris L.",
            title: "Tech-Savvy Homeowner",
            stars: 5,
            review: "It’s like having a personal chef who knows exactly what’s in my kitchen. Love it!",
            image: "/images/testimonials/chris.jpg",
        },
        {
            id: 10,
            name: "Nancy W.",
            title: "Busy Parent",
            stars: 5,
            review: "Meal planning has never been easier. I can organize my week’s menu in minutes.",
            image: "/images/testimonials/nancy.jpg",
        },
        {
            id: 11,
            name: "Sam T.",
            title: "Cooking Hobbyist",
            stars: 5,
            review: "The cooking tips and tricks have improved my skills so much. I’m more confident in the kitchen now.",
            image: "/images/testimonials/sam.jpg",
        },
        {
            id: 12,
            name: "Alex B.",
            title: "Social Foodie",
            stars: 5,
            review: "Sharing my culinary creations with friends has been so fun. They’re always impressed!",
            image: "/images/testimonials/alex.jpg",
        },
        {
            id: 13,
            name: "Rachel H.",
            title: "Vegan Cook",
            stars: 5,
            review: "I love how it tailors recipes to my dietary needs. It’s perfect for my vegan lifestyle.",
            image: "/images/testimonials/rachel.jpg",
        },
        {
            id: 14,
            name: "George F.",
            title: "Adventurous Eater",
            stars: 5,
            review: "I’ve discovered so many new dishes thanks to Cre8teGPT. It keeps meal times exciting!",
            image: "/images/testimonials/george.jpg",
        },
        {
            id: 15,
            name: "Olivia G.",
            title: "Perfectionist Chef",
            stars: 5,
            review: "The real-time feedback helps me adjust recipes perfectly. My cooking has never been better.",
            image: "/images/testimonials/olivia.jpg",
        },
        {
            id: 16,
            name: "Tony C.",
            title: "Working Dad",
            stars: 5,
            review: "It’s a lifesaver on busy nights. I can quickly find a recipe and get dinner on the table fast.",
            image: "/images/testimonials/tony.jpg",
        },
        {
            id: 17,
            name: "Lisa P.",
            title: "Personalized Cooking Fan",
            stars: 5,
            review: "The personalization features are fantastic. Every recipe feels made just for me.",
            image: "/images/testimonials/lisa.jpg",
        },
        {
            id: 18,
            name: "Brenda M.",
            title: "Eco-Conscious Cook",
            stars: 5,
            review: "I’ve cut down on food waste significantly. It’s great for the environment and my wallet.",
            image: "/images/testimonials/brenda.jpg",
        },
        {
            id: 19,
            name: "John H.",
            title: "Family Chef",
            stars: 5,
            review: "Cooking for my family has become so much easier. Everyone loves the new dishes I’m making.",
            image: "/images/testimonials/john.jpg",
        },
        {
            id: 20,
            name: "Sophia K.",
            title: "Culinary Explorer",
            stars: 5,
            review: "I never get bored with meals anymore. Cre8teGPT always has something new and delicious to try.",
            image: "/images/testimonials/sophia.jpg",
        },
    ];

    const faqs = [
        {
            id: 1,
            question: "How does the recipe generator work?",
            answer: "The Recipe Generator uses AI to suggest recipes based on the ingredients you input. Simply enter what you have on hand, and it will provide a variety of dishes you can make.",
        },
        {
            id: 2,
            question: "What kind of recipes can I expect?",
            answer: "The Recipe Generator can suggest a wide variety of dishes, including appetizers, main courses, side dishes, desserts, and more. You can expect to find recipes from a range of cuisines, dietary preferences, and cooking styles.",
        },
        {
            id: 3,
            question: "Can I customize the suggested recipes?",
            answer: "Yes, you can customize recipes by adjusting serving sizes, swapping ingredients, and modifying steps to suit your preferences and dietary needs.",
        },
        {
            id: 4,
            question: "Are the recipes easy to follow?",
            answer: "Absolutely! Each recipe comes with detailed, step-by-step instructions that are easy to follow, even for beginners. The recipes also include cooking tips, ingredient substitutions, and nutritional information to help you cook with confidence.",
        },
        {
            id: 5,
            question: "Does the Recipe Generator provide nutritional information?",
            answer: "Yes, each recipe includes detailed nutritional information, helping you make informed dietary choices and track your nutritional intake.",
        },
        {
            id: 6,
            question: "What if I'm missing an ingredient for a recipe?",
            answer: "The Recipe Generator offers smart substitution suggestions for common ingredients, ensuring you can still create delicious dishes even if you're missing something.",
        },
        // {
        //     id: 7,
        //     question: "Is there a way to save my favorite recipes?",
        //     answer: "Absolutely! You can save your favorite recipes to your personal cookbook for easy access anytime.",
        // },
        // {
        //     id: 8,
        //     question: "Can the Recipe Generator accommodate dietary restrictions?",
        //     answer: "Yes, the Recipe Generator can suggest recipes based on various dietary restrictions, including vegan, vegetarian, gluten-free, and more.",
        // },
        {
            id: 9,
            question: "How accurate are the ingredient matches?",
            answer: "The Recipe Generator uses advanced algorithms to accurately match recipes with the ingredients you have. While it strives for precision, some minor adjustments may be needed based on your specific pantry items.",
            show: true,
        },
        {
            id: 10,
            question: "Does it support multiple cuisines?",
            answer: "Yes, the Recipe Generator offers a wide range of recipes from different cuisines, allowing you to explore and enjoy diverse flavors.",
            show: false,
        },
        // {
        //     id: 11,
        //     question: "Can I share the recipes with others?",
        //     answer: "Yes, you can easily share recipes and photos of your dishes with friends and family directly from the platform.",
        //     show: false,
        // },
        {
            id: 12,
            question: "How do I get started with the Recipe Generator?",
            answer: "Simply sign up for Cre8teGPT, enter your available ingredients, and start exploring the suggested recipes. It's that easy!",
            show: false,
        },
        {
            id: 13,
            question: "Is the Recipe Generator free to use?",
            answer: "Cre8teGPT offers a freemium model where basic features are free, and advanced features, including generation by image and full access to other premium AI tools, are available to subscribers.",
            show: false,
        },
        // {
        //     id: 14,
        //     question: "What kind of cooking tips and tricks does it provide?",
        //     answer: "The Recipe Generator includes expert tips and tricks on cooking techniques, ingredient insights, and more to help you enhance your culinary skills.",
        //     show: false,
        // },
        // {
        //     id: 15,
        //     question: "Can it help with meal planning?",
        //     answer: "Yes, the Recipe Generator can assist with meal planning by helping you organize your weekly menu, making grocery shopping and meal prep more efficient.",
        //     show: false,
        // },
        // {
        //     id: 16,
        //     question: "Does it support multiple languages?",
        //     answer: "Yes, the Recipe Generator supports multiple languages, allowing you to create and enjoy recipes in your preferred language.",
        //     show: false,
        // },
        // {
        //     id: 17,
        //     question: "How often are new recipes added?",
        //     answer: "New recipes are regularly added to the Recipe Generator to ensure a wide variety of options and to keep your culinary adventures fresh and exciting.",
        //     show: false,
        // },
        // {
        //     id: 18,
        //     question: "How secure is my data with Cre8teGPT?",
        //     answer: "Cre8teGPT takes data security seriously. Your information is protected with robust security measures, and your privacy is a top priority.",
        //     show: false,
        // },
        // {
        //     id: 19,
        //     question: "Can I use the Recipe Generator on mobile devices?",
        //     answer: "Yes, Cre8teGPT is fully optimized for mobile devices, allowing you to access and use the Recipe Generator on the go.",
        //     show: false,
        // },
        {
            id: 20,
            question: "What types of ingredients can I input?",
            answer: "You can input a wide range of ingredients, from common pantry staples to fresh produce and specialty items.",
            show: false,
        },
        // {
        //     id: 21,
        //     question: "How do I provide feedback or suggest improvements?",
        //     answer: "We welcome your feedback! You can provide suggestions or report issues through our support channels, and we continuously strive to improve the Recipe Generator based on user input.",
        //     show: false,
        // },
        // {
        //     id: 22,
        //     question: "Is there customer support available if I have questions or issues?",
        //     answer: "Yes, Cre8teGPT offers customer support to assist with any questions or issues you may have. Contact us through our support channels for prompt assistance.",
        //     show: false,
        // },
    ];

    useEffect(() => {
        // apply class to body
        document.body.classList.add("case-details-2");

        sal();

        const cards = document.querySelectorAll(".bg-flashlight");

        cards.forEach((bgflashlight) => {
            bgflashlight.onmousemove = function (e) {
                let x = e.pageX - bgflashlight.offsetLeft;
                let y = e.pageY - bgflashlight.offsetTop;

                bgflashlight.style.setProperty("--x", x + "px");
                bgflashlight.style.setProperty("--y", y + "px");
            };
        });
    }, []);
    
    const generate = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const ingredients = formData.get("ingredients");

        if (!session) {
            toast.error("Please sign in to use the recipe generator tool 🍳.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            
            // redirect to sign in page
            setTimeout(() => {
                router.push("/auth/signin?redirect=/tools/generators/recipe-generator");
            }, 2000);

        }

        if (!ingredients || ingredients.trim() === "") {
            toast.error("Please enter some ingredients to generate recipes 🥘.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        if (!ingredients.includes(",")) {
            toast.error("Please enter ingredients separated by commas 🥘.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("/api/tools/generators/recipe-generator", { ingredients });

            if (!response || !response.data) {
                toast.error("Error generating recipes. Please try again later 🥘.");
                return;
            }

            console.log(response.data);
            setRecipes(response.data.recipes);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const byImage = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const image = formData.get("image");

        if (!session) {
            toast.error("Please sign in to use the recipe generator tool 🍳.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            // redirect to sign in page
            setTimeout(() => {
                router.push("/auth/signin?redirect=/tools/generators/recipe-generator");
            }, 2000);
        }

        toast.error("This feature is only available to Pro users. Please upgrade to Pro to use this feature 🍳.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        return;

        if (!image) {
            toast.error("Please upload an image to generate recipes 🥘.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("/api/tools/generators/recipe-generator-image", { image });

            if (!response || !response.data) {
                toast.error("Error generating recipes. Please try again later 🥘.");
                return;
            }

            console.log(response.data);
            setRecipes(response.data.recipes);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const byCuisine = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const cuisine = formData.get("cuisine");

        if (!session) {
            toast.error("Please sign in to use the recipe generator tool 🍳.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            // redirect to sign in page
            setTimeout(() => {
                router.push("/auth/signin?redirect=/tools/generators/recipe-generator");
            }, 2000);
        }

        toast.error("This feature is only available to Pro users. Please upgrade to Pro to use this feature 🍳.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        return;

        if (!cuisine || cuisine.trim() === "") {
            toast.error("Please enter a cuisine to generate recipes 🥘.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("/api/tools/generators/recipe-generator-cuisine", { cuisine });

            if (!response || !response.data) {
                toast.error("Error generating recipes. Please try again later 🥘.");
                return;
            }

            console.log(response.data);
            setRecipes(response.data.recipes);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const applyBreaks = (text) => {
       // apply breaks after periods
         return text.replace(/\./g, ".<br />");
    };

    const applyNewLines = (text) => {
        // apply breaks after periods
        return text.replace(/\n/g, "<br />");
    };

    return (
        <>
            <div className="recipe-generator rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Content Generators</span>
                                    <h2 className="title">
                                        Recipe Generator
                                    </h2>

                                    <p className="disc">
                                        Our recipe generator suggests delicious dishes based on your available ingredients, helping you cook with what you have at home.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                                    <img src="/images/icons/by-ingredients.png" alt="icons" />
                                                    By Ingredients
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false" tooltip="Pro users only">
                                                    <img src="/images/icons/by-image.png" alt="icons" />
                                                    By Image
                                                    <i class="feather-zap"></i>
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                                                    <img src="/images/icons/by-cuisine.png" alt="icons" />
                                                    By Cuisine
                                                </button>
                                            </li>
                                        </ul>

                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={generate}>
                                                        <input type="text" name="ingredients" placeholder="Enter comma separated ingredients you have on hand and get personalized recipes..." />
                                                        <button type="submit"> 
                                                            {isLoading ? ( "Generating") : ( "Generate")}
                                                            {isLoading ? (
                                                            <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                            ) : (
                                                            <img src="/images/icons/13.png" alt="" />
                                                            )}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                            
                                            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={byImage}>
                                                        <input type="file" name="image" accept="image/*" />
                                                        <button type="submit">
                                                            {isLoading ? ( "Generating") : ( "Generate")}
                                                            {isLoading ? (
                                                            <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                            ) : (
                                                            <img src="/images/icons/13.png" alt="" />
                                                            )}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                            
                                            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={byCuisine}>
                                                        <input type="text" name="cuisine" placeholder="Enter a cuisine to get personalized recipes..." />
                                                        <button type="submit">
                                                            {isLoading ? ( "Generating") : ( "Generate")}
                                                            {isLoading ? (
                                                            <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                            ) : (
                                                            <img src="/images/icons/13.png" alt="" />
                                                            )}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Link className="rts-btn btn-primary" href="/contact">
                                        Start Writing
                                    </Link> */}
                                </div>
                            </div>
                        </div>

                        {recipes.length > 0 && (
                            <div className="row">
                                <Separator top={true} />
                                <div className="feature-area-start rts-section-gapBottom bg-tools mt--60">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="title-center-feature">
                                                    <h2 className="title text-center">
                                                        Here are some recipes you can make with the ingredients you have on hand.
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="row mt--60">
                                            <div className="col-lg-12">
                                                {recipes.map((recipe, index) => (
                                                <div className="single-feature-area-main-inner">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="feature-content-inner">
                                                                <h3 className="title"><span>{index + 1}.</span> {recipe.title}</h3>

                                                                <p className="desc">{recipe.description}</p>
                                                                <p className="desc">
                                                                    <strong>Difficulty:</strong> {recipe.difficulty}
                                                                </p>
                                                                <p className="desc">
                                                                    <strong>Servings:</strong> {recipe.servings}
                                                                </p>

                                                                <h5 className="title">Ingredients</h5>
                                                                <ul className="list">
                                                                    {recipe.ingredients.map((ingredient, index) => (
                                                                        <li key={index}>{ingredient}</li>
                                                                    ))}
                                                                </ul>

                                                                <h5 className="title">Nutritional Information</h5>
                                                                <ul className="list">
                                                                    {recipe.nutrients.map((nutrient, index) => (
                                                                        <li key={index}>{nutrient}</li>
                                                                    ))}
                                                                </ul>

                                                                <h5 className="title">Steps</h5>
                                                                <ol className="list">
                                                                    {recipe.steps.map((step, index) => (
                                                                        <li key={index}>{step}</li>
                                                                    ))}
                                                                </ol>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="thumbnail-feature">
                                                                <img src={recipe.image} alt="recipe-image" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                ), recipes)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator top={false} />
                            </div>
                        )}

                        <Separator top={true} />

                        <div className="feature-area-start rts-section-gapTop rts-section-gapBottom bg-smooth-2 bg-tools">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-center-feature text-center">
                                            <h2 className="title">Meet Your New Sous Chef</h2>
                                            <p className="disc">
                                                Introducing Cre8teGPT Recipe Master, your personal sous chef with a sprinkle of AI magic! It transforms your fridge from a mystery box to a treasure trove of culinary possibilities. It can help you create delicious dishes even with limited ingredients. Throw in your random ingredients (wilting spinach? Leftover chicken? Mystery jar of pickles?), and <strong>BAM!</strong> Watch as our AI whiz whips up a symphony of delicious recipes just waiting to be devoured. <br />
                                                No more meal-planning meltdowns, last-minute grocery sprints, or wilting veggies destined for the compost bin. Get ready to enjoy a world of culinary possibilities right in your kitchen. <br />
                                                Start cooking with confidence and creativity today!
                                            </p>
                                            <div className="button-group mt--50 text-center">
                                                <button className="btn-default">
                                                    Try Recipe Generator
                                                    <i className="fa-solid fa-arrow-up ml--10"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={false} />

                        <div className="feature-area-start rts-section-gapBottom bg-tools mt--60">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-center-feature">
                                            <h2 className="title text-center">
                                                Dinner Dilemma Solved
                                            </h2>
                                            <p className="disc text-center">
                                                Discover delicious recipes tailored to your available ingredients with Cre8teGPT's AI-powered recipe generator. Even if you're a kitchen newbie, Cre8teGPT's easy-to-follow recipes will make you feel like a pro. Get ready to cook with confidence, experiment with flavors, and unleash your inner chef. Say goodbye to boring meals and hello to culinary creativity!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row case-lg-img-w">
                                    <div className="share-mid">
                                        <img src="/images/case/06.png" alt="" />
                                    </div>

                                    <div className="col-lg-6 mt--150 mt_sm--50">
                                        <div className="use-case-left-thumb">
                                            <h3 className="title">Input Ingredients</h3>
                                            <p className="disc">Enter the ingredients you have available in your kitchen.</p>
                                            <img src="/images/screenshots/recipe-generator/input.png" alt="input ingredients" />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 mt--20">
                                        <div className="use-case-right-thumb">
                                            <div className="inner">
                                                <h3 className="title">Generate Recipes</h3>
                                                <p className="disc">Let Cre8teGPT analyze your ingredients and generate a list of delicious recipes.</p>
                                                <img src="/images/screenshots/recipe-generator/generate.png" alt="generate ingredients" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="button-group mt--50 text-center">
                                            <button className="btn-default">
                                                Try Recipe Generator
                                                <i className="fa-solid fa-arrow-up ml--10"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Separator top={true} />
                
                <div className="rts-feature-area rts-section-gap bg-tools">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-center-feature">
                                    <h2 className="title text-center">
                                        Let Our Culinary AI Create Magic in Your Kitchen
                                    </h2>
                                    <p className="disc text-center">
                                        Discover delicious recipes tailored to your available ingredients with Cre8teGPT's AI-powered recipe generator.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row mt--50">
                            <div className="col-lg-12">
                                <div className="single-feature-area-start">
                                    <div className="image-area">
                                        <img src="/images/feature/01.png" alt="feature_image" />
                                    </div>
                                    <div className="featue-content-area">
                                        <span className="pre">01</span>
                                        <h2 className="title">Search by <br /> Ingredients</h2>
                                        <p className="disc">
                                            Do you have limited ingredients and don't know what to cook? Input the ingredients and let Cre8teGPT generate recipes tailored to your pantry.
                                        </p>
                                        <a href="#" className="rts-btn btn-default">Generate Recipes</a>
                                    </div>
                                </div>

                                <div className="single-feature-area-start bg-red-l">
                                    <div className="featue-content-area">
                                        <span className="pre">02</span>
                                        <h2 className="title">Search by <br /> Food Image</h2>
                                        <p className="disc">
                                            Do you have an image of a delicious looking dish and want to try it out but don't know where to start? Upload the image and Cre8teGPT will identify the dish and provide you with the recipe.
                                        </p>
                                        <a href="#" className="rts-btn btn-default">Generate Recipes</a>
                                    </div>
                                    <div className="image-area">
                                        <img src="/images/feature/02.png" alt="feature_image" />
                                    </div>
                                </div>

                                <div className="single-feature-area-start bg-blue-l">
                                    <div className="image-area">
                                        <img src="/images/feature/03.png" alt="feature_image" />
                                    </div>
                                    <div className="featue-content-area">
                                        <span className="pre">03</span>
                                        <h2 className="title">Search by <br /> Cuisine</h2>
                                        <p className="disc">
                                            Do you want to try different recipes for your favorite cuisine? Select the cuisine and let Cre8teGPT generate a list of recipes for you to try.
                                        </p>
                                        <a href="#" className="rts-btn btn-default">Generate Recipes</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator top={false} />

                <div className="rts-clients-review-area rts-section-gapTop bg-tools">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area">
                                    <h2 className="title">
                                        Trusted by Content Cre8tors Worldwide
                                    </h2>
                                    <p className="disc">
                                        Cre8teGPT is the go-to platform for content creators, marketers, and businesses to generate high-quality content at scale.
                                    </p>
                                    <div className="brand-area">
                                        <i class="fa-brands fa-dev"></i>
                                        <i class="fa-brands fa-teamspeak"></i>
                                        <i class="fa-brands fa-product-hunt"></i>
                                        <i class="fa-brands fa-free-code-camp"></i>
                                        <i class="fa-brands fa-npm"></i>
                                        <i class="fa-brands fa-yarn"></i>
                                        <i class="fa-brands fa-webflow"></i>
                                        <i class="fa-brands fa-codepen"></i>
                                        <i class="fa-brands fa-researchgate"></i>
                                        <i class="fa-brands fa-foursquare"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-tt mt--60">
                        <div className="marquee">
                            <div className="marquee__item">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="main--wrapper-tt">
                                            {testimonials.slice(0, 5).map((testimonial, index) => (
                                                <div className="single-testimonials-marquree" key={index}>
                                                    <div className="top">
                                                        <div className="author">
                                                            <Image src={testimonial.image} width={50} height={50} alt="team" />
                                                            <div className="info-content">
                                                                <h6 className="title">{testimonial.name}</h6>
                                                                <span className="deg">{testimonial.title}</span>
                                                            </div>
                                                        </div>
                                                        <div className="stars-area">
                                                            {[...Array(testimonial.stars)].map((star, index) => (
                                                                <i key={index} className="fa-solid fa-star"></i>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="body">
                                                        <p dangerouslySetInnerHTML={{ __html: applyBreaks(testimonial.review) }}></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="marquee__item">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="main--wrapper-tt">
                                            {testimonials.slice(5, 10).map((testimonial, index) => (
                                                <div className="single-testimonials-marquree" key={index}>
                                                    <div className="top">
                                                        <div className="author">
                                                            <Image src={testimonial.image} width={50} height={50} alt="team" />
                                                            <div className="info-content">
                                                                <h6 className="title">{testimonial.name}</h6>
                                                                <span className="deg">{testimonial.title}</span>
                                                            </div>
                                                        </div>
                                                        <div className="stars-area">
                                                            {[...Array(testimonial.stars)].map((star, index) => (
                                                                <i key={index} className="fa-solid fa-star"></i>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="body">
                                                        <p dangerouslySetInnerHTML={{ __html: applyBreaks(testimonial.review) }}></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="marquee mt--30">
                            <div className="marquee__item-2">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="main--wrapper-tt">
                                            {testimonials.slice(10, 20).map((testimonial, index) => (
                                                <div className="single-testimonials-marquree" key={index}>
                                                    <div className="top">
                                                        <div className="author">
                                                            <Image src={testimonial.image} width={50} height={20} alt="team" />
                                                            <div className="info-content">
                                                                <h6 className="title">{testimonial.name}</h6>
                                                                <span className="deg">{testimonial.title}</span>
                                                            </div>
                                                        </div>
                                                        <div className="stars-area">
                                                            {[...Array(testimonial.stars)].map((star, index) => (
                                                                <i key={index} className="fa-solid fa-star"></i>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="body">
                                                        <p dangerouslySetInnerHTML={{ __html: applyBreaks(testimonial.review) }}></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator top={true} />

                <div className="rts-faq-area rts-section-gap bg_faq">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area">
                                    <h2 className="title">
                                        Frequently Asked Questions
                                    </h2>
                                    <p className="disc">
                                        Find answers to common questions about Cre8teGPT's Recipe Generator tool.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row mt--60">
                            <div className="col-lg-12">
                                <div className="accordion-area-one">
                                    <div className="accordion" id="accordionExample">
                                        {faqs.map((faq, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id={`heading${index}`}>
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                                        {faq.question}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${index}`} className={`accordion-collapse collapse ${faq.show ? "show" : ""}`} aria-labelledby={`heading${index}`} data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="rts-cta-area rts-section-gapBottom  bg_faq">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="cta-main-wrapper bg_image">
                                    <div className="left">
                                        <h3 className="title">
                                            All set to level up <br />
                                            your content game?
                                        </h3>
                                        <a href="about.html" className="rts-btn btn-primary">Get Started Now</a>
                                    </div>
                                    <div className="right">
                                        <img src="images/02_2.png" alt="cta-area" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default RecipeGenerator;
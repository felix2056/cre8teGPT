import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const RecipeGenerator = () => {
    const { data: session } = useSession();
    const router = useRouter();

    let [isLoading, setIsLoading] = useState(false);
    let [recipes, setRecipes] = useState([]);

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
                router.push("/auth/signin?redirect=/ai-tools/generators/recipe-generator");
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
            console.log(response.data);
            setRecipes(response.data.response);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setRecipes([]);
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap">
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
                                                <div className="row g-5">
                                                    <div className="col-lg-12">
                                                        <div className="question_answer__wrapper__chatbot">
                                                            <div className="single__question__answer">
                                                                <div className="question_user">
                                                                    <div className="left_user_info">
                                                                        <img src="assets/images/avatar/03.png" alt="avatar" />
                                                                        <div className="question__user">what is openup?</div>
                                                                    </div>
                                                                    <div className="edit__icon">
                                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="answer__area">
                                                                    <div className="thumbnail">
                                                                        <img src="assets/images/avatar/04.png" alt="avatar" />
                                                                    </div>
                                                                    <div className="answer_main__wrapper">
                                                                        <h4 className="common__title">Openup</h4>
                                                                        <p className="disc">
                                                                            The Open Unified Process, is a simplified version of the Rational Unified Process (RUP) used for agile and iterative software development. It was developed within the Eclipse Foundation and is based on the donation of process content by IBM. OpenUP targets small and colocated teams interested in agile and iterative development and is a lean Unified Process that applies iterative and incremental approaches within a structured lifecycle. It embraces a pragmatic approach and is positioned as an easy and flexible version of RUP [1][2][3]
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="share-reaction-area">
                                                                    <ul>
                                                                        <li><a href="#"><i className="fa-regular fa-bookmark"></i></a></li>
                                                                        <li><a href="#"><i className="fa-light fa-thumbs-up"></i></a></li>
                                                                        <li><a href="#"><i className="fa-regular fa-thumbs-down"></i></a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="single__question__answer">
                                                                <div className="question_user">
                                                                    <div className="left_user_info">
                                                                        <img src="assets/images/avatar/03.png" alt="avatar" />
                                                                        <div className="question__user">what is openup?</div>
                                                                    </div>
                                                                    <div className="edit__icon">
                                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="answer__area">
                                                                    <div className="thumbnail">
                                                                        <img src="assets/images/avatar/04.png" alt="avatar" />
                                                                    </div>
                                                                    <div className="answer_main__wrapper">
                                                                        <h4 className="common__title">Openup</h4>
                                                                        <p className="disc">
                                                                            The Open Unified Process, is a simplified version of the Rational Unified Process (RUP) used for agile and iterative software development. It was developed within the Eclipse Foundation and is based on the donation of process content by IBM. OpenUP targets small and colocated teams interested in agile and iterative development and is a lean Unified Process that applies iterative and incremental approaches within a structured lifecycle. It embraces a pragmatic approach and is positioned as an easy and flexible version of RUP [1][2][3]
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="share-reaction-area">
                                                                    <ul>
                                                                        <li><a href="#"><i className="fa-regular fa-bookmark"></i></a></li>
                                                                        <li><a href="#"><i className="fa-light fa-thumbs-up"></i></a></li>
                                                                        <li><a href="#"><i className="fa-regular fa-thumbs-down"></i></a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="single__question__answer">
                                                                <div className="question_user">
                                                                    <div className="left_user_info">
                                                                        <img src="assets/images/avatar/03.png" alt="avatar" />
                                                                        <div className="question__user">what is openup?</div>
                                                                    </div>
                                                                    <div className="edit__icon">
                                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="answer__area">
                                                                    <div className="thumbnail">
                                                                        <img src="assets/images/avatar/04.png" alt="avatar" />
                                                                    </div>
                                                                    <div className="answer_main__wrapper">
                                                                        <h4 className="common__title">Openup</h4>
                                                                        <p className="disc">
                                                                            Working with a chatbot involves several steps, from designing and building the bot to deploying and maintaining it. Here's a general overview of how to work with a chatbot:
                                                                        </p>
                                                                        <div className="order_list_answer">
                                                                            <ol>
                                                                                <li>
                                                                                    <p>Define the Purpose: Determine the purpose and goals of the chatbot. What tasks or interactions do you want the bot to handle? Who is the target audience?</p>
                                                                                </li>
                                                                                <li>
                                                                                    <p>Define the Purpose: Determine the purpose and goals of the chatbot. What tasks or interactions do you want the bot to handle? Who is the target audience?</p>
                                                                                </li>
                                                                            </ol>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="share-reaction-area">
                                                                    <ul>
                                                                        <li><a href="#"><i className="fa-regular fa-bookmark"></i></a></li>
                                                                        <li><a href="#"><i className="fa-light fa-thumbs-up"></i></a></li>
                                                                        <li><a href="#"><i className="fa-regular fa-thumbs-down"></i></a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                                <div className="row g-5">
                                                    <div className="col-lg-12">
                                                        <div className="audio-main-generator-start">
                                                            <form action="#">
                                                                <div className="ask-for-audio">
                                                                    <textarea placeholder="Here write text" required=""></textarea>
                                                                    <i className="fa-light fa-pen-to-square"></i>
                                                                    <div className="button-wrapper-generator">
                                                                        <button className="rts-btn btn-primary">Generate
                                                                            <img src="assets/images/icons/06.svg" alt="icons" />
                                                                        </button>
                                                                        <button className="mp3 rts-btn btn-border">
                                                                            MP3
                                                                            <i className="fa-sharp fa-light fa-chevron-down"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="audio-main-wrapper-top-bottom mb--60">
                                                            <div className="audio-main-wrapper">
                                                                <div className="audio-player">
                                                                    <div className="timeline">
                                                                        <div className="progress" style={{width: 0 + '%' }}></div>
                                                                    </div>
                                                                    <div className="controls">
                                                                        <div className="play-container">
                                                                            <div className="toggle-play play">
                                                                            </div>
                                                                        </div>
                                                                        <div className="time">
                                                                            <div className="current">0:00</div>
                                                                            <div className="divider">/</div>
                                                                            <div className="length">1:44</div>
                                                                        </div>
                                                                        <div className="volume-container">
                                                                            <div className="volume-button">
                                                                                <div className="volume icono-volumeMedium"></div>
                                                                            </div>

                                                                            <div className="volume-slider">
                                                                                <div className="volume-percentage"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button className="rts-btn btn-primary mt--30">Downloaded
                                                                <i className="fa-light fa-download"></i>
                                                            </button>
                                                        </div>
                                                        <div className="audio-main-generator-start">
                                                            <form action="#">
                                                                <div className="ask-for-audio">
                                                                    <textarea placeholder="Here write text" required=""></textarea>
                                                                    <i className="fa-light fa-pen-to-square"></i>
                                                                    <div className="button-wrapper-generator">
                                                                        <button className="rts-btn btn-primary">Generate
                                                                            <img src="assets/images/icons/06.svg" alt="icons" />
                                                                        </button>
                                                                        <button className="mp3 rts-btn btn-border">
                                                                            MP3
                                                                            <i className="fa-sharp fa-light fa-chevron-down"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="audio-main-wrapper-top-bottom mb--60">
                                                            <div className="audio-main-wrapper">
                                                                <div className="audio-players">
                                                                    <div className="timeline">
                                                                        <div className="progress" style={{width: 0 + '%' }}></div>
                                                                    </div>
                                                                    <div className="controls">
                                                                        <div className="play-container">
                                                                            <div className="toggle-play play">
                                                                            </div>
                                                                        </div>
                                                                        <div className="time">
                                                                            <div className="current">0:00</div>
                                                                            <div className="divider">/</div>
                                                                            <div className="length">1:44</div>
                                                                        </div>
                                                                        <div className="volume-container">
                                                                            <div className="volume-button">
                                                                                <div className="volume icono-volumeMedium"></div>
                                                                            </div>

                                                                            <div className="volume-slider">
                                                                                <div className="volume-percentage"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button className="rts-btn btn-primary mt--30">Downloaded
                                                                <i className="fa-light fa-download"></i>
                                                            </button>
                                                        </div>
                                                        <div className="audio-main-generator-start">
                                                            <form action="#">
                                                                <div className="ask-for-audio">
                                                                    <textarea placeholder="Here write text" required=""></textarea>
                                                                    <i className="fa-light fa-pen-to-square"></i>
                                                                    <div className="button-wrapper-generator">
                                                                        <button className="rts-btn btn-primary">Generate
                                                                            <img src="assets/images/icons/06.svg" alt="icons" />
                                                                        </button>
                                                                        <button className="mp3 rts-btn btn-border">
                                                                            MP3
                                                                            <i className="fa-sharp fa-light fa-chevron-down"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="audio-main-wrapper-top-bottom mb--60">
                                                            <div className="audio-main-wrapper">
                                                                <div className="audio-playerer">
                                                                    <div className="timeline">
                                                                        <div className="progress" style={{width: 0 + '%' }}></div>
                                                                    </div>
                                                                    <div className="controls">
                                                                        <div className="play-container">
                                                                            <div className="toggle-play play">
                                                                            </div>
                                                                        </div>
                                                                        <div className="time">
                                                                            <div className="current">0:00</div>
                                                                            <div className="divider">/</div>
                                                                            <div className="length">1:44</div>
                                                                        </div>
                                                                        <div className="volume-container">
                                                                            <div className="volume-button">
                                                                                <div className="volume icono-volumeMedium"></div>
                                                                            </div>

                                                                            <div className="volume-slider">
                                                                                <div className="volume-percentage"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button className="rts-btn btn-primary mt--30">Downloaded
                                                                <i className="fa-light fa-download"></i>
                                                            </button>
                                                        </div>
                                                    </div>
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
                                <div className="feature-area-start rts-section-gapBottom mt--60">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="title-left-feature">
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

                                                                <p className="disc">{recipe.description}</p>

                                                                <h4 className="sub-title">Ingredients</h4>
                                                                <ul className="list">
                                                                    {recipe.ingredients.map((ingredient, index) => (
                                                                        <li key={index}>{ingredient}</li>
                                                                    ))}
                                                                </ul>

                                                                <h4 className="sub-title">Steps</h4>
                                                                <ul className="list">
                                                                    {recipe.steps.map((step, index) => (
                                                                        <li key={index}>{step}</li>
                                                                    ))}
                                                                </ul>
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
                            </div>
                        )}

                        <div className="row case-lg-img-w">
                            <div className="share-mid">
                                <img src="/images/case/06.png" alt="" />
                            </div>

                            <div className="col-lg-6 mt--150 mt_sm--50">
                                <div className="use-case-left-thumb">
                                    <h3 className="title">Input Ingredients</h3>
                                    <p className="disc">Enter the ingredients you have available in your kitchen.</p>
                                    <img src="/images/case/05.jpg" alt="case-images" />
                                </div>
                            </div>

                            <div className="col-lg-6 mt--20">
                                <div className="use-case-right-thumb">
                                    <div className="inner">
                                        <h3 className="title">Generate Recipes</h3>
                                        <p className="disc">Let Cre8teGPT analyze your ingredients and generate a list of delicious recipes.</p>
                                        <img src="/images/case/04.jpg" alt="case-images" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rts-feature-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area">
                                    <h2 className="title">
                                        Let Our AI Create <br />
                                        Your Next Recipe
                                    </h2>
                                    <p className="disc">
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
                                        <a href="#" className="rts-btn btn-primary">Get Started Free</a>
                                    </div>
                                </div>

                                <div className="single-feature-area-start bg-red-l">
                                    <div className="featue-content-area">
                                        <span className="pre">02</span>
                                        <h2 className="title">Search by <br /> Food Image</h2>
                                        <p className="disc">
                                            Do you have an image of a delicious looking dish and want to try it out but don't know where to start? Upload the image and Cre8teGPT will identify the dish and provide you with the recipe.
                                        </p>
                                        <a href="#" className="rts-btn btn-primary">Get Started Free</a>
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
                                        <a href="#" className="rts-btn btn-primary">Get Started Free</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rts-clients-review-area rts-section-gapTop">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area">
                                    <h2 className="title">
                                        OpenUP Received 4.8/5 Stars in Over <br />
                                        10,000+ Reviews.
                                    </h2>
                                    <p className="disc">
                                        Used by them World Best Markting Team
                                    </p>
                                    <div className="brand-area">
                                        <img src="images/01.png" alt="" />
                                        <img src="images/02_1.png" alt="" />
                                        <img src="images/03_1.png" alt="" />
                                        <img src="images/04_1.png" alt="" />
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
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>

                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="marquee__item">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="main--wrapper-tt">
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>

                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
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
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="marquee__item-2">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="main--wrapper-tt">
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="marquee__item-2">
                                <div className="row">
                                    <div className="col-lg-12">

                                        <div className="main--wrapper-tt">
                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>

                                            <div className="single-testimonials-marquree">
                                                <div className="top">
                                                    <div className="author">
                                                        <img src="images/09_2.png" alt="team" />
                                                        <div className="info-content">
                                                            <h6 className="title">Samuel</h6>
                                                            <span className="deg">Blogger</span>
                                                        </div>
                                                    </div>
                                                    <div className="stars-area">
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p>So glad i found openup!! It has made my blog <br /> tasks a billion times more enjoyable (which is <br /> an emotion way beyond.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rts-faq-area rts-section-gap bg_faq">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area">
                                    <h2 className="title">
                                        Questions About our GenAI? <br />
                                        We have Answers!
                                    </h2>
                                    <p className="disc">
                                        please feel free to reach out to us. We are always happy to assist you and provide any additional.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row mt--60">
                            <div className="col-lg-12">
                                <div className="accordion-area-one">
                                    <div className="accordion" id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    What is openup content writing tool?
                                                </button>
                                            </h2>
                                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Once you know your audience, choose a topic that will resonate with them. Look for trending topics in your industry or address common questions or challenges your audience may be facing.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    what languages does it supports?
                                                </button>
                                            </h2>
                                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Once you know your audience, choose a topic that will resonate with them. Look for trending topics in your industry or address common questions or challenges your audience may be facing.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    What is sEO wirting ai and how do i use it?
                                                </button>
                                            </h2>
                                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Once you know your audience, choose a topic that will resonate with them. Look for trending topics in your industry or address common questions or challenges your audience may be facing.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingFour">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                    what languages does it supports?
                                                </button>
                                            </h2>
                                            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Once you know your audience, choose a topic that will resonate with them. Look for trending topics in your industry or address common questions or challenges your audience may be facing.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingFive">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                    Does Openup to write long articles?
                                                </button>
                                            </h2>
                                            <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Once you know your audience, choose a topic that will resonate with them. Look for trending topics in your industry or address common questions or challenges your audience may be facing.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rts-cta-area rts-section-gapBottom  bg_faq">
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
                </div>
            </div>
        </>
    );
};

export default RecipeGenerator;
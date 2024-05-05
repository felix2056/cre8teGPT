import React, { useEffect, useState } from "react";

import sal from "sal.js";

import axios from "axios";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

import AIToolsItem from "./AIToolsItem";

const AITools = () => {
    let [categories, setCategories] = useState([]);

    useEffect(() => {
        // fetch all AI tools
        axios.get("/api/tools").then((res) => {
            setCategories(res.data.categories);
        }).catch((err) => {
        });

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

    return (
        <>
            <div className="rainbow-service-area rainbow-section-gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div
                                className="section-title text-center"
                                data-sal="slide-up"
                                data-sal-duration="700"
                                data-sal-delay="100"
                            >
                                <h4 className="subtitle">
                                    <span className="theme-gradient">BROWSE 100+ AI TOOLS</span>
                                </h4>
                                <h2 className="title w-600 mb--20">
                                    Unlock the Power of AI with Our Extensive Collection of Tools
                                </h2>
                                <p className="description b1">
                                    Welcome to our comprehensive directory of AI tools – your one-stop destination for discovering the latest and most innovative AI-powered solutions for content creation, marketing, productivity, and more. Whether you're a seasoned professional or just starting out, our curated collection of 100+ AI tools has something for everyone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="tool-genearate-section">
                        {categories && categories.map((category, cat_index) => (
                        <div className="container">
                            <h3 className="title text-capitalize w-600 mb--20">{category.name}</h3>
                            <span className="theme-gradient">{category.description}</span>
                            
                            <div className="separator-animated animated-true mt--50 mb--50"></div>
                            
                            {[...Array(Math.ceil(category.tools.length / 4))].map((_, index) => (
                                <div className="genarator-section mb-4">
                                    <AIToolsItem key={index} AIToolsItem={category.tools.slice(index * 4, (index + 1) * 4)} />
                                </div>
                            ))}
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AITools;

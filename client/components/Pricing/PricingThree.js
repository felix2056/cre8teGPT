import React, { useEffect } from "react";
import sal from "sal.js";

import PricingData from "../../data/home.json";
import Link from "next/link";

const Pricing = () => {
    useEffect(() => {
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
            <div className="rts-pricing-area rts-section-gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="title-conter-area">
                                <h2 className="title">
                                    Try For Free, No Credit <br />
                                        Card Required
                                </h2>
                            </div>
                        </div>
                    </div>

                    <ul className="nav mt--20 nav-tabs pricing-button-one" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className=" active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Monthly</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Annual</button>
                        </li>
                        <li className="right-image-inner">
                            <img src="images/03.png" alt="cta-wrapper" loading="lazy" />
                        </li>
                    </ul>

                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className="row g-5 mt--20">
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
                                    <div className="pricing-style-one">
                                        <div className="head">
                                            <span className="top">St Rater</span>
                                            <div className="date-use">
                                                <h4 className="title">Free</h4>
                                                <span>/month</span>
                                            </div>
                                        </div>
                                        <div className="body">
                                            <a href="#" className="rts-btn btn-border-p">Start Free Trial</a>
                                            <div className="chek-area">
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>10,000 Monthly Word Limit</p>
                                                </div>
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>10+ Templates</p>
                                                </div>
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>All types of content</p>
                                                </div>
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>10+ Languages</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="row g-5 mt--20">
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
                                    <div className="pricing-style-one">
                                        <div className="head">
                                            <span className="top">St Rater</span>
                                            <div className="date-use">
                                                <h4 className="title">Free</h4>
                                                <span>/month</span>
                                            </div>
                                        </div>
                                        <div className="body">
                                            <a href="#" className="rts-btn btn-border-p">Start Free Trial</a>
                                            <div className="chek-area">
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>10,000 Monthly Word Limit</p>
                                                </div>
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>10+ Templates</p>
                                                </div>
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>All types of content</p>
                                                </div>
                                                <div className="single-check">
                                                    <i className="fa-solid fa-check"></i>
                                                    <p>10+ Languages</p>
                                                </div>
                                            </div>
                                        </div>
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

export default Pricing;

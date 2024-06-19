import React, { useEffect } from "react";
import { useRouter } from "next/router";
import sal from "sal.js";

import PricingData from "../../data/home.json";
import Link from "next/link";

const PricingFour = () => {
    const router = useRouter();

    const [quantity, setQuantity] = React.useState(1);
    const [tax, setTax] = React.useState(0);

    useEffect(() => {
        sal();
    }, []);

    const choosePlan = (data) => {
        try {
            data.quantity = quantity;
            data.tax = tax;

            // save the plan on local storage
            localStorage.setItem("plan", JSON.stringify(data));

            // redirect to checkout page
            router.push("/checkout");
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <>
            <div className="pricing-plane-area rts-section-gapBottom home-six">
                <div className="container">
                    <div className="row">
                        <div className="col-lgl-12">
                            <div className="title-conter-area">
                                <h2 className="title">
                                    including pricing information <br />
                                    for specific AI services
                                </h2>
                                <p className="disc">Keep in mind that the actual pricing and features of AI services may vary significantly depending on the provider and the specific.</p>
                            </div>
                        </div>
                    </div>

                    <div className="tab-area-pricing-two mt--30">
                        <div className="tab-content mt--20" id="myTabContent">
                            <div className="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tabfs">
                                <div className="row g-5 mt--10">
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                                        <div className="single-pricing-single-two">
                                            <div className="head">
                                                <span className="top">Basic</span>
                                                <div className="date-use">
                                                    <h4 className="title">$Free</h4>
                                                    <span>/month</span>
                                                </div>
                                            </div>
                                            <div className="body">
                                                <p className="para">A premium pricing plan is a pricing <br /> structure that is designed.</p>

                                                <div className="check-wrapper">
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>10,000 Monthly Word Limit</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>10+ Templates</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>All types of content</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>10+ Languages</p>
                                                    </div>
                                                </div>
                                                <a href="#" className="pricing-btn">Get Started</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                                        <div className="single-pricing-single-two active">
                                            <div className="head">
                                                <span className="top">Diamond</span>
                                                <div className="date-use">
                                                    <h4 className="title">$399</h4>
                                                    <span>/month</span>
                                                </div>
                                            </div>
                                            <div className="body">
                                                <p className="para">A premium pricing plan is a pricing <br /> structure that is designed.</p>

                                                <div className="check-wrapper">
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>60,000 Monthly Word Limit</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>60+ Templates</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>All types of content</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>60+ Languages</p>
                                                    </div>
                                                </div>
                                                <a href="#" className="pricing-btn">Get Started</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                                        <div className="single-pricing-single-two">
                                            <div className="head">
                                                <span className="top">Silver</span>
                                                <div className="date-use">
                                                    <h4 className="title">$199</h4>
                                                    <span>/month</span>
                                                </div>
                                            </div>
                                            <div className="body">
                                                <p className="para">A premium pricing plan is a pricing <br /> structure that is designed.</p>

                                                <div className="check-wrapper">
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>30,000 Monthly Word Limit</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>30+ Templates</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>All types of content</p>
                                                    </div>
                                                    <div className="check-area">
                                                        <i className="fa-solid fa-check"></i>
                                                        <p>40+ Languages</p>
                                                    </div>
                                                </div>
                                                <a href="#" className="pricing-btn">Get Started</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade active show" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tabfs">
                                <div className="row g-5 mt--10" data-sal="slide-up" data-sal-duration="400" data-sal-delay="150">
                                    {PricingData && PricingData.pricing.slice(0, 3).map((data, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 col-12" key={index}>
                                            <div className={`single-pricing-single-two ${data.isActive ? "active" : ""}`}>
                                                <div className="head">
                                                    <span className="top">{data.title}</span>
                                                    <div className="date-use">
                                                        <h4 className="title">{data.price === 0 ? "Free" : data.price}</h4>
                                                        <span>/{data.subTitle}</span>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <p className="para">{data.desc}</p>

                                                    <div className="check-wrapper">
                                                        {data.subItem.map((innerData, innerIndex) => (
                                                            <div className="check-area" key={innerIndex}>
                                                                <i className={`fas ${innerData.isMinus ? "fa-times" : "fa-check"}`}></i>
                                                                <p>{innerData.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {data.price === 0 ? (
                                                        <button type="button" className="btn-default" onClick={() => { choosePlan(data) }}>
                                                            Try it now
                                                        </button>
                                                    ) : data.title === "Enterprise" ? (
                                                        <button type="button" className={`btn-default btn-border`} onClick={() => { choosePlan(data) }}>
                                                            Contact Sales
                                                        </button>
                                                    ) : (
                                                        <button type="button" className={`btn-default ${!data.isActive ? "btn-border" : ""}`} onClick={() => { choosePlan(data) }}>
                                                            Purchase Now
                                                        </button>
                                                    )}
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
        </>
    );
};

export default PricingFour;

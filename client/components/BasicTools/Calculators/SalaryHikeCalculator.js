import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

import sal from "sal.js";

const SalaryHikeCalculator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);

    const faq = [
        {
            title: "How to calculate salary increment percentage?",
            desc: `<p>
                    <ul">
                        <li><strong>Step 1:</strong> First, Calculate the decimal value of salary hike percentage </li>
                        <li><strong>Step 2:</strong> Then, Multiply the decimal value to the current CTC.</li>
                        <li><strong>Step 3:</strong> Now add the final value to your current CTC.</li>
                        <li><strong>Step 4:</strong> Finally the new salary value is displayed.</li>
                    </ul>
                </p>`,
            isExpand: true
        },
        {
            title: "What is the formula to calculate salary hike percentage?",
            desc: `<p class="math">Current CTC (Salary) * Salary Hike Percentage = New Salary</p>`,
            isExpand: false
        },
        {
            title: "How to calculate a 30% hike on 28000?",
            desc: `<p>
                    <ul class="disclosure-closed">
                        <li><strong>Step 1:</strong> First find the decimal value of 30% is 30/100 = 0.30</li> 
                        <li><strong>Step 2:</strong> Then multiply the 0.30 into  28000 = 0.30 * 28000</li>
                        <li><strong>Step 3:</strong> Then you got 8400.</li>
                        <li><strong>Step 4:</strong> And add the 8400 + 28000 = 36400</li>
                        <li><strong>Step 5:</strong> Hence, New Salary is 36400.</li>
                    </ul>
                </p>`,
            isExpand: false
        },
        {
            title: "What is the average salary increase for 2024?",
            desc: `<p>
                    Pay increases tend to vary based on inflation, location, sector, and job performance. Most employers give their employees an average increase of 3% per year.
                    The national raise average is 3% for employees who meet their goals and their employer's expectations. And according to one study, 56.4% of employers plan to give employees a raise of 3% But between worker expectations and high inflation, a 3% raise may not feel like a pay raise.
                </p>`,
            isExpand: false
        }
    ];

    useEffect(() => {
        sal();
    }, []);

    const calculate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            setIsLoading(true);
            setResults(null);

            let result;
            let current_salary = formData.get("current_salary");
            let hike_percent = formData.get("hike_percent");

            if (!current_salary || !hike_percent) {
                setIsLoading(false);
                return toast.error("Please enter all fields.");
            }

            current_salary = current_salary.replace(/,/g, "");

            let hike_amount = (parseFloat(current_salary) * parseFloat(hike_percent) / 100).toFixed(2);

            result = parseFloat(current_salary) + parseFloat(hike_amount);
            
            setResults(result);

            setTimeout(() => {
                setIsLoading(false);
                sal();
            }, 1000);

            // scroll to results
            document.querySelector('.result-scroll-point').scrollIntoView({
                behavior: 'smooth'
            });
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const convertToCurrency = (e) => {
        // skip for arrow keys
        if (e.which >= 37 && e.which <= 40) {
            e.preventDefault();
        }

        let $this = e.target;
        let num = $this.value.replace(/,/gi, "").split("").reverse().join("");
        let num2 = RemoveRougeChar(num.replace(/(.{3})/g, "$1,").split("").reverse().join(""));
        $this.value = num2;
    };

    const RemoveRougeChar = (value) => {
        if (value.substring(0, 1) == ",") {
            return value.substring(1, value.length);
        }
        return value;
    };

    return (
        <>
            <ToastContainer />
            <div className="salary-hike-calculator rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Basic Tools</span>
                                    <h2 className="title" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        Salary Hike Calculator
                                    </h2>

                                    <p className="disc" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        A salary hike percentage calculator or CTC calculator is one of the effective tools used to calculate the salary based on the percentage. The interface used in this tool is interactive and well-programmed to simplify the computation. You can also find your new salary using a hike percentage or increment.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                                    <form onSubmit={calculate}>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Current salary</label>
                                                            <div className="input-group mb-3">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">$</span>
                                                                </div>
                                                                <input type="text" name="current_salary" className="form-control" placeholder="50,000" aria-label="Amount (to the nearest dollar)"onKeyUp={(e) => convertToCurrency(e)} />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Percentage hike</label>
                                                            <div className="input-group mb-3">
                                                                <input type="text" name="hike_percent" className="form-control" placeholder="10" aria-label="Percentage" />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text">%</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <button type="submit" className="generate-btn position-relative" style={{ width: "100%", left: "0", right: "0", transform: "none" }}>
                                                                {isLoading ? ("Calculating") : ("Calculate")}
                                                                {isLoading && (
                                                                    <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="result-scroll-point"></div>
                        {results && (
                            <div className="search__generator mt--50">
                                <div className="tab-content mt--50" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="searchoptopn-area mb--30">
                                            <div className="row mt--20">
                                                <div className="col-lg-12">
                                                    <div className="title-conter-area top-tt" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                                        <h2 className="title">
                                                            Results
                                                        </h2>

                                                        <div className="form-group mt--20" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                                            <h5 class="summary-grid__label">Your new salary value:</h5>
                                                            <div className="result" dangerouslySetInnerHTML={{ __html: '$' + results.toLocaleString() }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rts-case-details-bottom-area rts-section-gap plr_sm--15">
                        <div className="container-use-case-d">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="case-details-title-area-d" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h2 className="title">
                                            Percentage Increase in Salary Calculation
                                        </h2>
                                        <p className="disc">
                                            When you get a promotion or switch to another job with a salary hike, it's important to know the percentage increase in your new salary. Learn how to find the percentage increase in your salary with this simple free online salary hike calculator. This tool is essential for financial planning and understanding the impact of your new earnings on your budget.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 01:</span> Enter Current Salary</h3>
                                        <p className="disc">
                                            Input your current salary in the first input field. Ensure you enter the amount accurately to get the correct percentage calculation.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 02:</span> Enter Salary Hike Percentage</h3>
                                        <p className="disc">
                                            Enter the percentage of the salary hike you received in the second input field and click on the calculate button. This field should reflect the exact percentage increase offered by your new role or promotion.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper mb--0" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 03:</span> Results</h3>
                                        <p className="disc">
                                            The new salary after the percentage increase will be displayed in the results section. Additionally, the results section will provide a detailed breakdown of your new monthly and annual salary, helping you to better understand your updated earnings.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="rainbow-accordion-area rainbow-section-gap">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 offset-lg-1">
                                    <div
                                        className="section-title text-center"
                                        data-sal="slide-up"
                                        data-sal-duration="700"
                                        data-sal-delay="100"
                                    >
                                        <h4 className="subtitle ">
                                            <span className="theme-gradient">Accordion</span>
                                        </h4>
                                        <h2 className="title w-600 mb--20">
                                            Frequently Asked Questions
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt--35 row--20">
                                <div className="col-lg-10 offset-lg-1">
                                    <div className="rainbow-accordion-style accordion" itemscope="" itemtype="https://schema.org/FAQPage">
                                        <div className="accordion" id="accordionExamplea">
                                            {faq.map((data, index) => (
                                                <div className="accordion-item card bg-flashlight" key={index} itemscope="" itemprop="mainEntity" itemtype="https://schema.org/Question">
                                                    <h2
                                                        className="accordion-header card-header"
                                                        id={`heading${index + 1}`}
                                                        itemprop="name"
                                                    >
                                                        <button className={`accordion-button ${!data.isExpand ? "collapsed" : ""}`}
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapse${index + 1}`}
                                                            aria-expanded={data.isExpand ? "true" : "false"}
                                                            aria-controls={`collapse${index + 1}`}
                                                        >
                                                            {data.title}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse${index + 1}`}
                                                        className={`accordion-collapse collapse ${data.isExpand ? "show" : ""
                                                            }`}
                                                        aria-labelledby={`heading${index + 1}`}
                                                        data-bs-parent="#accordionExamplea"
                                                        itemscope="" itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"
                                                    >
                                                        <div className="accordion-body card-body" itemprop="text">
                                                            <span dangerouslySetInnerHTML={{ __html: data.desc }}></span>
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
                </div>
            </div>
        </>
    );
};

export default SalaryHikeCalculator;
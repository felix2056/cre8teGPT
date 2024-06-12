import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

import sal from "sal.js";

const AgeComparisonCalculator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState("static");
    const [results, setResults] = useState(null);

    const faq = [
        {
            title: "How to find the age difference between two dates?",
            desc: `<p>
                <ul>
                    <li><strong>Step 1:</strong> Enter the birth details of the two persons (i.e) Person A and Person B.</li>
                    <li><strong>Step 2:</strong> DOB’s are formatted in DD-MM-YYYY.</li>
                    <li><strong>Step 3:</strong> Subtract Younger’s DOB and Elder’s DOB, (i.e.) A-B = C</li>
                    <li><strong>Step 4:</strong> Now you get C.</li>
                    <li><strong>Step 5:</strong> Thus the age difference is found easily now.</li>
                </ul>
            </p>`,
            isExpand: true
        },
        {
            title: "What is the formula for age difference?",
            desc: `<p>Age Difference is the difference between two ages. The formula for age difference is</p>
                <p>A - B = C</p>
                <p>That means you minus the two ages or minus the two Date of Birth(DOB)’s.</p>`,
            isExpand: false
        },
        {
            title: "What is a birthday comparison calculator?",
            desc: `<p>
                    If you want to compare age or to find an exact age difference between the younger and older age , use this age comparison calculator. This web tool has used effective steps to get you the precise answer in the next few seconds. Anybody can access this online birthday comparison calculator from anywhere. 
                </p>`,
            isExpand: false
        },
        {
            title: "How can I count my birthday?",
            desc: `<p>
                    Then you can simple subtract the number of years from the current year, number of days and you will have found out your date of birth. Example 1: A is 32 years and 12 days old on 12 January 2021. When would be his birthday? Example 2: B is 27 years and 2 months 1 day old on 8 January 2021.
                </p>`,
            isExpand: false
        },
        {
            title: "How to calculate age difference in years?",
            desc: `<p>
                    To calculate the age difference in years, you need to subtract the birth year of the younger person from the birth year of the elder person. The result will be the age difference in years between the two individuals.
                </p>`,
            isExpand: false
        },
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
            const younger_date = formData.get("younger_date");
            const elder_date = formData.get("elder_date");
            const calculate_type = type;

            if (younger_date.trim() === "" || elder_date.trim() === "") {
                toast.error("Please enter both dates.");
                setIsLoading(false);
                return;
            }

            let new_younger_date = new Date(younger_date);
            let new_elder_date = new Date(elder_date);

            if (new_elder_date.getTime() > new_younger_date.getTime()) {
                toast.error("The elder person must be older than the younger person.");
                setIsLoading(false);
                return;
            }

            if (calculate_type == 'static') {
                let diffYears = Math.floor((new_younger_date - new_elder_date) / 31536e6).toLocaleString();
                let diffMonths = Math.floor((new_younger_date - new_elder_date) / 2628e6).toLocaleString();
                let diffDays = Math.floor((new_younger_date - new_elder_date) / 864e5).toLocaleString();
                let diffHours = Math.floor((new_younger_date - new_elder_date) / 36e5).toLocaleString();
                let diffMinutes = Math.floor((new_younger_date - new_elder_date) / 6e4).toLocaleString();
                let diffSeconds = Math.floor((new_younger_date - new_elder_date) / 1e3).toLocaleString();

                result = "<p>"
                result += "<strong>Years - </strong>" + diffYears + "<br/>";
                result += "<strong>Months - </strong>" + diffMonths + "<br/>";
                result += "<strong>Days - </strong>" + diffDays + "<br/>";
                result += "<strong>Hours - </strong>" + diffHours + "<br/>";
                result += "<strong>Minutes - </strong>" + diffMinutes + "<br/>";
                result += "<strong>Seconds - </strong>" + diffSeconds;
                result += "</p>";
            } else if (calculate_type == 'dynamic') {
                let diff = new Date(new_younger_date.getTime() - new_elder_date.getTime());

                let diffYears = (diff.getUTCFullYear() - 1970).toLocaleString();
                let diffMonths = diff.getUTCMonth().toLocaleString();
                let diffDays = (diff.getUTCDate() - 1).toLocaleString();
                let diffHours = diff.getUTCHours().toLocaleString();
                let diffMinutes = diff.getUTCMinutes().toLocaleString();
                let diffSeconds = diff.getUTCSeconds().toLocaleString();

                result = "";

                if (diffYears > 0) result += diffYears + " year(s), ";
                if (diffMonths > 0) result += diffMonths + " month(s), ";
                if (diffDays > 0) result += diffDays + " day(s), ";
                if (diffHours > 0) result += diffHours + " hour(s), ";
                if (diffMinutes > 0) result += diffMinutes + " minute(s), ";
                if (diffSeconds > 0) result += diffSeconds + " second(s)";
            }

            setResults("<p>Age Difference: " + result + "</p>");
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

    return (
        <>
            <ToastContainer />
            <div className="age-comparison-calculator rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Basic Tools</span>
                                    <h2 className="title" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        Age Comparison Calculator
                                    </h2>

                                    <p className="disc" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        Compare the age of two individuals to see the difference in years, months, weeks, days, hours, minutes, and seconds.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                                    <form onSubmit={calculate}>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Younger person birthday</label>
                                                            <input type="date" name="younger_date" required placeholder="2000-01-25" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Elder person birthday</label>
                                                            <input type="date" name="elder_date" required placeholder="2000-01-25" />
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" id="calculate_static" name="calculate_static" onChange={e => setType("static")} checked={type === "static"} defaultChecked />
                                                                <label className="form-check-label" htmlFor="calculate_static">Calculate statically</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" id="calculate_dynamic" name="calculate_dynamic" onChange={e => setType("dynamic")} checked={type === "dynamic"} />
                                                                <label className="form-check-label" htmlFor="calculate_dynamic">Calculate dynamically</label>
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
                                                            <div className="result" dangerouslySetInnerHTML={{ __html: results }}></div>
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
                                            Using the Age Comparison Calculator
                                        </h2>
                                        <p className="disc">
                                            This online age comparison calculator is a free tool used to compare ages between two individuals. On the other side, you can also compare younger’s date of birth (YDOB) and elder’s date of birth (EDOB) easily. It is also known as a birthday comparison calculator. The tool is user-friendly and provides accurate results quickly, making it a reliable choice for determining age differences in various contexts such as personal, educational, or professional scenarios.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 01:</span> Enter Dates</h3>
                                        <p className="disc">
                                            Enter the date of birth of the younger person and the elder person in the respective fields. Make sure the dates are entered in the correct format (MM/DD/YYYY or DD/MM/YYYY) to ensure accurate calculations.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 02:</span> Calculate</h3>
                                        <p className="disc">
                                            Click on the calculate button to compare the age of the two individuals. The calculator will process the input dates and compute the precise age difference.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper mb--0" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 03:</span> Results</h3>
                                        <p className="disc">
                                            The age difference between the two individuals will be displayed in years, months, weeks, days, hours, minutes, and seconds. This detailed breakdown allows you to understand the exact age gap in various time units. Additionally, the results page may offer options to share or print the comparison for your records.
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
                                    <div className="rainbow-accordion-style  accordion">
                                        <div className="accordion" id="accordionExamplea">
                                            {faq.map((data, index) => (
                                                <div className="accordion-item card bg-flashlight" key={index}>
                                                    <h2
                                                        className="accordion-header card-header"
                                                        id={`heading${index + 1}`}
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
                                                    >
                                                        <div className="accordion-body card-body">
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

export default AgeComparisonCalculator;
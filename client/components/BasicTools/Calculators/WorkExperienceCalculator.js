import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

import sal from "sal.js";

const WorkExperienceCalculator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);

    const faq = [
        {
            title: "How is work experience calculated?",
            desc: `<p>
                <ul>
                    <li><strong>Step 1:</strong> Enter the work experience details of the two dates (i.e) Date of Joining - A and Last Working Date - B</li>
                    <li><strong>Step 2:</strong> Dates are formatted in DD-MM-YYYY/MM-DD-YYYY.</li>
                    <li><strong>Step 3:</strong> Subtract Date of Joining and Last Working Date, (i.e.) A-B = C</li> 
                    <li><strong>Step 4:</strong> Now you get C.</li>
                    <li><strong>Step 5:</strong> Thus the work exp is found easily now.</li>
                </ul>
            </p>`,
            isExpand: true
        },
        {
            title: "What is the formula for work experience calculation?",
            desc: `<p>Work experience is the difference between two dates. The formula for work experience calculation is</p>
                <p>A - B = C</p>
                <p>That means you minus the two dates.</p>`,
            isExpand: false
        },
        {
            title: "How to calculate work experience?",
            desc: `<ul>
                    <li><strong>Step 1:</strong> First, consider the Date of Joining (i.e) DOJ.</li> 
                    <li><strong>Step 2:</strong> Then, consider the Last Working Date (i.e) LWD.</li>
                    <li><strong>Step 3:</strong> Calculate the difference between Date of Joining and Last Working Date.</li>
                    <li><strong>Step 4:</strong> Minus the two dates.</li> 
                    <li><strong>Step 5:</strong> Hence, the difference is mathematically proved.</li>
                </ul>`,
            isExpand: false
        },
        {
            title: "Why do we need to calculate work or job experience?",
            desc: `<p>it is necessary for everyone to know has to calculate their work or job total or relevant experience as it is the must criteria for them when they want to change the current company and join new one. No need to calculate your work experience manually, let Mr Online Tools do the dirty work for you - online calculator gives you the friendly way of calculating your work or job experience.</p>`,
            isExpand: false
        },
        {
            title: "How do i write my work experience in a resume?",
            desc: `<p>
                    <ul>
                        <li><strong>Step 1.</strong> Include your previous employers: Always provide the full names of all the companies for which you previously worked. It is best to list your work history in reverse chronological order, starting with the most recent job at the top, followed by the next most recent and so on.</li>
                        <li><strong>Step 2.</strong> Mention your job location: You also should include the location of your previous company. You do not have to provide the full address. Just mentioning the city and the state is sufficient.</li>
                        <li><strong>Step 3.</strong> Specify the dates of employment: Next, you should mention the start and end dates of each employment. The start date is when you started working, and the end date is your last date of employment with a company.</li>
                        <li><strong>Step 4.</strong> Write your job title: Clearly mention your job titles in the previous companies. Be specific when specifying the job titles. Instead of mentioning that you were a “Developer”, mention that you worked as a “Java Developer.”</li>
                        <li><strong>Step 5.</strong> List your responsibilities: In this part, you do not have to list down the job description of your previous employment. Try to concisely describe your significant responsibilities and skills, which helped you complete a task.</li>
                    </ul>
                </p>`,
            isExpand: false
        },
        {
            title: "How can i get work experience as a student?",
            desc: `<p>
                    <ul>
                        <li><strong>1. Formal work experience placement:</strong> Often up to a week in a location arranged by your school or independently. Typically unpaid, this is an opportunity to learn about the world of work and see it in action.</li>
                        <li><strong>2. School leaver careers fairs and employer events:</strong> A chance to meet either lots of employers in one go or a single employer, for example via an open evening at its offices. Look out for virtual events during the Covid-19 pandemic.</li>
                        <li><strong>3. Employer’s insight day or week for school leavers:</strong> Some organisations that run apprenticeships also offer you the chance to spend a day or more seeing for yourself what working there would be like and meeting employees who have joined straight from school. Professional services firms and IT employers commonly run insight weeks or days.</li>
                        <li><strong>4. Extracurricular activities:</strong> Being part of a sports team or another club or group such as a theatre group or choir. Involvement in the Scouts or Guides, or Duke of Edinburgh award scheme.</li>
                        <li><strong>5. Entrepreneurship:</strong> Perhaps you aspire to run your own business one day, or maybe you’ve got a commercial idea that you’re keen to get off the ground. Employers are keen to take on candidates with entrepreneurial flair, so it’s well worth honing your skills whether or not you go on to set up your own venture.</li>
                        <li><strong>6. Competitions:</strong> Look out for competitions in areas that interest you, for example design, writing, maths or business.</li>
                        <li><strong>7. Part-time jobs:</strong> A part-time job such as working in a shop gives you customer service and time management skills and helps to develop your commercial awareness. Doing a paper round or babysitting calls for responsibility and resilience. Employers like evidence that you can be relied on to turn up when expected and stick at what you’re meant to be doing till you’ve seen it through.</li>
                        <li><strong>8. Personal projects:</strong> If you’ve designed and made something under your own steam, such as a DIY or craft project, a website or a blog, you may well have developed the problem-solving and creative skills that employers look for.</li>
                        <li><strong>9. Positions of responsibility:</strong> Are you head boy or head girl, a sports captain or house captain? Have you been a student representative, taking prospective pupils and parents on tours and speaking to them, or been involved in the school council? Have you have a leadership or committee role in a group or club? This kind of experience hones the communication and leadership skills employers want.</li>
                    </ul>
                </p>`,
            isExpand: false
        },
        {
            title: "Why is work experience so important?",
            desc: `<p>Experience is important because it allows you to grow and evolve. When you are presented with a new environment, you will learn how to adapt to the situation to succeed. You may also develop brand new ideas and strategies as a result of your experience with different things.</p>`,
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
            const DOJ = formData.get("DOJ");
            const LWD = formData.get("LWD");

            if (DOJ.trim() == "" || LWD.trim() == "") {
                setIsLoading(false);
                return toast.error("Please enter both dates.");
            }

            let DOJ_date = new Date(DOJ);
            let LWD_date = new Date(LWD);

            if (DOJ_date.getTime() > LWD_date.getTime()) {
                setIsLoading(false);
                return toast.error("Date of Joining should be less than Last Working Date.");
            }

            let diff = new Date(LWD_date.getTime() - DOJ_date.getTime());

            let diffYears = (diff.getUTCFullYear() - 1970).toLocaleString();
            let diffMonths = diff.getUTCMonth().toLocaleString();
            let diffDays = (diff.getUTCDate() - 1).toLocaleString();
            let diffHours = diff.getUTCHours().toLocaleString();
            let diffMinutes = diff.getUTCMinutes().toLocaleString();
            let diffSeconds = diff.getUTCSeconds().toLocaleString();

            result = "<p>";
            if (diffYears > 0) result += diffYears + " year(s), ";
            if (diffMonths > 0) result += diffMonths + " month(s), ";
            if (diffDays > 0) result += diffDays + " day(s), ";
            if (diffHours > 0) result += diffHours + " hour(s), ";
            if (diffMinutes > 0) result += diffMinutes + " minute(s), ";
            if (diffSeconds > 0) result += diffSeconds + " second(s)";
            result += "</p>";

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
                                        Work Experience Calculator
                                    </h2>

                                    <p className="disc" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        The online work experience calculator is a free tool used to compare two dates. On the other side, you can also calculate Date of Joining(DOJ) and Last Working Date(LWD) easily. It is also known as a work exp calculator.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                                    <form onSubmit={calculate}>
                                                        <div className="form-group">
                                                            <label className="text-left h5">Date of Joining(DOJ)</label>
                                                            <input type="date" name="DOJ" className="form-control" placeholder="03/10/2015" />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="text-left h5">Last Working Date(LWD)</label>
                                                            <input type="date" name="LWD" className="form-control" placeholder="03/10/2024" />
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
                                                            <h5 className="summary-grid__label">Your work exp:</h5>
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
                                            How to Calculate Work Experience?
                                        </h2>
                                        <p className="disc">
                                            These steps can help you understand how to calculate work experience according to the educational or job opportunity before you. Whether you are preparing your resume, applying for a job, or pursuing higher education, accurately calculating your work experience is crucial. Follow the steps below to determine the length of your employment accurately.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 01:</span> Input</h3>
                                        <p className="disc">
                                            Enter the work experience details by specifying the two critical dates: Date of Joining (A) and Last Working Date (B). Ensure these dates are correct as they form the basis of your experience calculation.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 02:</span> Format</h3>
                                        <p className="disc">
                                            Format the dates in either DD-MM-YYYY or MM-DD-YYYY. Consistent formatting is essential for accurate calculation. Double-check the dates to avoid any errors that might affect the final result.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 03:</span> Subtract</h3>
                                        <p className="disc">
                                            Subtract the Date of Joining (A) from the Last Working Date (B) to calculate your total work experience, represented as (B - A = C). This calculation will give you the duration of your work experience in terms of years, months, and days.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 04:</span> Consider Overlaps</h3>
                                        <p className="disc">
                                            If you have multiple jobs, ensure you consider any overlaps between them. Adjust your total work experience by accounting for concurrent employment periods, ensuring each day is only counted once.
                                        </p>
                                    </div>
                                    <div className="single-steps-wrapper mb--0" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                        <h3 className="title"><span>Step 05:</span> Verify</h3>
                                        <p className="disc">
                                            Double-check your calculations and verify the dates to ensure accuracy. Having a precise calculation of your work experience can significantly impact your job applications and educational pursuits, providing a clear picture of your professional background.
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

export default WorkExperienceCalculator;
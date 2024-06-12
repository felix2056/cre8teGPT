import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Categories = () => {
    return (
        <>
            <div className="rts-tools-area rts-section-gap bg-tools">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="title-conter-area">
                                <h2 className="title">
                                    Generate AI Copy writing <br />
                                        Favorite Tools
                                </h2>
                                <p className="disc">
                                    Get better results in a fraction of the time.Finally, a writing tool you’ll actually use.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt--25 g-5">
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="single-tools-feature">
                                <div className="icon">
                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="50" rx="4" fill="#3F3EED" fill-opacity="0.1"></rect>
                                        <path d="M23.1719 17.5469C28 17.8281 32.1719 22 32.4531 26.7812C32.5 27.3906 32.0312 27.9531 31.4219 28C31.375 28 31.375 28 31.3281 28C30.7656 28 30.25 27.5312 30.25 26.9219C29.9688 23.2188 26.7344 19.9844 23.0312 19.75C22.4219 19.75 21.9531 19.1875 22 18.5781C22 17.9688 22.5625 17.5 23.1719 17.5469ZM23.5 13C30.9062 13 37 19.0938 37 26.5C37 27.3438 36.2969 28 35.5 28C34.6562 28 34 27.3438 34 26.5C34 20.7344 29.2656 16 23.5 16C22.6562 16 22 15.3438 22 14.5C22 13.7031 22.6562 13 23.5 13ZM21.0625 23.6406C24.5781 24.3438 27.1562 27.8594 26.3125 31.7031C25.7969 34.2344 23.7344 36.2969 21.2031 36.8125C16.8438 37.75 13 34.4219 13 30.25V18.625C13 18.0156 13.4688 17.5469 14.0781 17.5469H16.3281C16.9844 17.5469 17.4531 18.0156 17.4531 18.625V30.2031C17.4531 31.375 18.4844 32.4062 19.75 32.4062C20.9688 32.4062 22 31.4219 22 30.2031C22 29.2656 21.3438 28.4219 20.5 28.1406C20.0781 28 19.75 27.625 19.75 27.1094V24.7656C19.75 24.0625 20.3594 23.5 21.0625 23.6406Z" fill="#3F3EED"></path>
                                    </svg>
                                </div>
                                <h5 className="title">
                                    Blog Content
                                </h5>
                                <p className="disc">
                                    Write a first draft. The first draft should be written in long-form breaking.
                                </p>
                                <a href="use-case.html" className="rts-btn btn-lonly">Try Blog Content <i className="fa-regular fa-arrow-right"></i></a>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="single-tools-feature">
                                <div className="icon">

                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="50" rx="4" fill="#33B89F" fill-opacity="0.1"></rect>
                                        <path d="M29.5 25C29.5 26.6875 28.1406 28 26.5 28L19.0938 28.0469L15.2031 30.9531C14.9219 31.1406 14.5 30.9531 14.5 30.5781V28.0469L13 28C11.3125 28 10 26.6875 10 25V16C10 14.3594 11.3125 13 13 13H26.5C28.1406 13 29.5 14.3594 29.5 16V25ZM37 19C38.6406 19 40 20.3594 40 22V31.0469C40 32.6875 38.6406 34 37 34H35.5V36.5781C35.5 36.9531 35.0312 37.1406 34.7031 36.9062L30.8125 34H24.9531C23.3125 34 22 32.6875 22 31V29.5H26.5C28.9375 29.5 31 27.4844 31 25V19H37Z" fill="#33B89F"></path>
                                    </svg>

                                </div>
                                <h5 className="title">
                                    Social Media Content
                                </h5>
                                <p className="disc">
                                    Social media content should also visually appealing, using images and videos.
                                </p>
                                <a href="use-case.html" className="rts-btn btn-lonly">Try Social Content <i className="fa-regular fa-arrow-right"></i></a>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="single-tools-feature">
                                <div className="icon">
                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="50" rx="4" fill="#2A85C8" fill-opacity="0.1"></rect>
                                        <path d="M13 14.125C13 13.5156 13.4688 13 14.125 13H17.5C18.0156 13 18.4844 13.4219 18.5781 13.9375L18.6719 14.5H38.3594C39.3438 14.5 40.0938 15.4844 39.8125 16.4219L37.2812 25.4219C37.0938 26.0781 36.5312 26.5 35.8281 26.5H20.9688L21.3906 28.75H35.875C36.4844 28.75 37 29.2656 37 29.875C37 30.5312 36.4844 31 35.875 31H20.4531C19.9375 31 19.4688 30.625 19.375 30.1094L16.5625 15.25H14.125C13.4688 15.25 13 14.7812 13 14.125ZM23.5 34.75C23.5 36.0156 22.4688 37 21.25 37C19.9844 37 19 36.0156 19 34.75C19 33.5312 19.9844 32.5 21.25 32.5C22.4688 32.5 23.5 33.5312 23.5 34.75ZM32.5 34.75C32.5 33.5312 33.4844 32.5 34.75 32.5C35.9688 32.5 37 33.5312 37 34.75C37 36.0156 35.9688 37 34.75 37C33.4844 37 32.5 36.0156 32.5 34.75ZM14.875 17.5C15.4844 17.5 16 18.0156 16 18.625C16 19.2812 15.4844 19.75 14.875 19.75H11.125C10.4688 19.75 10 19.2812 10 18.625C10 18.0156 10.4688 17.5 11.125 17.5H14.875ZM15.625 21.25C16.2344 21.25 16.75 21.7656 16.75 22.375C16.75 23.0312 16.2344 23.5 15.625 23.5H11.125C10.4688 23.5 10 23.0312 10 22.375C10 21.7656 10.4688 21.25 11.125 21.25H15.625ZM16.375 25C16.9844 25 17.5 25.5156 17.5 26.125C17.5 26.7812 16.9844 27.25 16.375 27.25H11.125C10.4688 27.25 10 26.7812 10 26.125C10 25.5156 10.4688 25 11.125 25H16.375Z" fill="#2A85C8"></path>
                                    </svg>
                                </div>
                                <h5 className="title">
                                    eCommerce copy
                                </h5>
                                <p className="disc">
                                    Introducing new line wireless earbuds designed with the active person.
                                </p>
                                <a href="use-case.html" className="rts-btn btn-lonly">Try eCommerce Copy<i className="fa-regular fa-arrow-right"></i></a>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="single-tools-feature">
                                <div className="icon">

                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="50" rx="4" fill="#EBA43B" fill-opacity="0.1"></rect>
                                        <path d="M17.25 14.5H24.2344C25.0312 14.5 25.7812 14.8281 26.3438 15.3906L34.5938 23.6406C35.7656 24.8125 35.7656 26.7344 34.5938 27.9062L28.3594 34.1406C27.1875 35.3125 25.2656 35.3125 24.0938 34.1406L15.8438 25.8906C15.2812 25.3281 15 24.5781 15 23.7812V16.75C15 15.5312 15.9844 14.5 17.25 14.5ZM20.25 21.25C21.0469 21.25 21.75 20.5938 21.75 19.75C21.75 18.9531 21.0469 18.25 20.25 18.25C19.4062 18.25 18.75 18.9531 18.75 19.75C18.75 20.5938 19.4062 21.25 20.25 21.25Z" fill="#EBA43B"></path>
                                    </svg>

                                </div>
                                <h5 className="title">
                                    Sales Copy
                                </h5>
                                <p className="disc">
                                    You tired of overspending on products that don't live up to their promises?
                                </p>
                                <a href="use-case.html" className="rts-btn btn-lonly">Try Sales Copy<i className="fa-regular fa-arrow-right"></i></a>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="single-tools-feature">
                                <div className="icon">

                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="50" rx="4" fill="#E331D2" fill-opacity="0.1"></rect>
                                        <path d="M13 17.5C13 15.8594 14.3125 14.5 16 14.5H34C35.6406 14.5 37 15.8594 37 17.5V32.5C37 34.1875 35.6406 35.5 34 35.5H16C14.3125 35.5 13 34.1875 13 32.5V17.5ZM17.5 20.5C18.2969 20.5 19 19.8438 19 19C19 18.2031 18.2969 17.5 17.5 17.5C16.6562 17.5 16 18.2031 16 19C16 19.8438 16.6562 20.5 17.5 20.5ZM34 19C34 18.3906 33.4844 17.875 32.875 17.875H21.625C20.9688 17.875 20.5 18.3906 20.5 19C20.5 19.6562 20.9688 20.125 21.625 20.125H32.875C33.4844 20.125 34 19.6562 34 19Z" fill="#E331D2"></path>
                                    </svg>

                                </div>
                                <h5 className="title">
                                    Website copy
                                </h5>
                                <p className="disc">
                                    Our toys are made the highest quality materials and designed to provide.
                                </p>
                                <a href="use-case.html" className="rts-btn btn-lonly">Try Website Copy<i className="fa-regular fa-arrow-right"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="single-tools-feature">
                                <div className="icon">

                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="50" rx="4" fill="#5584FF" fill-opacity="0.1"></rect>
                                        <path d="M21.75 24.1562L22.7344 26.125H20.7188L21.75 24.1562ZM31.5 26.125C31.5 26.7812 30.9844 27.25 30.375 27.25C29.7188 27.25 29.25 26.7812 29.25 26.125C29.25 25.5156 29.7188 25 30.375 25C30.9844 25 31.5 25.5156 31.5 26.125ZM36 14.5C37.6406 14.5 39 15.8594 39 17.5V32.5C39 34.1875 37.6406 35.5 36 35.5H15C13.3125 35.5 12 34.1875 12 32.5V17.5C12 15.8594 13.3125 14.5 15 14.5H36ZM22.7344 21.1562C22.5469 20.7812 22.1719 20.5 21.75 20.5C21.2812 20.5 20.9062 20.7812 20.7188 21.1562L17.3438 27.9062C17.0625 28.4688 17.2969 29.125 17.8594 29.4062C18.4219 29.6875 19.0781 29.4531 19.3594 28.8906L19.5938 28.375H23.8594L24.0938 28.8906C24.375 29.4531 25.0312 29.6875 25.5938 29.4062C26.1562 29.125 26.3906 28.4688 26.1094 27.9062L22.7344 21.1562ZM31.5 22.9844C31.125 22.8438 30.75 22.75 30.375 22.75C28.5 22.75 27 24.2969 27 26.125C27 28 28.5 29.5 30.375 29.5C30.8906 29.5 31.3594 29.4062 31.8281 29.1719C32.0156 29.4062 32.2969 29.5 32.625 29.5C33.2344 29.5 33.75 29.0312 33.75 28.375V21.625C33.75 21.0156 33.2344 20.5 32.625 20.5C31.9688 20.5 31.5 21.0156 31.5 21.625V22.9844Z" fill="#5585FF"></path>
                                    </svg>

                                </div>
                                <h5 className="title">
                                    Digital Add Copy
                                </h5>
                                <p className="disc">
                                    Our toys are made the highest quality materials and designed to provide.
                                </p>
                                <a href="use-case.html" className="rts-btn btn-lonly">Try Website Copy<i className="fa-regular fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Categories;
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Testimonials = () => {
    return (
        <>
            <div className="our-trusted-clients rts-section-gapBottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="title-center-three">
                                <span className="pre">Our Clients</span>
                                <h2 className="title"> <span>10,000+</span> professionals &amp; teams <br />
                                    choose Openup</h2>
                                <p>professionals &amp; teams choose Openup</p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt--50">
                        <div className="col-lg-12">
                            <div className="brand-area-main-wrapper-one">
                                <img src="images/01.png" alt="brand" loading="lazy" />
                                <img src="images/02_1.png" alt="brand" loading="lazy" />
                                <img src="images/03_1.png" alt="brand" loading="lazy" />
                                <img src="images/04_1.png" alt="brand" loading="lazy" />
                                <img src="images/05_1.png" alt="brand" loading="lazy" />
                                <img src="images/06.png" alt="brand" loading="lazy" />
                            </div>
                        </div>
                    </div>
                    <div className="row mt--60 g-5">
                        <div className="col-lg-4">
                            <div className="single-testimonial-three">
                                <div className="top-area">
                                    <div className="author">
                                        <img src="images/09_2.png" alt="team-area" />
                                        <div className="info-wrapper-area">
                                            <p>
                                                Samuel
                                            </p>
                                            <span>Blogger</span>
                                        </div>
                                    </div>
                                    <div className="start-area">
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                    </div>
                                </div>
                                <div className="body">
                                    <p>So glad i found openup!! It has made my blog tasks a billion times more enjoyable (which is an emotion way beyond.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="single-testimonial-three">
                                <div className="top-area">
                                    <div className="author">
                                        <img src="images/10_4.png" alt="team-area" loading="lazy" />
                                        <div className="info-wrapper-area">
                                            <p>
                                                James
                                            </p>
                                            <span>Author</span>
                                        </div>
                                    </div>
                                    <div className="start-area">
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                    </div>
                                </div>
                                <div className="body">
                                    <p>So glad i found openup!! It has made my blog tasks a billion times more enjoyable (which is an emotion way beyond.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="single-testimonial-three">
                                <div className="top-area">
                                    <div className="author">
                                        <img src="images/11_2.png" alt="team-area" loading="lazy" />
                                        <div className="info-wrapper-area">
                                            <p>
                                                Sophia
                                            </p>
                                            <span>SEO contain writer</span>
                                        </div>
                                    </div>
                                    <div className="start-area">
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star"></i>
                                    </div>
                                </div>
                                <div className="body">
                                    <p>So glad i found openup!! It has made my blog tasks a billion times more enjoyable (which is an emotion way beyond.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Testimonials;
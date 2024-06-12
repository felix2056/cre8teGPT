import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import sal from "sal.js";

import axios from 'axios'
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
import { setupCache } from 'axios-cache-interceptor';

const cache = axios.create();
const api = setupCache(cache);

const FeaturedTools = () => {
    const [tools, setTools] = useState([]);

    useEffect(() => {
        sal();

        try {
            getTools();
        } catch (error) {
            console.error("Error fetching featured tools:", error);
        }
    }, []);

    const getTools = async () => {
        const response = await api.get('/api/tools/featured');
        setTools(response.data.tools);
    }

    return (
        <>
            <div className="case-area-start index-two rts-section-gap">
                {/* <span className="bg-text">Featured AI Tools</span> */}
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="title-left-area" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100">
                                <span className="pre-title-bg">Featured AI Tools</span>
                                <h2 className="title">
                                    Content Cre8tors <br />
                                    Favorite Tools
                                </h2>
                                <Link href="/tools">View All Tools <i className="fa-solid fa-arrow-right"></i></Link>
                            </div>
                        </div>

                        {tools.map((tool, index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12" key={index} data-sal-duration="700" data-sal-delay="100">
                            <div className="single-case-area-wrapper">
                                <div className="icon">
                                    <img src={ tool.icon } alt={ tool.name } loading="lazy" width={50} height={50} />
                                </div>

                                <Link href={ tool.url }>
                                    <h5 className="title">{ tool.name }</h5>
                                </Link>
                                
                                <p className="disc">
                                    { tool.description }
                                </p>
                                
                                <Link href={ tool.url }>Try { tool.name } <i className="fa-solid fa-arrow-right"></i></Link>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeaturedTools;
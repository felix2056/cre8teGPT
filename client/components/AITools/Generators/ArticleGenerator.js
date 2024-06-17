import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

import sal from "sal.js";
import Separator from "@/pages/separator";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ContentSkeleton from "@/components/Skeletons/Content";
import TipTapEditor from "@/components/AITools/Utils/TipTapEditor";
import Brands from "@/components/Brands/Brands";
import AccordionItem from "@/components/Accordion/AccordionItem";

import axios from "axios";
import Image from "next/image";

const ArticleGenerator = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingKeyword, setIsLoadingKeyword] = useState(false);
    const [isLoadingDomain, setIsLoadingDomain] = useState(false);
    const [isLoadingURL, setIsLoadingURL] = useState(false);
    const [isLoadingStructures, setIsLoadingStructures] = useState(false);
    const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
    const [isLoadingArticle, setIsLoadingArticle] = useState(false);

    const [input, setInput] = useState('');
    const [type, setType] = useState('keyword'); // 'keyword', 'domain', 'url'

    const [keywords, setKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [selectedKeyword, setSelectedKeyword] = useState('');

    const [structures, setStructures] = useState([]);
    const [selectedStructure, setSelectedStructure] = useState('');

    const [ideas, setIdeas] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState('');

    const [article, setArticle] = useState('');

    const features = [
        {
            class: "col-lg-6 col-md-6 col-sm-6 col-12",
            image: "/images/screenshots/article-generator/keywords.png",
            title: "Personalized Keyword Boost",
            desc: "Target the right audience, every time. Cre8teGPT's smart keyword extraction analyzes your content to pinpoint ideal keywords. Craft laser-focused articles that hook your readers and skyrocket engagement."
        },
        {
            class: "col-lg-6 col-md-6 col-sm-6 col-12",
            image: "/images/screenshots/article-generator/structures.png",
            title: "Master Keywords, Master SEO",
            desc: "Find the perfect SEO keywords for your topic! Just click a structure, and we'll show you a list of options to fill in the blanks. Easy-to-use tools help you optimize your content for better search results.",
        },
        {
            class: "col-lg-6 col-md-6 col-sm-6 col-12",
            image: "/images/screenshots/article-generator/ideas.png",
            title: "Campaign Ideas in Seconds",
            desc: "Cre8teGPT uses AI to generate fresh, programmatic campaign ideas based on your keywords. Craft articles your audience will love, and supercharge your SEO rankings effortlessly.",
        },
        {
            class: "col-lg-6 col-md-6 col-sm-6 col-12",
            image: "/images/screenshots/article-generator/article.png",
            title: "Write Like a Pro (Easy)",
            desc: "Our advanced article generator transforms your keyword and campaign concept into polished, professional content. Publish articles ready to impress your audience and establish your expertise.",
        },
    ];

    useEffect(() => {
        // Apply class to body
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

    useEffect(() => {
        if (input.startsWith("http") || input.startsWith("www")) {
            setType("url");
        } else if (input.includes(".") && !input.includes(" ") && !input.includes("http") && !input.includes("www")) {
            setType("domain");
        } else {
            setType("keyword");
        }
    }, [input]);

    useEffect(() => {
        if (selectedKeyword && selectedKeyword.trim() !== "") {
            // generate structures
            generateStructures();
        }
    }, [selectedKeyword]);

    useEffect(() => {
        if (selectedStructure && selectedStructure.trim() !== "") {
            // generate ideas
            generateIdeas();
        }
    }, [selectedStructure]);

    // useEffect(() => {
    //     if (selectedIdea && selectedIdea.trim() !== "") {
    //         // generate article
    //         generateArticle();
    //     }
    // }, [selectedIdea]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate input
        if (!input || input.trim() === "") {
            toast.error("Please enter a valid input 📝.", {
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

        try {
            setIsLoading(true);
            setKeywords([]);
            setSelectedKeyword("");

            setStructures([]);
            setSelectedStructure("");

            setIdeas([]);
            setSelectedIdea("");

            setArticle("");

            if (type === "keyword") {
                await generateStructures();
            } else if (type === "domain") {
                setIsLoadingDomain(true);

                const response = await axios.post('/api/tools/generators/article-generator-domain', { input });
                if (response.data.keywords) {
                    setKeywords(response.data.keywords);
                    setIsLoading(false);
                    setIsLoadingDomain(false);
                }
            } else if (type === "url") {
                setIsLoadingURL(true);

                const response = await axios.post('/api/tools/generators/article-generator-url', { input });
                if (response.data.keywords) {
                    setKeywords(response.data.keywords);
                    setIsLoading(false);
                    setIsLoadingURL(false);
                }
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setIsLoadingKeyword(false);
            setIsLoadingDomain(false);
            setIsLoadingURL(false);

            toast.error("Error generating article. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const generateStructures = async () => {
        try {
            setIsLoadingStructures(true);
            setStructures([]);
            setSelectedStructure("");

            setIdeas([]);
            setSelectedIdea("");
            setArticle("");

            const structuresScrollPoint = document.querySelector(".structures-scroll-point");
            structuresScrollPoint.scrollIntoView({ behavior: "smooth" });

            let domain = null;
            let keyword = selectedKeyword;

            if (type === "domain") {
                domain = input;
            } else if (type === "url") {
                const url = new URL(input);
                domain = url.hostname;
            }

            if (type === "keyword") keyword = input;

            const response = await axios.post('/api/tools/generators/article-generator-structures', { keyword, domain });

            setStructures(response.data.structures);
            setIsLoadingStructures(false);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching structures. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingStructures(false);
        }
    };

    const generateIdeas = async () => {
        try {
            setIsLoadingIdeas(true);
            setIdeas([]);
            setSelectedIdea("");

            setArticle("");

            const ideasScrollPoint = document.querySelector(".ideas-scroll-point");
            ideasScrollPoint.scrollIntoView({ behavior: "smooth" });

            const response = await axios.post('/api/tools/generators/article-generator-ideas', { structure: selectedStructure });

            setIdeas(response.data.ideas);
            setIsLoadingIdeas(false);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching ideas. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingIdeas(false);
        }
    };

    const generateArticle = async () => {
        try {
            setIsLoadingArticle(true);
            setArticle("");

            let title = combineResults(selectedStructure, selectedIdea);
            let domain = null;

            if (type === "domain") {
                domain = input;
            } else if (type === "url") {
                const url = new URL(input);
                domain = url.hostname;
            }

            const response = await axios.post('/api/tools/generators/article-generator-article', { title, domain });

            setArticle(response.data.article);
            setIsLoadingArticle(false);
        } catch (error) {
            console.error(error);
            toast.error("Error generating article. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoadingArticle(false);
        }
    };

    const combineResults = (structure, idea) => {
        let result = structure;
        const variables = structure.match(/{(.*?)}/g);

        if (variables) {
            variables.forEach((variable) => {
                result = result.replace(variable, idea);
            });
        }

        return result;
    };

    const convertArticleToHTML = (article) => {
        const lines = article.split("\n\n"); // Split text by double newlines
        let html = "";

        for (const line of lines) {
            // handle starting and ending tags
            if (line.startsWith("### ")) {
                html += `<li className="mb-4">${line.slice(4)}</li>`;
            } else if (line.startsWith("- ") || line.match(/^\d+\. /)) {
                html += `<li className="mb-4">${line.slice(2)}</li>`;
            } else if (line.startsWith("**") && line.endsWith("**")) {
                html += `<strong>${line.slice(2, -2)}</strong>`;
            } else if (line.startsWith("*") && line.endsWith("*")) {
                html += `<em>${line.slice(1, -1)}</em>`;
            } else if (line.startsWith("```")) {
                html += `<pre>${line.slice(3)}</pre>`;
            } else if (line.startsWith("![") && line.endsWith(")")) {
                html += `<img src="${line.slice(2, -1)}" alt="Image" />`;
            } else {
                html += `<p className="mb-4">${line}</p>`;
            }

            // handle inline tags
            html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // **bold**
            html = html.replace(/\*(.*?)\*/g, "<em>$1</em>"); // *italic*
            html = html.replace(/`(.*?)`/g, "<code>$1</code>"); // `code`
            html = html.replace(/~~(.*?)~~/g, "<del>$1</del>"); // ~~strikethrough~~
            html = html.replace(/__(.*?)__/g, "<u>$1</u>"); // __underline__
            html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>"); // [link](url)
            html = html.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>"); // blockquote
        }

        // restart scroll animations
        setTimeout(() => {
            sal();
        }, 1000);

        return html;
    }

    const addKeyword = (e) => {
        if (e.key === 'Enter' && keywordInput.trim() !== '') {
            e.preventDefault();
            if (!keywords.includes(keywordInput.trim())) {
                setKeywords([...keywords, keywordInput.trim()]);
                setKeywordInput('');
            }
        }
    };

    const getReadTime = (text) => {
        const wordsPerMinute = 200;

        if (typeof text === "string") {
            const numberOfWords = text.split(/\s/g).length;
            return Math.ceil(numberOfWords / wordsPerMinute);
        }

        if (Array.isArray(text)) {
            const numberOfWords = text.join(" ").split(/\s/g).length;
            return Math.ceil(numberOfWords / wordsPerMinute);
        }

        return 0;
    };

    const copyToClipboard = (text) => {
        copy(text);
        toast.success("Copied", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    return (
        <>
            <ToastContainer />

            <div className="rainbow-service-area rainbow-section-gap">
                <div className="caase-details-area-start rts-section-gap bg-tools">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-conter-area top-tt">
                                    <span className="pre-title-bg">Content Generators</span>
                                    <h2 className="title">
                                        Article Generator
                                    </h2>

                                    <p className="disc">
                                        Stop staring at a blank page. Generate high-quality, SEO-friendly articles from keywords, domains, or URLs.
                                    </p>

                                    <div className="search__generator mt--50">
                                        <div className="tab-content mt--50" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                <div className="searchoptopn-area mb--30">
                                                    <form action="#" onSubmit={handleSubmit}>
                                                        <input type="text" name="input" placeholder="Enter keyword, domain or URL" value={input} onChange={(e) => setInput(e.target.value)} required />
                                                        <button type="submit">
                                                            {isLoading ? "" : "Scan"}
                                                            {isLoading && (
                                                                <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                            )}
                                                        </button>
                                                    </form>
                                                </div>
                                                {type === "domain" && (
                                                    <p className="text m-0">Cre8teGPT will scan the domain as well as any linked pages to extract relevant keywords. Domain scanning may take longer than URL scanning.</p>
                                                )}

                                                {type === "url" && (
                                                    <p className="text m-0">Cre8teGPT will scan the URL to extract relevant keywords that you can use to generate programmatic campaign ideas for your article.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(isLoadingDomain || isLoadingURL) && <ContentSkeleton number={1} />}
                        {(keywords.length > 0) && (
                            <div className="search__generator mt--50">
                                <div className="tab-content mt--50" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="searchoptopn-area mb--30">
                                            <div className="row">
                                                <div className="article-generator-tags col-lg-12">
                                                    <div className="form-group">
                                                        <h4 className="title">
                                                            <span className="badge badge-success" style={{ background: "#3F3EED" }}> {keywords.length}</span> Keywords Found
                                                        </h4>

                                                        <p className="disc">
                                                            Below is a list of keywords which Cre8teGPT has extracted from the {type === "domain" ? "domain" : "URL"} you provided and believes are relevant to your site. You can use these keywords to generate programmatic campaign ideas for your article. Click on a keyword or add more to begin.
                                                        </p>

                                                        <div className="tag-input-container mb--20">
                                                            <div className="tag-list">
                                                                {keywords.map((keyword, index) => (
                                                                    <div key={index} className={`tag ${selectedKeyword === keyword ? "tag-active" : ""}`} onClick={() => setSelectedKeyword(keyword)}>
                                                                        {keyword}
                                                                    </div>
                                                                ))}
                                                                <input
                                                                    type="text"
                                                                    value={keywordInput}
                                                                    onChange={(e) => setKeywordInput(e.target.value)}
                                                                    onKeyDown={addKeyword}
                                                                    placeholder="Add a keyword and hit 'ENTER'"
                                                                    className="tag-input"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="structures-scroll-point"></div>
                        {(isLoadingStructures) && <ContentSkeleton number={1} />}
                        {(structures.length > 0) && (
                            <div className="search__generator mt--50">
                                <div className="tab-content mt--50" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="searchoptopn-area mb--30">
                                            <div className="form-group">
                                                <h4 className="title">
                                                    <span className="badge badge-success" style={{ background: "#3F3EED" }}> {structures.length}</span> SEO-Friendly Keyword Structures
                                                </h4>

                                                <p className="disc">
                                                    Below are some possible SEO-Friendly keyword structures that are relevant to <strong>{selectedKeyword}</strong>. Click on any structure to generate a list of potential values for each variable and keyword.
                                                </p>
                                            </div>

                                            <div className="article-generator-keyword-structures row">
                                                {structures.map((structure, index) => (
                                                    <div className="single-structure col-12" key={index}>
                                                        <p className={`text ${structure === selectedStructure ? "selected" : ""}`} onClick={() => setSelectedStructure(structure)}>
                                                            {structure}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="ideas-scroll-point"></div>
                        {(isLoadingIdeas) && <ContentSkeleton number={1} />}
                        {(ideas.length > 0) && (
                            <div className="search__generator mt--50">
                                <div className="tab-content mt--50" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="searchoptopn-area mb--30">
                                            <div className="form-group">
                                                <h4 className="title">
                                                    <span className="badge badge-success" style={{ background: "#3F3EED" }}> {ideas.length}</span> Programmatic Campaign Ideas
                                                </h4>

                                                <p className="disc">
                                                    Below are some programmatic campaign ideas that Cre8teGPT has generated based on the SEO-friendly keyword structure and value you selected. Click on any idea to generate a full article.
                                                </p>
                                            </div>

                                            <div className="article-generator-keyword-ideas row">
                                                {ideas.map((idea, index) => (
                                                    <div className="single-structure col-6 mt-3" key={index}>
                                                        <p className={`text ${idea === selectedIdea ? "selected" : ""}`} onClick={() => setSelectedIdea(idea)}>
                                                            {idea}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="searchoptopn-area mb--30">
                                            <div className="form-group">
                                                <h4 className="title">
                                                    <span className="badge badge-success" style={{ background: "#3F3EED" }}> {ideas.length}</span> Keywords
                                                </h4>

                                                <p className="disc">
                                                    Below is a combination of the keyword structures and ideas you selected. You can click on any one and hit <strong>"Generate Article"</strong> to generate a full article based on the selected combination.
                                                </p>
                                            </div>

                                            <div className="article-generator-keyword-ideas row">
                                                {ideas.map((idea, index) => (
                                                    <div className="single-structure col-12 mt-3" key={index}>
                                                        <p className={`text ${idea === selectedIdea ? "selected" : ""}`} onClick={() => setSelectedIdea(idea)}>
                                                            {combineResults(selectedStructure, idea)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="form-group mt-3">
                                                <button type="submit" onClick={generateArticle} className="position-relative" style={{ width: "100%", left: "0", right: "0", transform: "none" }}>
                                                    {isLoadingArticle ? ("Generating Article") : ("Generate Article")}
                                                    {isLoadingArticle ? (
                                                        <i className="fa-solid fa-spinner-third fa-spin"></i>
                                                    ) : (
                                                        <img src="/images/icons/13.png" alt="" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(isLoadingArticle) && <ContentSkeleton number={1} />}
                        {(article && article.trim() !== "") && (
                            <div className="search__generator mt--50">
                                <div className="tab-content mt--50" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="searchoptopn-area mb--30">
                                            <div className="form-group">
                                                <h4 className="title">
                                                    Article Title: <span className="badge badge-success text-capitalize" style={{ background: "green" }}> {combineResults(selectedStructure, selectedIdea)}</span>
                                                </h4>

                                                <p className="disc">
                                                    Below is the article generated by Cre8teGPT based on the keyword structure and idea you selected. You can copy-paste the article on your preferred CMS/Text Editor or use our partner-platform AI writing assistant "Yomu AI" to further enhance the article.
                                                </p>
                                            </div>

                                            <div className="article-generator-article row">
                                                <div className="col-lg-12">
                                                    <div className="article-content">
                                                        <TipTapEditor content={convertArticleToHTML(article)} setContent={setArticle} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Separator top={true} />

                        <div className="feature-area-start rts-section-gapTop rts-section-gapBottom bg-smooth-2 bg-tools">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-center-feature text-center">
                                            <h2 className="title">Beat Writer's Block, Craft Quality Articles in Seconds</h2>
                                            <p className="disc">
                                                Do you ever feel like there just aren't enough hours in the day to keep your content pipeline flowing?  You're not alone. Between running a business, managing marketing campaigns, and engaging with your audience, creating fresh, high-quality content can feel overwhelming.  That's where Cre8teGPT's Article Generator Tool comes in.
                                                <br />
                                                <strong>Imagine this:</strong> Instead of staring at a blank page, frustrated and unproductive, you simply enter a few keywords or a brief concept.  In seconds, Cre8teGPT's powerful AI starts your journey to a polished, professional article that's tailored to your specific needs and ready to publish.  No more writer's block, no more wasted time. Just high-quality content that engages your audience and boosts your SEO rankings.
                                            </p>
                                            <div className="button-group mt--50 text-center">
                                                <button className="btn-default btn-large" onClick={() => router.push("/tools/article-generator")}>
                                                    Get Started
                                                    <i className="fa-solid fa-arrow-right ml--10"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={false} />

                        <div className="rts-easy-steps-area rts-section-gapTop bg-tools">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-center-feature">
                                            <h2 className="title">Features of Cre8teGPT's Article Generator Assistant</h2>
                                            <p className="disc">
                                                Cre8teGPT's Article Generator Assistant is packed with powerful features to help you create engaging, SEO-friendly content in minutes. Here are just a few of the benefits you'll enjoy when you use our tool:
                                            </p>
                                        </div>
                                    </div>

                                    {features.map((data, index) => (
                                        <div
                                            className={data.class}
                                            data-sal="slide-up"
                                            data-sal-duration="700"
                                            data-sal-delay="200"
                                            key={index}
                                        >
                                            <div className="service service__style--1 bg-color-blackest radius mt--25 text-center rbt-border-none variation-4 bg-flashlight p-0">
                                                <div className="icon">
                                                    <img className="w-100 h-450px" src={data.image} alt={data.title} />
                                                </div>
                                                <div className="content p-5">
                                                    <h4 className="title w-600">
                                                        <Link href="#">{data.title}</Link>
                                                    </h4>
                                                    <p className="description b1 color-gray mb--0">{data.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator top={true} />

                        <div className="rts-tools-area rts-section-gap bg-tools">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="title-center-feature" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                            <h2 className="title">
                                                Benefits of Using Cre8teGPT's Article Generator Assistant
                                            </h2>
                                            <p className="disc">
                                                Cre8teGPT's Article Generator Assistant is designed to make your life easier. Here are just a few of the benefits you'll enjoy when you use our tool:
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt--25 g-5">
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12"  data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="single-tools-feature">
                                            <div className="icon">
                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="4" fill="#3F3EED" fill-opacity="0.1"></rect>
                                                    <path d="M23.1719 17.5469C28 17.8281 32.1719 22 32.4531 26.7812C32.5 27.3906 32.0312 27.9531 31.4219 28C31.375 28 31.375 28 31.3281 28C30.7656 28 30.25 27.5312 30.25 26.9219C29.9688 23.2188 26.7344 19.9844 23.0312 19.75C22.4219 19.75 21.9531 19.1875 22 18.5781C22 17.9688 22.5625 17.5 23.1719 17.5469ZM23.5 13C30.9062 13 37 19.0938 37 26.5C37 27.3438 36.2969 28 35.5 28C34.6562 28 34 27.3438 34 26.5C34 20.7344 29.2656 16 23.5 16C22.6562 16 22 15.3438 22 14.5C22 13.7031 22.6562 13 23.5 13ZM21.0625 23.6406C24.5781 24.3438 27.1562 27.8594 26.3125 31.7031C25.7969 34.2344 23.7344 36.2969 21.2031 36.8125C16.8438 37.75 13 34.4219 13 30.25V18.625C13 18.0156 13.4688 17.5469 14.0781 17.5469H16.3281C16.9844 17.5469 17.4531 18.0156 17.4531 18.625V30.2031C17.4531 31.375 18.4844 32.4062 19.75 32.4062C20.9688 32.4062 22 31.4219 22 30.2031C22 29.2656 21.3438 28.4219 20.5 28.1406C20.0781 28 19.75 27.625 19.75 27.1094V24.7656C19.75 24.0625 20.3594 23.5 21.0625 23.6406Z" fill="#3F3EED"></path>
                                                </svg>
                                            </div>
                                            <h5 className="title">
                                                Increased Website Traffic
                                            </h5>
                                            <p className="disc">
                                                Attract more visitors with high-ranking, SEO-optimized content.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="single-tools-feature">
                                            <div className="icon">

                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="4" fill="#33B89F" fill-opacity="0.1"></rect>
                                                    <path d="M29.5 25C29.5 26.6875 28.1406 28 26.5 28L19.0938 28.0469L15.2031 30.9531C14.9219 31.1406 14.5 30.9531 14.5 30.5781V28.0469L13 28C11.3125 28 10 26.6875 10 25V16C10 14.3594 11.3125 13 13 13H26.5C28.1406 13 29.5 14.3594 29.5 16V25ZM37 19C38.6406 19 40 20.3594 40 22V31.0469C40 32.6875 38.6406 34 37 34H35.5V36.5781C35.5 36.9531 35.0312 37.1406 34.7031 36.9062L30.8125 34H24.9531C23.3125 34 22 32.6875 22 31V29.5H26.5C28.9375 29.5 31 27.4844 31 25V19H37Z" fill="#33B89F"></path>
                                                </svg>

                                            </div>
                                            <h5 className="title">
                                                Enhanced Brand Authority
                                            </h5>
                                            <p className="disc">
                                                Establish yourself as a thought leader in your industry with expert-level content.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="single-tools-feature">
                                            <div className="icon">
                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="4" fill="#2A85C8" fill-opacity="0.1"></rect>
                                                    <path d="M13 14.125C13 13.5156 13.4688 13 14.125 13H17.5C18.0156 13 18.4844 13.4219 18.5781 13.9375L18.6719 14.5H38.3594C39.3438 14.5 40.0938 15.4844 39.8125 16.4219L37.2812 25.4219C37.0938 26.0781 36.5312 26.5 35.8281 26.5H20.9688L21.3906 28.75H35.875C36.4844 28.75 37 29.2656 37 29.875C37 30.5312 36.4844 31 35.875 31H20.4531C19.9375 31 19.4688 30.625 19.375 30.1094L16.5625 15.25H14.125C13.4688 15.25 13 14.7812 13 14.125ZM23.5 34.75C23.5 36.0156 22.4688 37 21.25 37C19.9844 37 19 36.0156 19 34.75C19 33.5312 19.9844 32.5 21.25 32.5C22.4688 32.5 23.5 33.5312 23.5 34.75ZM32.5 34.75C32.5 33.5312 33.4844 32.5 34.75 32.5C35.9688 32.5 37 33.5312 37 34.75C37 36.0156 35.9688 37 34.75 37C33.4844 37 32.5 36.0156 32.5 34.75ZM14.875 17.5C15.4844 17.5 16 18.0156 16 18.625C16 19.2812 15.4844 19.75 14.875 19.75H11.125C10.4688 19.75 10 19.2812 10 18.625C10 18.0156 10.4688 17.5 11.125 17.5H14.875ZM15.625 21.25C16.2344 21.25 16.75 21.7656 16.75 22.375C16.75 23.0312 16.2344 23.5 15.625 23.5H11.125C10.4688 23.5 10 23.0312 10 22.375C10 21.7656 10.4688 21.25 11.125 21.25H15.625ZM16.375 25C16.9844 25 17.5 25.5156 17.5 26.125C17.5 26.7812 16.9844 27.25 16.375 27.25H11.125C10.4688 27.25 10 26.7812 10 26.125C10 25.5156 10.4688 25 11.125 25H16.375Z" fill="#2A85C8"></path>
                                                </svg>
                                            </div>
                                            <h5 className="title">
                                                Save Time & Money
                                            </h5>
                                            <p className="disc">
                                                Free up your resources from the writing process and focus on growing your business.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="single-tools-feature">
                                            <div className="icon">

                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="4" fill="#EBA43B" fill-opacity="0.1"></rect>
                                                    <path d="M17.25 14.5H24.2344C25.0312 14.5 25.7812 14.8281 26.3438 15.3906L34.5938 23.6406C35.7656 24.8125 35.7656 26.7344 34.5938 27.9062L28.3594 34.1406C27.1875 35.3125 25.2656 35.3125 24.0938 34.1406L15.8438 25.8906C15.2812 25.3281 15 24.5781 15 23.7812V16.75C15 15.5312 15.9844 14.5 17.25 14.5ZM20.25 21.25C21.0469 21.25 21.75 20.5938 21.75 19.75C21.75 18.9531 21.0469 18.25 20.25 18.25C19.4062 18.25 18.75 18.9531 18.75 19.75C18.75 20.5938 19.4062 21.25 20.25 21.25Z" fill="#EBA43B"></path>
                                                </svg>

                                            </div>
                                            <h5 className="title">
                                                Improved Conversion Rates
                                            </h5>
                                            <p className="disc">
                                                Engage your audience with targeted articles that resonate with their needs.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="single-tools-feature" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                            <div className="icon">

                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="4" fill="#E331D2" fill-opacity="0.1"></rect>
                                                    <path d="M13 17.5C13 15.8594 14.3125 14.5 16 14.5H34C35.6406 14.5 37 15.8594 37 17.5V32.5C37 34.1875 35.6406 35.5 34 35.5H16C14.3125 35.5 13 34.1875 13 32.5V17.5ZM17.5 20.5C18.2969 20.5 19 19.8438 19 19C19 18.2031 18.2969 17.5 17.5 17.5C16.6562 17.5 16 18.2031 16 19C16 19.8438 16.6562 20.5 17.5 20.5ZM34 19C34 18.3906 33.4844 17.875 32.875 17.875H21.625C20.9688 17.875 20.5 18.3906 20.5 19C20.5 19.6562 20.9688 20.125 21.625 20.125H32.875C33.4844 20.125 34 19.6562 34 19Z" fill="#E331D2"></path>
                                                </svg>

                                            </div>
                                            <h5 className="title">
                                                Boost SEO Rankings
                                            </h5>
                                            <p className="disc">
                                                Drive organic traffic to your site with keyword-rich, search engine optimized content.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="single-tools-feature">
                                            <div className="icon">

                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="4" fill="#5584FF" fill-opacity="0.1"></rect>
                                                    <path d="M21.75 24.1562L22.7344 26.125H20.7188L21.75 24.1562ZM31.5 26.125C31.5 26.7812 30.9844 27.25 30.375 27.25C29.7188 27.25 29.25 26.7812 29.25 26.125C29.25 25.5156 29.7188 25 30.375 25C30.9844 25 31.5 25.5156 31.5 26.125ZM36 14.5C37.6406 14.5 39 15.8594 39 17.5V32.5C39 34.1875 37.6406 35.5 36 35.5H15C13.3125 35.5 12 34.1875 12 32.5V17.5C12 15.8594 13.3125 14.5 15 14.5H36ZM22.7344 21.1562C22.5469 20.7812 22.1719 20.5 21.75 20.5C21.2812 20.5 20.9062 20.7812 20.7188 21.1562L17.3438 27.9062C17.0625 28.4688 17.2969 29.125 17.8594 29.4062C18.4219 29.6875 19.0781 29.4531 19.3594 28.8906L19.5938 28.375H23.8594L24.0938 28.8906C24.375 29.4531 25.0312 29.6875 25.5938 29.4062C26.1562 29.125 26.3906 28.4688 26.1094 27.9062L22.7344 21.1562ZM31.5 22.9844C31.125 22.8438 30.75 22.75 30.375 22.75C28.5 22.75 27 24.2969 27 26.125C27 28 28.5 29.5 30.375 29.5C30.8906 29.5 31.3594 29.4062 31.8281 29.1719C32.0156 29.4062 32.2969 29.5 32.625 29.5C33.2344 29.5 33.75 29.0312 33.75 28.375V21.625C33.75 21.0156 33.2344 20.5 32.625 20.5C31.9688 20.5 31.5 21.0156 31.5 21.625V22.9844Z" fill="#5585FF"></path>
                                                </svg>

                                            </div>
                                            <h5 className="title">
                                                Generate Leads
                                            </h5>
                                            <p className="disc">
                                                Capture more leads with compelling, persuasive content that drives action.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={false} />

                        <div className="rts-easy-steps-area rts-section-gapTop rts-section-gapBottom bg-tools">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="title-conter-area">
                                            <h2 className="title">How to Use the Article Generator</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt--20">
                                    <div className="col-lg-12 plr--120 plr_md--60 plr_sm--15" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
                                        <div className="easy-steps-area-wrapper bg_image">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-12 col-sm-12">
                                                    <div className="easy-steps-main-wrapper">
                                                        <div className="single-steps-area">
                                                            <span className="number active">01</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#E6E5FF"></rect>
                                                                    <path d="M30.9688 9.92188C32 10.9531 32 12.5938 30.9688 13.625L29.5625 15.0312L24.9688 10.4375L26.375 9.03125C27.4062 8 29.0469 8 30.0781 9.03125L30.9688 9.92188ZM16.0625 19.3438L23.8906 11.5156L28.4844 16.1094L20.6562 23.9375C20.375 24.2188 20 24.4531 19.625 24.5938L15.4531 25.9531C15.0312 26.0938 14.6094 26 14.3281 25.6719C14 25.3906 13.9062 24.9219 14.0469 24.5469L15.4062 20.375C15.5469 20 15.7812 19.625 16.0625 19.3438ZM17 11C17.7969 11 18.5 11.7031 18.5 12.5C18.5 13.3438 17.7969 14 17 14H12.5C11.6562 14 11 14.7031 11 15.5V27.5C11 28.3438 11.6562 29 12.5 29H24.5C25.2969 29 26 28.3438 26 27.5V23C26 22.2031 26.6562 21.5 27.5 21.5C28.2969 21.5 29 22.2031 29 23V27.5C29 29.9844 26.9844 32 24.5 32H12.5C9.96875 32 8 29.9844 8 27.5V15.5C8 13.0156 9.96875 11 12.5 11H17Z" fill="#3F3EED"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title">Enter Your Input</h5>
                                                                <p className="disc">Start by providing your keywords, domain, or URL. Cre8teGPT uses this information as the foundation for generating your article. Simply type in your input and let our AI analyze the data to understand your content needs.</p>
                                                            </div>
                                                        </div>

                                                        <div className="single-steps-area">
                                                            <span className="number">02</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#BDE3FF" fill-opacity="0.4"></rect>
                                                                    <path d="M30.5 9.5C31.2969 9.5 32 10.2031 32 11V27.5C32 29.1875 30.6406 30.5 29 30.5H11C9.3125 30.5 8 29.1875 8 27.5V14C8 13.2031 8.65625 12.5 9.5 12.5H11V26.75C11 27.1719 11.3281 27.5 11.75 27.5C12.125 27.5 12.5 27.1719 12.5 26.75V11C12.5 10.2031 13.1562 9.5 14 9.5H30.5ZM20.75 27.5C21.125 27.5 21.5 27.1719 21.5 26.75C21.5 26.375 21.125 26 20.75 26H16.25C15.8281 26 15.5 26.375 15.5 26.75C15.5 27.1719 15.8281 27.5 16.25 27.5H20.75ZM20.75 23C21.125 23 21.5 22.6719 21.5 22.25C21.5 21.875 21.125 21.5 20.75 21.5H16.25C15.8281 21.5 15.5 21.875 15.5 22.25C15.5 22.6719 15.8281 23 16.25 23H20.75ZM28.25 27.5C28.625 27.5 29 27.1719 29 26.75C29 26.375 28.625 26 28.25 26H23.75C23.3281 26 23 26.375 23 26.75C23 27.1719 23.3281 27.5 23.75 27.5H28.25ZM28.25 23C28.625 23 29 22.6719 29 22.25C29 21.875 28.625 21.5 28.25 21.5H23.75C23.3281 21.5 23 21.875 23 22.25C23 22.6719 23.3281 23 23.75 23H28.25ZM29 17.75V13.25C29 12.875 28.625 12.5 28.25 12.5H16.25C15.8281 12.5 15.5 12.875 15.5 13.25V17.75C15.5 18.1719 15.8281 18.5 16.25 18.5H28.25C28.625 18.5 29 18.1719 29 17.75Z" fill="#083A5E"></path>
                                                                </svg>

                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title">Customize and Optimize</h5>
                                                                <p className="disc">Once the initial draft is generated, customize the content to fit your brand's voice and style. Use our built-in tools to adjust the tone, structure, and length. Optimize your article with the suggested keywords and real-time feedback to ensure it's SEO-friendly and engaging.</p>
                                                            </div>
                                                        </div>

                                                        <div className="single-steps-area">
                                                            <span className="number">03</span>
                                                            <div className="icon">
                                                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="40" height="40" rx="4" fill="#CBF3E7"></rect>
                                                                    <path d="M16 22.625C16 23.2812 16.4688 23.75 17.125 23.75H25V29.75C25 31.0156 23.9688 32 22.75 32H9.25C7.98438 32 7 31.0156 7 29.75V10.25C7 9.03125 7.98438 8 9.25 8H17.5V14C17.5 14.8438 18.1562 15.5 19 15.5H25V21.5H17.125C16.4688 21.5 16 22.0156 16 22.625ZM19 8L25 14H19V8ZM33.625 21.8281C34.0938 22.2969 34.0938 23 33.625 23.4219L29.875 27.1719C29.4531 27.6406 28.75 27.6406 28.3281 27.1719C28.0938 26.9844 28 26.7031 28 26.375C28 26.0938 28.0938 25.8125 28.3281 25.625L30.1562 23.75H25V21.5H30.1562L28.2812 19.6719C27.8125 19.25 27.8125 18.5469 28.2812 18.0781C28.7031 17.6562 29.4062 17.6562 29.875 18.0781L33.625 21.8281Z" fill="#33B89F"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="info-wrapper">
                                                                <h5 className="title">Review and Publish</h5>
                                                                <p className="disc">Review the final draft for any last-minute tweaks. Use our plagiarism checker to ensure originality. When you're satisfied, simply download or copy the article and publish it on your preferred platform. It's that easy!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-12 col-sm-12">
                                                    <div className="right-image-steps">
                                                        <img className="mt-50pc" src="/images/screenshots/article-generator/howtouse.png" alt="how to use Cre8teGPT Article Generator AI Tool" loading="lazy" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator top={true} />
                        <Brands />
                        <Separator top={false} />

                        <div className="rainbow-accordion-area rainbow-section-gap">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-10 offset-lg-1" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
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
                                        <AccordionItem />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator top={true} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArticleGenerator;
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Image from "next/image";
import Link from "next/link";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const LyricsGenerator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [lyrics, setLyrics] = useState("");

    useEffect(() => {
        document.body.classList.add("chatbot");
    }, []);

    const generate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = {
            theme: formData.get("theme"),
            genre: formData.get("genre"),
            mood: formData.get("mood"),
            structure: formData.get("structure"),
            keywords: formData.get("keywords"),
            perspective: formData.get("perspective"),
            pronouns: formData.get("pronouns"),
            audience: formData.get("audience"),
            style_inspiration: formData.get("style_inspiration"),
            special_requests: formData.get("special_requests")
        };

        if (!session) {
            router.push("/auth/signin?redirect=/dashboard/lyrics-generator");
            return;
        }

        if (!data.theme || data.theme.trim() === "") {
            toast.error("Please enter a theme for the lyrics.", {
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

        setIsGenerating(true);

        try {
            const response = await axios.post("/api/tools/generators/lyrics-generator", { data });

            if (response.data.lyrics) {
                setLyrics(response.data.lyrics);
            }
            setIsGenerating(false);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while generating lyrics.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsGenerating(false);
        }
    }

    const download = (lyrics) => {
        const element = document.createElement("a");
        const file = new Blob([lyrics], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "lyrics.txt";
        document.body.appendChild(element);
        element.click();
    }

    return (
        <>
            <ToastContainer />

            <div className="rbt-dashboard-content">
                <div className="content-page">
                    <div className="chat-box-list pt--30">
                        <div className="main-center-content-m-left center-content search-sticky">
                            <div className="lyrics-main-generator-start">
                                <form onSubmit={generate}>
                                    <div className="ask-for-lyrics">
                                        <textarea name="theme" placeholder="Enter the theme of the song..." required=""></textarea>
                                        <i className="fa-light fa-pen-to-square"></i>

                                        <div className="generatore-content row mt--20">
                                            <div className="single-diamention">
                                                <div className="nice-select-wrap">
                                                    <select name="genre" className="nice-select">
                                                        <option value="">Choose Genre</option>
                                                        <option value="Pop">Pop</option>
                                                        <option value="Rock">Rock</option>
                                                        <option value="Hip-Hop">Hip-Hop</option>
                                                        <option value="R&B">R&B</option>
                                                        <option value="Country">Country</option>
                                                        <option value="Jazz">Jazz</option>
                                                        <option value="Classical">Classical</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <select className="nice-select" name="mood">
                                                    <option value="">Choose Mood</option>
                                                    <option value="Happy">Happy</option>
                                                    <option value="Romantic">Romantic</option>
                                                    <option value="Neutral">Neutral</option>
                                                    <option value="Sad">Sad</option>
                                                    <option value="Angry">Angry</option>
                                                    <option value="Reflective">Reflective</option>
                                                </select>
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <select name="perspective" className="nice-select">
                                                    <option value="">Choose Perspective</option>
                                                    <option value="First Person">First Person</option>
                                                    <option value="Second Person">Second Person</option>
                                                    <option value="Third Person">Third Person</option>
                                                </select>
                                            </div>

                                            {/* <div className="single-diamention pt--30">
                                                <h6 className="title w-600 mb--20">Song Structure</h6>
                                                <input type="text" name="structure" placeholder="e.g., Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus" />
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <h6 className="title w-600 mb--20">Keywords</h6>
                                                <input type="text" name="keywords" placeholder="e.g., love, heartbreak, memories" />
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <h6 className="title w-600 mb--20">Pronouns</h6>
                                                <input type="text" name="pronouns" placeholder="e.g., I, me, you" />
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <h6 className="title w-600 mb--20">Audience</h6>
                                                <input type="text" name="audience" placeholder="e.g., teenagers, adults" />
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <h6 className="title w-600 mb--20">Style Inspiration</h6>
                                                <input type="text" name="style_inspiration" placeholder="e.g., Taylor Swift" />
                                            </div>

                                            <div className="single-diamention pt--30">
                                                <h6 className="title w-600 mb--20">Special Requests</h6>
                                                <input type="text" name="special_requests" placeholder="Any other details" />
                                            </div> */}

                                            {/* {[
                                                { name: "genre", label: "Choose Genre", options: ["Pop", "Rock", "Hip-Hop", "R&B", "Country", "Jazz", "Classical"] },
                                                { name: "mood", label: "Choose Mood", options: ["Happy", "Romantic", "Neutral", "Sad", "Angry", "Reflective"] },
                                                { name: "perspective", label: "Choose Perspective", options: ["First Person", "Second Person", "Third Person"] }
                                            ].map((field, index) => (
                                                <div className="single-diamention pt--30" key={index}>
                                                    <select className="nice-select" name={field.name}>
                                                        <option value="">{field.label}</option>
                                                        {field.options.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))} */}

                                            {[
                                                { name: "structure", label: "Song Structure", placeholder: "e.g., Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus" },
                                                { name: "keywords", label: "Keywords", placeholder: "e.g., love, heartbreak, memories" },
                                                { name: "pronouns", label: "Pronouns", placeholder: "e.g., I, me, you" },
                                                { name: "audience", label: "Audience", placeholder: "e.g., teenagers, adults" },
                                                { name: "style_inspiration", label: "Style Inspiration", placeholder: "e.g., Taylor Swift" },
                                                { name: "special_requests", label: "Special Requests", placeholder: "Any other details" }
                                            ].map((field, index) => (
                                                <div className="single-diamention pt--30" key={index}>
                                                    <h6 className="title w-600 mb--20">{field.label}</h6>
                                                    <input type="text" name={field.name} placeholder={field.placeholder} />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="button-wrapper-generator">
                                            <button type="submit" className="rts-btn btn-primary">
                                                Generate
                                                {isGenerating ? (
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src="/images/icons/06.svg"
                                                        alt="icons"
                                                        width={20}
                                                        height={20}
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {lyrics && (
                                <div className="lyrics-main-wrapper-top-bottom mb--60">
                                    <div className="lyrics-main-wrapper">
                                        <div className="generated-lyrics">
                                            <pre>{lyrics}</pre>
                                        </div>
                                    </div>
                                    <button type="button" className="rts-btn btn-primary mt--30" onClick={() => download(lyrics)}>
                                        Export <i className="fa-light fa-download"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="right-side-bar-new-chat-option">
                            <div className="image-generatore-right-sidebar-content">
                                <div className="lyrics-theme-ideas">
                                    <div className="row mb--20">
                                        <h4 className="title text-center">Song Theme Ideas</h4>
                                        <div className="border-bottom"></div>
                                    </div>
                                    
                                    <div className="row">
                                        <h5 className="title">Love songs</h5>
                                        <ul>
                                            <li>The joy of finding new love</li>
                                            <li>The pain of a recent break up</li>
                                            <li>The suffering of a relationship you can't get out of</li>
                                            <li>Jealousy over a former lover being with someone else</li>
                                            <li>Unrequited love for someone you can't have</li>
                                            <li>Interference from someone else into your relationship</li>
                                            <li>A description of your physical attraction to another</li>
                                            <li>Your dreams for the future of your relationship or future partner</li>
                                            <li>Your disgust at love and all that it represents</li>
                                            <li>Your hatred for other happy couples</li>
                                            <li>How you don't understand your partner</li>
                                            <li>Reminiscing over a former lover</li>
                                            <li>The love you have for your mother or father</li>
                                            <li>Your feelings towards someone who has lied to you</li>
                                            <li>Your plan to break up with someone</li>
                                            <li>The distance between you and a lover</li>
                                            <li>Telling someone you love them</li>
                                            <li>Your description of someone you admire</li>
                                            <li>The enjoyment you get talking to someone</li>
                                            <li>The monotony of your relationship</li>
                                            <li>Your apology to someone</li>
                                            <li>Your desperation for someone</li>
                                            <li>The virtues of the person you love</li>
                                            <li>How you'll always be there for someone</li>
                                        </ul>
                                    </div>

                                    <div className="row">
                                        <h5 className="title">Your life</h5>
                                        <ul>
                                            <li>Your love for a town, city or country</li>
                                            <li>Your love for a season or a country scene</li>
                                            <li>Your love for an animal/bird/natural object</li>
                                            <li>The wishes for your future</li>
                                            <li>The story of your life</li>
                                            <li>The lessons you have learnt</li>
                                            <li>Your admiration for a famous person</li>
                                            <li>A story about a person you once knew</li>
                                            <li>How a stranger has affected your life</li>
                                            <li>Your longing for freedom</li>
                                            <li>The story of your travels</li>
                                            <li>Your failures</li>
                                            <li>Your home</li>
                                            <li>A cry for help</li>
                                            <li>Your recovery from a setback</li>
                                            <li>Illusion and deception</li>
                                            <li>Your descent into despair</li>
                                            <li>Your hatred for someone</li>
                                            <li>Some advice you are able to give</li>
                                        </ul>
                                    </div>

                                    <div className="row">
                                        <h5 className="title">Topical/political songs</h5>
                                        <ul>
                                            <li>Your comments on the latest news</li>
                                            <li>Your protest about a current war or other negative event</li>
                                            <li>Your take on the nature of society</li>
                                            <li>How you don't understand why certain people have done certain things</li>
                                            <li>The different sides of an argument</li>
                                            <li>Your religious views or your love for god or other spirituality</li>
                                            <li>How history is repeating itself</li>
                                        </ul>
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

export default LyricsGenerator;

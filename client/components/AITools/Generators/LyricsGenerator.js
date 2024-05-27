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
            const response = await axios.post("/api/tools/lyrics-generator", { data });

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
                                                        <option value="Any">Any</option>
                                                        <option value="Pop">Pop</option>
                                                        <option value="Rock">Rock</option>
                                                        <option value="Hip-Hop">Hip-Hop</option>
                                                        <option value="R&B">R&B</option>
                                                        <option value="Country">Country</option>
                                                        <option value="Jazz">Jazz</option>
                                                        <option value="Classical">Classical</option>
                                                    </select>
                                                    <i className="fa-light fa-music"></i>
                                                    <div className="nice-select-search-box"></div>
                                                </div>
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <select className="nice-select" name="mood">
                                                    <option value="">Choose Mood</option>
                                                    <option value="Any">Any</option>
                                                    <option value="Happy">Happy</option>
                                                    <option value="Romantic">Romantic</option>
                                                    <option value="Neutral">Neutral</option>
                                                    <option value="Sad">Sad</option>
                                                    <option value="Angry">Angry</option>
                                                    <option value="Reflective">Reflective</option>
                                                </select>
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Song Structure</h6>
                                                <input type="text" name="structure" placeholder="e.g., Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus" />
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Keywords</h6>
                                                <input type="text" name="keywords" placeholder="e.g., love, heartbreak, memories" />
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Perspective</h6>
                                                <select name="perspective" className="nice-select">
                                                    <option value="First Person">First Person</option>
                                                    <option value="Second Person">Second Person</option>
                                                    <option value="Third Person">Third Person</option>
                                                </select>
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Pronouns</h6>
                                                <input type="text" name="pronouns" placeholder="e.g., I, me, you" />
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Audience</h6>
                                                <input type="text" name="audience" placeholder="e.g., teenagers, adults" />
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Style Inspiration</h6>
                                                <input type="text" name="style_inspiration" placeholder="e.g., Taylor Swift" />
                                            </div>

                                            <div className="image-diamention single-diamention pt--30">
                                                <h6 className="title">Special Requests</h6>
                                                <input type="text" name="special_requests" placeholder="Any other details" />
                                            </div>
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
                                        Download <i className="fa-light fa-download"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LyricsGenerator;

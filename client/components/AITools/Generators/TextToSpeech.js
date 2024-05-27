import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import "venobox/dist/venobox.min.css";
import sal from "sal.js";

import Image from "next/image";
import Link from "next/link";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const TextToSpeechGenerator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null)
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        document.body.classList.add("chatbot");
    }, []);

    //turn 128 seconds into 2:08
    const getTimeCodeFromNum = (num) => {
        let seconds = parseInt(num);
        let minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60);
        minutes -= hours * 60;

        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
            seconds % 60
        ).padStart(2, 0)}`;
    }

    const generate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = {
            input: formData.get("input"),
            language: formData.get("language"),
            model: formData.get("model"),
            speed: formData.get("speed"),
            voice: formData.get("voice"),
            format: formData.get("format"),
        };

        if (!session) {
            router.push("/auth/signin?redirect=/dashboard/text-to-speech");
            return;
        }

        if (!data.input || data.input.trim() === "") {
            toast.error("Please enter a text to generate audio.", {
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
            const response = await axios.post("/api/tools/text-to-speech", { data });
            // const response = {
            //     data: {
            //         audio: "/audio/speech.mp3",
            //     },
            // };

            console.log(response.data);

            if (response.data.audio) {
                const audio = new Audio(response.data.audio);
                setAudio(audio);

                // wait 3 seconds for the audio to load
                setTimeout(() => {
                    setIsGenerating(false);

                    const audioPlayer = document.querySelector(".audio-player");

                    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
                        audio.duration
                    );
                    audio.volume = .75;

                    //click on timeline to skip around
                    const timeline = audioPlayer.querySelector(".timeline");
                    timeline.addEventListener("click", e => {
                        const timelineWidth = window.getComputedStyle(timeline).width;
                        const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
                        audio.currentTime = timeToSeek;
                    }, false);

                    //click volume slider to change volume
                    const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
                    volumeSlider.addEventListener('click', e => {
                        const sliderWidth = window.getComputedStyle(volumeSlider).width;
                        const newVolume = e.offsetX / parseInt(sliderWidth);
                        audio.volume = newVolume;
                        audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
                    }, false);

                    //check audio percentage and update time accordingly
                    setInterval(() => {
                        const progressBar = audioPlayer.querySelector(".progress");
                        progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
                        audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
                            audio.currentTime
                        );
                    }, 500);

                    //toggle between playing and pausing on button click
                    const playBtn = audioPlayer.querySelector(".controls .toggle-play");
                    playBtn.addEventListener(
                        "click",
                        () => {
                            if (audio.paused) {
                                playBtn.classList.remove("play");
                                playBtn.classList.add("pause");
                                audio.play();
                            } else {
                                playBtn.classList.remove("pause");
                                playBtn.classList.add("play");
                                audio.pause();
                            }
                        },
                        false
                    );

                    audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
                        const volumeEl = audioPlayer.querySelector(".volume-container .volume");
                        audio.muted = !audio.muted;
                        if (audio.muted) {
                            volumeEl.classList.remove("icono-volumeMedium");
                            volumeEl.classList.add("icono-volumeMute");
                        } else {
                            volumeEl.classList.add("icono-volumeMedium");
                            volumeEl.classList.remove("icono-volumeMute");
                        }
                    });
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while generating audio.", {
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

    const download = (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "speech.mp3";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <>
            <ToastContainer />

            <div className="rbt-dashboard-content">
                <div className="content-page">
                    <div className="chat-box-list pt--30">
                        <div className="main-center-content-m-left center-content search-sticky">
                            <div className="audio-main-generator-start">
                                <form onSubmit={generate}>
                                    <div className="ask-for-audio">
                                        <textarea name="input" placeholder="Write your text here..." required=""></textarea>
                                        <i className="fa-light fa-pen-to-square"></i>

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

                                            <button className="mp3 rts-btn btn-border">
                                                MP3
                                                <i className="fa-sharp fa-light fa-chevron-down"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {audio && (
                                <div className="audio-main-wrapper-top-bottom mb--60">
                                    <div className="audio-main-wrapper">
                                        <div className="audio-player">
                                            <div className="timeline">
                                                <div className="progress"></div>
                                            </div>
                                            <div className="controls">
                                                <div className="play-container">
                                                    <div className="toggle-play play">
                                                    </div>
                                                </div>
                                                <div className="time">
                                                    <div className="current">0:00</div>
                                                    <div className="length"></div>
                                                </div>
                                                <div className="volume-container">
                                                    <div className="volume-button">
                                                        <div className="volume icono-volumeMedium"></div>
                                                    </div>

                                                    <div className="volume-slider">
                                                        <div className="volume-percentage"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" className="rts-btn btn-primary mt--30" onClick={() => download(audio.src)}>
                                        Download <i className="fa-light fa-download"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="right-side-bar-new-chat-option">
                            <div className="image-generatore-right-sidebar-content">
                                <div className="image-diamention single-diamention">
                                    <h6 className="title">Language</h6>
                                    <select name="language" className="nice-select">
                                        <option value="English">English</option>
                                        <option value="Afrikaans">Afrikaans</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="Armenian">Armenian</option>
                                        <option value="Azerbaijani">Azerbaijani</option>
                                        <option value="Belarusian">Belarusian</option>
                                        <option value="Bosnian">Bosnian</option>
                                        <option value="Bulgarian">Bulgarian</option>
                                        <option value="Catalan">Catalan</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="Croatian">Croatian</option>
                                        <option value="Czech">Czech</option>
                                        <option value="Danish">Danish</option>
                                        <option value="Dutch">Dutch</option>
                                        <option value="Estonian">Estonian</option>
                                        <option value="Finnish">Finnish</option>
                                        <option value="French">French</option>
                                        <option value="Galician">Galician</option>
                                        <option value="German">German</option>
                                        <option value="Greek">Greek</option>
                                        <option value="Hebrew">Hebrew</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Hungarian">Hungarian</option>
                                        <option value="Icelandic">Icelandic</option>
                                        <option value="Indonesian">Indonesian</option>
                                        <option value="Italian">Italian</option>
                                        <option value="Japanese">Japanese</option>
                                        <option value="Kannada">Kannada</option>
                                        <option value="Kazakh">Kazakh</option>
                                        <option value="Korean">Korean</option>
                                        <option value="Latvian">Latvian</option>
                                        <option value="Lithuanian">Lithuanian</option>
                                        <option value="Macedonian">Macedonian</option>
                                        <option value="Malay">Malay</option>
                                        <option value="Marathi">Marathi</option>
                                        <option value="Maori">Maori</option>
                                        <option value="Nepali">Nepali</option>
                                        <option value="Norwegian">Norwegian</option>
                                        <option value="Persian">Persian</option>
                                        <option value="Polish">Polish</option>
                                        <option value="Portuguese">Portuguese</option>
                                        <option value="Romanian">Romanian</option>
                                        <option value="Russian">Russian</option>
                                        <option value="Serbian">Serbian</option>
                                        <option value="Slovak">Slovak</option>
                                        <option value="Slovenian">Slovenian</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="Swahili">Swahili</option>
                                        <option value="Swedish">Swedish</option>
                                        <option value="Tagalog">Tagalog</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Thai">Thai</option>
                                        <option value="Turkish">Turkish</option>
                                        <option value="Ukrainian">Ukrainian</option>
                                        <option value="Urdu">Urdu</option>
                                        <option value="Vietnamese">Vietnamese</option>
                                        <option value="Welsh">Welsh</option>
                                    </select>
                                </div>

                                <div className="image-diamention single-diamention pt--30">
                                    <h6 className="title">Quality</h6>
                                    <select className="nice-select" name="model">
                                        <option value="tts-1">Standard</option>
                                        <option value="tts-1-hd" disabled title="Available in Pro Plan">High</option>
                                    </select>
                                    <p className="disc mt--20">
                                        Higher quality will result in more steps, but will take longer.
                                    </p>
                                </div>

                                <div className="image-diamention single-diamention pt--30">
                                    <h6 className="title">Play Speed</h6>
                                    <div className="range-main-wrapper">
                                        <div className="container1">
                                            <input name="speed" className="range" type="range" min="0.25" max="4.0" step="0.25" defaultValue="1.0" onMouseMove={(e) => document.getElementById("rangevalue1").innerHTML = e.target.value} />
                                            <output id="rangevalue1">1.0</output>
                                        </div>

                                        <p className="disc mt--20">
                                            Higher values will make your image closer to your prompt.
                                        </p>
                                    </div>
                                </div>

                                <div className="image-diamention single-diamention pt--30">
                                    <h6 className="title">Voice Options</h6>
                                    <select name="voice" className="nice-select">
                                        <option value="alloy">Alloy</option>
                                        <option value="echo">Echo</option>
                                        <option value="fable">Fable</option>
                                        <option value="onyx">Onyx</option>
                                        <option value="nova">Nova</option>
                                        <option value="shimmer">Shimmer</option>
                                    </select>
                                    <p className="disc mt--20">
                                        Please note that the TTS voice is AI-generated and not a human voice.
                                    </p>
                                </div>

                                <div className="image-diamention single-diamention pt--30">
                                    <h6 className="title">Format</h6>
                                    <div className="number-image-wrapper">
                                        <span className="single-number">
                                            Opus
                                        </span>
                                        <span className="single-number">
                                            AAC
                                        </span>
                                        <span className="single-number">
                                            FLAC
                                        </span>
                                        <span className="single-number">
                                            WAV
                                        </span>
                                        <span className="single-number">
                                            PCM
                                        </span>
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

export default TextToSpeechGenerator;

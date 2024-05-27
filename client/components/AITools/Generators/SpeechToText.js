import React, { useEffect, useState, useRef } from "react";
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

const SpeechToTextGenerator = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState(null)
    const [audio, setAudio] = useState(null);
    const [transcription, setTranscription] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

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
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    }

    const transcribe = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('audio', audio.blob);
        formData.append('language', event.target.language.value);

        if (!session) {
            router.push('/auth/signin?redirect=/dashboard/speech-to-text');
            return;
        }

        if (!audio) {
            toast.error('Please record or upload an audio file to transcribe.', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            return;
        }

        setIsTranscribing(true);

        try {
            const response = await axios.post('/api/tools/speech-to-text', formData, {
                headers: {
                    'x-user-id': 'user_' + session.user.id,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTranscription(response.data.transcription);
            setIsTranscribing(false);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while transcribing audio.', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
            setIsTranscribing(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudio({ blob: audioBlob, url: audioUrl });
                audioChunksRef.current = [];
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing media devices.', error);
            toast.error('Error accessing media devices.', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const uploadAudio = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(file);
            const audioUrl = URL.createObjectURL(file);
            setAudio({ blob: file, url: audioUrl });
        }
    }

    const download = (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "voice.mp3";
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
                        <form onSubmit={transcribe}>
                            <div className="main-center-content-m-left center-content search-sticky">
                                <div className="audio-main-generator-start">
                                    <div className="ask-for-audio">
                                        <div className="audio-input row text-md-left text-center">
                                            {isRecording ? (
                                                <button type="button" className="rts-btn btn-secondary col-md-4 col-12" onClick={stopRecording}>
                                                    Stop Recording
                                                    <i className="fa-solid fa-microphone-slash"></i>
                                                </button>
                                            ) : (
                                                <button type="button" className="rts-btn btn-danger col-md-4 col-12" onClick={startRecording}>
                                                    Start Recording
                                                    <i className="fa-solid fa-microphone spin"></i>
                                                </button>
                                            )}

                                            <button type="button" className="rts-btn btn-primary ml--5 col-md-4 col-12" onClick={() => document.querySelector('.audio-upload').click()}>
                                                Upload Audio
                                                <i className="fa-solid fa-upload"></i>
                                            </button>
                                            <input type="file" accept="audio/mp3" onChange={(e) => uploadAudio(e)} className="audio-upload d-none" />
                                        </div>

                                        {audio && (
                                            <div className="audio-main-wrapper-top-bottom mb--5">
                                                <div className="audio-main-wrapper row">
                                                    <audio controls src={audio.url} className="col-md-6 col-12"></audio>
                                                    <button type="button" className="rts-btn btn-primary mt--0 col-md-3 col-6" onClick={() => download(audio.url)}>
                                                        Download <i className="fa-light fa-download"></i>
                                                    </button>
                                                    <button type="button" className="rts-btn btn-danger mt--0 ml--5 col-md-3 col-6" onClick={() => setAudio(null)}>
                                                        Delete <i className="fa-light fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="button-wrapper-generator">
                                            <button type="submit" className="rts-btn btn-default">
                                                Transcribe
                                                {isTranscribing ? (
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
                                </div>

                                <div className="transcription-output mt--20 mb--60">
                                    <div className="transcription-text">
                                        
                                        <textarea name="input" placeholder="Your transcription will appear here..." readOnly rows={10} defaultValue={transcription}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="right-side-bar-new-chat-option">
                                <div className="audio-settings-right-sidebar-content">
                                    <div className="audio-language-selection single-selection">
                                        <h6 className="title">Language</h6>
                                        <select name="language" className="nice-select">
                                            <option value="en">English</option>
                                            <option value="af">Afrikaans</option>
                                            <option value="ar">Arabic</option>
                                            <option value="hy">Armenian</option>
                                            <option value="az">Azerbaijani</option>
                                            <option value="be">Belarusian</option>
                                            <option value="bs">Bosnian</option>
                                            <option value="bg">Bulgarian</option>
                                            <option value="ca">Catalan</option>
                                            <option value="zh">Chinese</option>
                                            <option value="hr">Croatian</option>
                                            <option value="cs">Czech</option>
                                            <option value="da">Danish</option>
                                            <option value="nl">Dutch</option>
                                            <option value="et">Estonian</option>
                                            <option value="fi">Finnish</option>
                                            <option value="fr">French</option>
                                            <option value="gl">Galician</option>
                                            <option value="de">German</option>
                                            <option value="el">Greek</option>
                                            <option value="he">Hebrew</option>
                                            <option value="hi">Hindi</option>
                                            <option value="hu">Hungarian</option>
                                            <option value="is">Icelandic</option>
                                            <option value="id">Indonesian</option>
                                            <option value="it">Italian</option>
                                            <option value="ja">Japanese</option>
                                            <option value="kn">Kannada</option>
                                            <option value="kk">Kazakh</option>
                                            <option value="ko">Korean</option>
                                            <option value="lv">Latvian</option>
                                            <option value="lt">Lithuanian</option>
                                            <option value="mk">Macedonian</option>
                                            <option value="ms">Malay</option>
                                            <option value="mr">Marathi</option>
                                            <option value="mi">Maori</option>
                                            <option value="ne">Nepali</option>
                                            <option value="no">Norwegian</option>
                                            <option value="fa">Persian</option>
                                            <option value="pl">Polish</option>
                                            <option value="pt">Portuguese</option>
                                            <option value="ro">Romanian</option>
                                            <option value="ru">Russian</option>
                                            <option value="sr">Serbian</option>
                                            <option value="sk">Slovak</option>
                                            <option value="sl">Slovenian</option>
                                            <option value="es">Spanish</option>
                                            <option value="sw">Swahili</option>
                                            <option value="sv">Swedish</option>
                                            <option value="tl">Tagalog</option>
                                            <option value="ta">Tamil</option>
                                            <option value="th">Thai</option>
                                            <option value="tr">Turkish</option>
                                            <option value="uk">Ukrainian</option>
                                            <option value="ur">Urdu</option>
                                            <option value="vi">Vietnamese</option>
                                            <option value="cy">Welsh</option>
                                        </select>
                                    </div>

                                    <div className="audio-quality-selection single-selection pt--30">
                                        <h6 className="title">Quality</h6>
                                        <select className="nice-select" name="quality">
                                            <option value="standard">Standard</option>
                                            <option value="high" disabled title="Available in Pro Plan">High</option>
                                        </select>
                                        <p className="disc mt--20">
                                            Higher quality will result in more accurate transcription but may take longer.
                                        </p>
                                    </div>

                                    <div className="audio-speed-selection single-selection pt--30">
                                        <h6 className="title">Playback Speed</h6>
                                        <div className="range-main-wrapper">
                                            <div className="container1">
                                                <input name="speed" className="range" type="range" min="0.25" max="4.0" step="0.25" defaultValue="1.0" onMouseMove={(e) => document.getElementById("rangevalue1").innerHTML = e.target.value} />
                                                <output id="rangevalue1">1.0</output>
                                            </div>
                                            <p className="disc mt--20">
                                                Adjust the playback speed of the transcribed audio.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="audio-format-selection single-selection pt--30">
                                        <h6 className="title">Format</h6>
                                        <div className="number-audio-wrapper">
                                            <span className="single-number">Opus</span>
                                            <span className="single-number">AAC</span>
                                            <span className="single-number">FLAC</span>
                                            <span className="single-number">WAV</span>
                                            <span className="single-number">PCM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SpeechToTextGenerator;

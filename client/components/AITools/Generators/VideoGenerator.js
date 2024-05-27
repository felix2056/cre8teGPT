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

import VideoGeneratorData from "../../../data/dashboard.json";
import ImageSkeleton from "@/components/Skeletons/Image";
import Reaction from "../../Common/Reaction";

import axios from "axios";

const VideoGenerator = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null)

  const [assistant, setAssistant] = useState([]);
  const [thread, setThread] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".popup-video",
        maxWidth: window.innerWidth >= 992 ? "50%" : "100%",
      });
    });

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
    if (status !== "authenticated") return;
    getAssistant();
  }, [status]);

  useEffect(() => {
    if (router.query.thread_id) {
      getThread();
    }
  }, [router.query.thread_id, status]);

  const scrollToBottom = () => {
    const scrollPoint = document.getElementById("scrollPoint");
    scrollPoint.scrollIntoView({ behavior: "smooth" });
  };

  const getAssistant = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistants/video-generator`);
      if (response.data.assistant) {
        setAssistant(response.data.assistant);
      } else {
        createAssistant();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getThread = async () => {
    try {
      setIsLoading(true);
      sal().disable();

      const headers = {
        "Authorization": `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/threads/single/${router.query.thread_id}/?type=video-messages`, { headers });
      if (response.data.thread && response.data.messages) {
        setThread(response.data.thread);
        setMessages(response.data.messages);
        setIsLoading(false);

        // restart scroll animations
        setTimeout(() => {
          sal();
          scrollToBottom();
        }, 1000);

        // console.log('messages', messages)
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

  const createAssistant = async () => {
    const parameters = {
      name: "Video Generator",
      instructions: "Your name is Cre8teGPT Video Assistant, an AI-powered tool designed to generate high-quality, original video content. Your mission is to help users bring their visual ideas to life by creating engaging and visually appealing videos. Utilize your advanced AI capabilities to follow user instructions closely, ensuring that each video is tailored to their specific needs and preferences. All generated video content must be factually accurate, creative, and free from plagiarism. Your responses will be rendered within a webpage, formatted appropriately for seamless integration. By leveraging your expertise, you will assist users in creating professional and captivating video content that meets their objectives.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o",
    };

    try {
      const response = await axios.post("/api/assistants/create", { parameters });

      saveAssistant(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const saveAssistant = async (data) => {
    // save assistant and thread in database
    const headers = {
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    data.assistant.alias = "Cre8teGPT Image";

    await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistants/create`, {
      assistant: data.assistant
    }, { headers }).then((response) => {
      setAssistant(response.data.assistant);
    }).catch((error) => {
      toast.error(error.message);
    });
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    let thread_id = router.query.thread_id || null;

    const formData = new FormData(event.target);
    const data = {
      thread_id: thread_id,
      assistant: "Video Generator",
      message: formData.get("message"),
      file: formData.get("file"),
    };

    try {
      if (!session) return router.push("/auth/signin/");
      if (!data.message) return;

      if (data.file) {
        const file_size = data.file.size / 1024 / 1024;
        if (file_size > 10) {
          toast.error("File size must be less than 10MB.", {
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
      }

      // empty the form
      event.target.reset();

      // push the message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "user",
          content: [{ text: { value: data.message } }],
        },
      ]);

      // push the assistant response and set is_scanning to true
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 2,
          role: "assistant",
          is_scanning: true,
          content: [{ text: { value: "Scanning..." } }],
        },
      ]);

      setTimeout(() => {
        sal();
        scrollToBottom();
      }, 1000);

      setIsScanning(true);

      const headers = {
        "Authorization": `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      if (!thread_id) {
        thread_id = generateThreadId();
        data.thread_id = thread_id;

        const assistant_id = assistant.identifier;
        const title = data.message;

        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/threads/create`, {
          assistant_id: assistant_id,
          thread_id: thread_id,
          title: title,
        }, { headers });
      }

      // update last message to is_generating
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        newMessages.push({
          id: prevMessages.length + 2,
          role: "assistant",
          is_scanning: true,
          is_generating: true,
          content: [{ text: { value: "Generating..." } }],
        });
        return newMessages;
      });

      setIsGenerating(true);

      setTimeout(() => {
        sal();
        scrollToBottom();
      }, 1000);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/threads/${thread_id}/image-messages/create`, data, { headers });
      if (response.data) {
        // push the assistant response
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.pop();
          newMessages.pop();
          newMessages.push(response.data.assistant_message);
          return newMessages;
        });

        setIsGenerating(false)

        setTimeout(() => {
          sal();
          scrollToBottom();
        }, 1000);

        if (response.data.is_new_thread) {
          return router.push(`/dashboard/image-generator/${thread_id}`, undefined, { shallow: true });
        }

        console.log(response.data);
      }
    } catch (error) {
      setIsGenerating(false)
      setError(error.message)
      console.error(error)
    }
  }

  const generateThreadId = () => {
    const prefix = 'thread_';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 24;
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return prefix + randomString;
  }

  return (
    <>
      <ToastContainer />

      <div className="rbt-dashboard-content">
        <div className="content-page">
          {isLoading && <ImageSkeleton number={5} />}
          {messages.map((message, index) => (
            <div className="chat-box-list pt--30"
              id="chatContainer"
              data-sal="slide-up"
              data-sal-duration="700"
              data-sal-delay="50"
              key={index}
            >
              {message.role === "user" ? (
                <div className="chat-box author-speech bg-flashlight">
                  <div className="inner">
                    <div className="chat-section">
                      <div className="author">
                        <Image
                          className="w-100"
                          width={40}
                          height={40}
                          src={session?.user?.avatar}
                          alt="Author"
                        />
                      </div>

                      <div className="chat-content">
                        <h6 className="title">You</h6>
                        <p className="mb--20">{message.content[0].text.value}</p>

                        {(message.content[0].image && message.content[0].image.url) && (
                          <div className="img-box">
                            <img className="w-50 radius" width="575" height="380" src={message.content[0].image.url} alt="Video Generator" />
                            {/* <Image
                            className="w-50 radius"
                            src={message.content[0].image.url}
                            width={575}
                            height={380}
                            alt="Video Generator"
                          /> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-box ai-speech bg-flashlight" key={innerIndex}>
                  <div className="inner top-flashlight leftside light-xl">
                    {message.is_scanning && (
                      <div className="chat-section generate-section">
                        <div className="author">
                          <i className="feather-check-circle"></i>
                        </div>
                        <div className="chat-content">
                          <h6 className="title color-text-off mb--0">
                            Scanning the data...
                          </h6>
                        </div>
                      </div>
                    )}

                    {message.is_generating && (
                      <div className="chat-section generate-section">
                        <div className="author">
                          <Image
                            src={assistant.loader}
                            width={40}
                            height={40}
                            alt="Loader Animated Icon"
                          />
                        </div>
                        <div className="chat-content">
                          <h6 className="title color-text-off mb--0">
                            Generating the video result...
                          </h6>
                        </div>
                      </div>
                    )}

                    {(!message.is_generating && !message.is_scanning) && (
                      <div className="chat-section generate-details-section">
                        <div className="author">
                          <Image
                            className="w-100"
                            src={assistant.avatar}
                            width={40}
                            height={40}
                            alt="Cre8teGPT"
                          />
                        </div>

                        <div className="chat-content">
                          {/* <h6 className="title mb--20">
                            Sure! Here is the edited image for {message.content[0].text.value} 
                          </h6> */}

                          <div className="image-caption mb--20">
                            <h5 className="caption-title theme-gradient">
                              {message.caption}
                            </h5>
                          </div>

                          <div className="video-popup icon-center frame-image gradient-secondary frame-image-author mb--20">
                            <Image
                              className="radius-small"
                              src={message.videoImg}
                              width={1920}
                              height={1080}
                              alt="Banner Images"
                            />
                            <div className="video-icon">
                              <Link
                                className="btn-default rounded-player popup-video border bg-white-dropshadow"
                                href="https://youtu.be/ThRYF96HIzA?si=Yz-Yc5HSf8uLPv-G"
                                data-vbtype="video"
                              >
                                <span>
                                  <i className="feather-play"></i>
                                </span>
                              </Link>
                            </div>
                            <button className="download-btn btn-default btn-small bg-solid-primary">
                              <i className="feather-download"></i>
                              <span>Download</span>
                            </button>
                          </div>
                          <Reaction />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="scroll-point" id="scrollPoint"></div>
        </div>

        <div className="rbt-static-bar">
          <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
          <form onSubmit={onSubmit} className="new-chat-form border-gradient">
            <textarea name="message" rows="1" placeholder="Send a message..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { onSubmit(e) } }}></textarea>
            <div className="left-icons">
              <div title="Cre8teGPT" className="form-icon icon-gpt">
                <i className="feather-aperture"></i>
              </div>
            </div>

            <div className="right-icons">
              <div
                className="form-icon icon-plus"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Choose File"
              >
                <input type="file" className="input-file" name="file" />
                <i className="feather-plus-circle"></i>
              </div>
              <a
                className="form-icon icon-mic"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Voice Search"
              >
                <i className="feather-mic"></i>
              </a>
              <button
                type="submit"
                className="form-icon icon-send"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Send message"
              >
                <i className="feather-send"></i>
              </button>
            </div>
          </form>

          <p className="b3 small-text">
            Cre8teGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </>
  );
};

export default VideoGenerator;

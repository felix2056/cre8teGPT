import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import sal from "sal.js";
import Image from "next/image";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import TextGeneratorData from "../../../data/dashboard.json";
import ImageSkeleton from "@/components/Skeletons/Image";
import Reaction from "../../Common/Reaction";

import axios from "axios";

const ImageGenerator = () => {
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistants/image-generator`);
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

      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/threads/single/${router.query.thread_id}/?type=image-messages`, { headers });
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
      name: "Image Generator",
      instructions: "Your persona is Cre8teGPT Image, an innovative AI assistant with a knack for generating captivating visual content. Your primary objective is to assist users in creating stunning and original images tailored to their unique specifications. Drawing upon your creative prowess and extensive knowledge, you\'ll craft visually appealing graphics that align with users\' visions. Accuracy and attention to detail are crucial in your role, ensuring that the generated images meet users\' expectations. Your responses will be presented within a web browser, formatted as image outputs rendered within a designated section. Adhere closely to user instructions, striving to produce high-quality images that captivate and inspire. With your expertise as Cre8teGPT ImageGen, users can unlock endless possibilities for visually engaging content creation, empowering them to bring their ideas to life with ease and flair.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-3.5-turbo",
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
      assistant: "Image Generator",
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

  const downloadImage = () => {
    const img = document.querySelector(".img-box img");
    const url = img.src;
    const filename = url.substring(url.lastIndexOf("/") + 1);
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  }

  return (
    <>
      <div className="rbt-dashboard-content">
        <div className="content-page">
          {isLoading && <ImageSkeleton number={5} />}
          {messages.map((message, index) => (
            <div className="chat-box-list pt--30"
              id="chatContainer"
              data-sal="slide-up"
              data-sal-duration="700"
              data-sal-delay="50"
              key={message.id}
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
                        <p>{message.content[0].text.value || message.content.text.value}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-box ai-speech bg-flashlight">
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
                            alt="Loader Images"
                          />
                        </div>
                        <div className="chat-content">
                          <h6 className="title color-text-off mb--0">
                            Generating the image result...
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
                          <h6 className="title mb--20"><strong>Revised Prompt:</strong> {message.content[0].revised_prompt || assistant.alias || "Cre8teGPT"}</h6>

                          <div className="image-caption mb--20">
                            <h5 className="caption-title theme-gradient">
                              {message.caption}
                            </h5>
                          </div>

                          <div className="img-box-grp mb--20">
                            {message.images && message.images.map((image, index) => (
                              <div className="img-box">
                                <img className="w-100 radius" width="1380" height="1380" src={image} alt={message.content[0].revised_prompt || message.caption} />
                                {/* <Image
                                  className="w-100 radius"
                                  src={image || message.content.url}
                                  width={1380}
                                  height={1380}
                                  alt={message.content.revised_prompt || message.caption}
                                /> */}
                                <button type="button" className="download-btn btn-default btn-small bg-solid-primary" onClick={downloadImage}>
                                  <i className="feather-download"></i>
                                  <span>Download</span>
                                </button>
                              </div>
                            ))}

                            {/* {innerData.generateImg2 ? (
                          <div className="img-box">
                            <Image
                              className="w-100 radius"
                              src={innerData.generateImg2}
                              width={1380}
                              height={1380}
                              alt="Image Generation"
                            />
                            <button className="download-btn btn-default btn-small bg-solid-primary">
                              <i className="feather-download"></i>
                              <span>Download</span>
                            </button>
                          </div>
                        ) : (
                          ""
                        )} */}
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
                <input type="file" className="input-file" name="file" multiple />
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

export default ImageGenerator;

import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import sal from "sal.js";
import Image from "next/image";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import TextGeneratorData from "../../../data/dashboard.json";
import Reaction from "../../Common/Reaction";
import TextSkeleton from "@/components/Skeletons/Text";

import axios from "axios";

const TextGenerator = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null)

  const [assistant, setAssistant] = useState([]);
  const [thread, setThread] = useState([]);
  const [messages, setMessages] = useState([]);

  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  
  useEffect(() => {
    const cards = document.querySelectorAll(".bg-flashlight");

    cards.forEach((bgflashlight) => {
      bgflashlight.onmousemove = function (e) {
        let x = e.pageX - bgflashlight.offsetLeft;
        let y = e.pageY - bgflashlight.offsetTop;

        bgflashlight.style.setProperty("--x", x + "px");
        bgflashlight.style.setProperty("--y", y + "px");
      };
    });

    sal();
  }, []);

  useEffect(() => {
    const query = router.query.q;
    if (query && prompt.trim() === "") setPrompt(query.replace(/\+/g, " "));
  }, [router.query.q]);

  useEffect(() => {
    if (status !== "authenticated") return;
    getAssistant();
  }, [status]);

  useEffect(() => {
    if (router.query.thread_id) {
      getThread();
    }
  }, [router.query.thread_id]);

  const scrollToBottom = () => {
    const scrollPoint = document.getElementById("scrollPoint");
    scrollPoint.scrollIntoView({ behavior: "smooth" });
  };
    
  const getAssistant = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistants/text-generator`);
      if (response.data.assistant) {
        setAssistant(response.data.assistant);
      } else {
        createAssistant();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getThread = async () => {
    try {
      setIsLoading(true);
      sal().disable();
      
      const response = await axios.get(`/api/threads/single/${router.query.thread_id}`);
      if (response.data.thread && response.data.messages) {
        setThread(response.data.thread);
        setMessages(response.data.messages.data);

        // restart scroll animations
        setTimeout(() => {
          sal();
          setIsLoading(false);
          scrollToBottom();
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const createAssistant = async () => {
    const parameters = {
      name: "Text Generator",
      instructions: "Your identity is Cre8teGPT Chat, an AI assistant dedicated to crafting top-notch, unique text content. Your goal is to provide valuable assistance to users seeking support with their writing endeavors. Utilize your vast knowledge and imaginative skills to fulfill user requests effectively. Accuracy and originality are paramount, so ensure that all content you generate is both factually precise and free from plagiarism. Your responses will be displayed on a webpage and formatted using HTML. Stay attentive to user instructions, tailoring your responses accordingly to meet their specific needs. Through your expertise and dedication, users will receive the exceptional text content they seek to achieve their goals.", 
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o",
    };

    try {
      const response = await axios.post("/api/assistants/create", { parameters });
      
      saveAssistant(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveAssistant = async (data) => {
    // save assistant and thread in database
    const headers = {
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    data.assistant.alias = "Cre8teGPT Chat";

    await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistants/create`, {
      assistant: data.assistant
    }, { headers }).then((response) => {
        setAssistant(response.data.assistant);
    }).catch((error) => {
        toast.error(error.message);
    });
  };

  const recordVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.continuous = false;

    recognition.start();
    setIsRecording(true);

    const audio = new Audio("/audio/blip.mp3");
    audio.play();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setPrompt(speechToText);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);

      const audio = new Audio("/audio/stop.mp3");
      audio.play();
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      console.error("Speech recognition error detected: " + event.error);

      const audio = new Audio("/audio/stop.mp3");
      audio.play();
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      thread_id: router.query.thread_id || null,
      assistant: "Text Generator",
      message: prompt,
      file: file,
    };

    try {
      if (!data.message) {
        toast.error("Please enter a message.", {
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

      if (!session) {
        toast.error("Please sign in to send a message.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          router.push("/auth/signin/");
        }, 2000);
      }

      // empty the form
      setPrompt("");
      setFile(null);

      // push the message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "user",
          content: [{ text: { value: data.message } }],
        },
      ]);

      // push the assistant response and set is_generating to true
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 2,
          role: "assistant",
          is_generating: true,
          content: [{ text: { value: "Thinking..." } }],
        },
      ]);

      setTimeout(() => {
        sal();
        scrollToBottom();
      }, 1000);

      setIsGenerating(true);
      setError(null);

      const response = await axios.post("/api/threads/messages/create", { data });
      if (response.data) {
        // push the assistant response
        setMessages((prevMessages) => {
          newMessages.pop();
          const newMessages = [...prevMessages];
          newMessages.pop();
          newMessages.push(response.data.messages.data[0]);
          return newMessages;
        });
        setIsGenerating(false)


        setTimeout(() => {
          scrollToBottom();
          sal();
        }, 1000);

        // save thread to db if needed
        if (response.data.save_thread) {
          const headers = {
            "Authorization": `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          };

          await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/threads/create`, { assistant_id: response.data.assistant.id, thread_id: response.data.thread.id, title: data.message }, { headers });

          // redirect to thread
          router.push(`/dashboard/chat/${response.data.thread.id}`, null, { shallow: true });
        }
      }
    } catch (error) {
      setIsGenerating(false)
      setError(error.message)
      console.error(error)
    }
  };

  const convertMessageToHTML = (message) => {
    const lines = message.split("\n\n"); // Split text by double newlines
    let html = "";

    for (const line of lines) {
      // handle starting and ending tags
      if (line.startsWith("### ")) {
        html += `<li class="mb-4">${line.slice(4)}</li>`;
      } else if (line.startsWith("- ") || line.match(/^\d+\. /)) {
        html += `<li class="mb-4">${line.slice(2)}</li>`;
      } else if (line.startsWith("**") && line.endsWith("**")) {
        html += `<strong>${line.slice(2, -2)}</strong>`;
      } else if (line.startsWith("*") && line.endsWith("*")) {
        html += `<em>${line.slice(1, -1)}</em>`;
      } else if (line.startsWith("```")) {
        html += `<pre>${line.slice(3)}</pre>`;
      } else if (line.startsWith("![") && line.endsWith(")")) {
        html += `<img src="${line.slice(2, -1)}" alt="Image" />`;
      } else {
        html += `<p class="mb-4">${line}</p>`;
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
  };

  return (
    <>
      <ToastContainer />

      <div className="rbt-dashboard-content">
        <div className="content-page">
          {isLoading && <TextSkeleton number={5} />}
          {messages.map((message) => (
            <div
              className="chat-box-list pt--30"
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
                      <p>{message.content[0].text.value}</p>
                    </div>
                  </div>
                </div>
              </div>
              ) : (
              <div className="chat-box ai-speech bg-flashlight">
                <div className="inner top-flashlight leftside light-xl" key={message.id}>
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
                        Thinking...
                      </h6>
                    </div>
                  </div>
                  )}
                  
                  {!message.is_generating && (
                  <div className="chat-section">
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
                      <h6 className="title">
                        {assistant.alias || "Cre8teGPT"}
                        
                        <span className="rainbow-badge-card">
                          {assistant.badge}
                        </span>
                      </h6>

                      {/* <p className="mb--20">{message.content[0].text.value}</p> */}
                      <p className="mb--20" dangerouslySetInnerHTML={{ __html: convertMessageToHTML(message.content[0].text.value) }}></p>

                      {/* {innerData.desc2 ? (
                        <p className="">{innerData.desc2}</p>
                      ) : (
                        ""
                      )}
                      <p className="mb--20">{innerData.desc}</p> */}
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
            <textarea 
              name="message" 
              rows="1" 
              placeholder="Send a message..."
              defaultValue={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit(e);
                } 
              }}
            ></textarea>

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
                <input type="file" className="input-file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                <i className="feather-plus-circle"></i>
              </div>
              
              {isRecording ? (
              <div
                className="form-icon icon-mic"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Recording..."
              >
                <i className="feather-mic"></i>
              </div>
              ) : (
              <a
                href="javascript:void(0)"
                className="form-icon icon-mic"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Voice Search"
                onClick={() => recordVoice()}
              >
                <i className="feather-mic"></i>
              </a>
              )}

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

export default TextGenerator;

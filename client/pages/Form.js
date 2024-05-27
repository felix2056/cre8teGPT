import React from "react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (event) => {
    event.preventDefault();
    const thread_id = router.query.thread_id || null;
    
    const formData = new FormData(event.target);
    const data = {
      thread_id: thread_id,
      assistant: "Text Generator",
      message: formData.get("message"),
      file: formData.get("file"),
    };

    try {
      if (!data.message) {
        toast.error("Please enter a message.");
        return;
      }

      if (data.file) {
        const file_size = data.file.size / 1024 / 1024;
        if (file_size > 10) {
          toast.error("File size must be less than 10MB.");
          return;
        }
      }

      if (!session) {
        toast.error("Please sign in to send a message.");
        setTimeout(() => {
          router.push("/auth/signin/");
        }, 2000);
      }

      setIsLoading(true);
      setError(null);

      // empty the form
      event.target.reset();

      const response = await axios.post("/api/threads/messages/create", { data });
      if (response.data) {
        setIsLoading(false)
        console.log(response.data);

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
      setIsLoading(false)
      setError(error.message)
      console.error(error)
    }
  }

  return (
    <>
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
    </>
  );
};

export default Form;

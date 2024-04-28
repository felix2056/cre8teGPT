import React from "react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

import OpenAI from "openai";

// PostgreSQL

/******
BEGIN;

CREATE TABLE text_threads ( title varchar(255), content text, user_id int, created_at timestamp, updated_at timestamp );

ALTER TABLE image_threads ADD FOREIGN KEY (user_id) REFERENCES users(id);

COMMIT;
******/

const Form = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault();
    setIsGenerating(true)
    setError(null)

    const form = e.target;

    try {
      const formData = new FormData(form);
      
      let file = formData.get("file");
      let message = formData.get("message");

      if (!message.trim()) {
        alert("Please enter a message");
        return;
      }

      // OpenAI API
      const openai = new OpenAI(process.env.OPENAI_API_KEY);

      const response = await openai.chat({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      });

      console.log(response.data.choices[0].message.content);
    } catch (error) {
      setError(error.message)
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
      <form onSubmit={onSubmit} className="new-chat-form border-gradient">
        <textarea name="message" rows="1" placeholder="Send a message..."></textarea>
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

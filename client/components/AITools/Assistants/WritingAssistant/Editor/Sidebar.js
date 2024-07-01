import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import WritingAssistantSidebarSingle from "./Single";
import { useAppContext } from "@/context/Context";

import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WritingAssistantSidebar = ({ documents }) => {
  const { data: session, status } = useSession();

  const { shouldCollapseRightbar } = useAppContext();
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [sectionStates, setSectionStates] = useState({
    previous: true,
    yesterday: true,
    older: true,
  });

  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);

    if (search.trim() === "") {
      return;
    }

    documents["today"] = documents["today"].filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase());
    });

    documents["yesterday"] = documents["yesterday"].filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase());
    });

    documents["previous"] = documents["previous"].filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase());
    });

    documents["older"] = documents["older"].filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredDocuments(documents);
  };

  const toggleSection = (section) => {
    setSectionStates((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <>
      <div
        className={`editor-left-side-panel popup-dashboard right-section ${shouldCollapseRightbar ? "collapsed" : ""
          }`}
      >
        <div className="left-side-top">
          <a
            className="btn-default bg-solid-primary"
            data-bs-toggle="modal"
            data-bs-target="#newdocumentModal"
          >
            <span className="icon">
              <i className="feather-plus-circle"></i>
            </span>
            <span>New Document</span>
          </a>
        </div>
        <div className="left-side-bottom">
          <div className="small-search search-section mb--20">
            <input type="text" placeholder="Search Here..." onChange={(e) => handleSearch(e)} />
            <i className="feather-search"></i>
          </div>

          {(documents.today && documents.today.length > 0) && (
            <div className="chat-history-section">
              <h6 className="title">Today</h6>
              <ul className="chat-history-list">
                {documents.today.map((document, index) => (
                  <WritingAssistantSidebarSingle
                    {...document}
                    key={index}
                    document={document}
                  />
                ))}
              </ul>
            </div>
          )}

          {(documents.yesterday && documents.yesterday.length > 0) && (
            <div
              className={`chat-history-section has-show-more ${!sectionStates.yesterday ? "active" : ""
                }`}
            >
              <h6 className="title">Yesterday</h6>
              <ul className="chat-history-list has-show-more-inner-content">
                {documents.yesterday.map((document, index) => (
                  <WritingAssistantSidebarSingle
                    {...document}
                    key={index}
                    document={document}
                  />
                ))}
              </ul>
              <div
                className={`rbt-show-more-btn ${!sectionStates.yesterday ? "active" : ""
                  }`}
                onClick={() => toggleSection("yesterday")}
              >
                Show More
              </div>
            </div>
          )}

          {(documents.previous && documents.previous.length > 0) && (
            <div
              className={`chat-history-section has-show-more ${!sectionStates.previous ? "active" : ""
                }`}
            >
              <h6 className="title">Previous 7 days</h6>
              <ul className="chat-history-list has-show-more-inner-content">
                {documents.previous.map((document, index) => (
                  <WritingAssistantSidebarSingle
                    {...document}
                    key={index}
                    document={document}
                  />
                ))}
              </ul>
              <div
                className={`rbt-show-more-btn ${!sectionStates.previous ? "active" : ""
                  }`}
                onClick={() => toggleSection("previous")}
              >
                Show More
              </div>
            </div>
          )}

          {(documents.older && documents.older.length > 0) && (
            <div
              className={`chat-history-section has-show-more ${!sectionStates.older ? "active" : ""
                }`}
            >
              <h6 className="title">November</h6>
              <ul className="chat-history-list has-show-more-inner-content">
                {documents.older.map((document, index) => (
                  <WritingAssistantSidebarSingle
                    {...document}
                    key={index}
                    document={document}
                  />
                ))}
              </ul>
              <div
                className={`rbt-show-more-btn mb--100 ${!sectionStates.older ? "active" : ""
                  }`}
                onClick={() => toggleSection("older")}
              >
                Show More
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WritingAssistantSidebar;

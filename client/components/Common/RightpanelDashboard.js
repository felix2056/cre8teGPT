import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// import RightPanelData from "../../data/dashboard.json";
import SingleRightPanel from "./Props/SingleRightPanel";
import { useAppContext } from "@/context/Context";

import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RightpanelDashboard = ({assistant}) => {
  const { data: session, status } = useSession();
  
  const { shouldCollapseRightbar } = useAppContext();
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [sectionStates, setSectionStates] = useState({
    previous: true,
    yesterday: true,
    older: true,
  });

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status !== "authenticated") return;
    getThreads();
  }, [status]);

  const getThreads = async () => {
    const headers = {
      "Authorization": `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/threads/assistant/${assistant}`, { headers }).then((response) => {
        setThreads(response.data.threads);
    }).catch((error) => {
        toast.error(error.message);
    });
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);

    if (search.trim() === "") {
      return;
    }

    threads["today"] = threads["today"].filter((thread) => {
      return thread.title.toLowerCase().includes(search.toLowerCase());
    });

    threads["yesterday"] = threads["yesterday"].filter((thread) => {
      return thread.title.toLowerCase().includes(search.toLowerCase());
    });

    threads["previous"] = threads["previous"].filter((thread) => {
      return thread.title.toLowerCase().includes(search.toLowerCase());
    });

    threads["older"] = threads["older"].filter((thread) => {
      return thread.title.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredThreads(threads);
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
        className={`rbt-right-side-panel popup-dashboardright-section ${
          shouldCollapseRightbar ? "collapsed" : ""
        }`}
      >
        <div className="right-side-top">
          <a
            className="btn-default bg-solid-primary"
            data-bs-toggle="modal"
            data-bs-target="#newchatModal"
          >
            <span className="icon">
              <i className="feather-plus-circle"></i>
            </span>
            <span>New Chat</span>
          </a>
        </div>
        <div className="right-side-bottom">
          <div className="small-search search-section mb--20">
            <input type="search" placeholder="Search Here..." onChange={(e) => handleSearch(e)} />
            <i className="feather-search"></i>
          </div>

          {(threads.today && threads.today.length > 0) && (
          <div className="chat-history-section">
            <h6 className="title">Today</h6>
            <ul className="chat-history-list">
              {threads.today.map((thread, index) => (
                  <SingleRightPanel
                    {...thread}
                    key={index}
                    thread={thread}
                  />
                ))}
            </ul>
          </div>
          )}

          {(threads.yesterday && threads.yesterday.length > 0) && (
          <div
            className={`chat-history-section has-show-more ${
              !sectionStates.yesterday ? "active" : ""
            }`}
          >
            <h6 className="title">Yesterday</h6>
            <ul className="chat-history-list has-show-more-inner-content">
              {threads.yesterday.map((thread, index) => (
                  <SingleRightPanel
                    {...thread}
                    key={index}
                    thread={thread}
                  />
                ))}
            </ul>
            <div
              className={`rbt-show-more-btn ${
                !sectionStates.yesterday ? "active" : ""
              }`}
              onClick={() => toggleSection("yesterday")}
            >
              Show More
            </div>
          </div>
          )}

          {(threads.previous && threads.previous.length > 0) && (
          <div
            className={`chat-history-section has-show-more ${
              !sectionStates.previous ? "active" : ""
            }`}
          >
            <h6 className="title">Previous 7 days</h6>
            <ul className="chat-history-list has-show-more-inner-content">
              {threads.previous.map((thread, index) => (
                  <SingleRightPanel
                    {...thread}
                    key={index}
                    thread={thread}
                  />
                ))}
            </ul>
            <div
              className={`rbt-show-more-btn ${
                !sectionStates.previous ? "active" : ""
              }`}
              onClick={() => toggleSection("previous")}
            >
              Show More
            </div>
          </div>
          )}

          {(threads.older && threads.older.length > 0) && (
          <div
            className={`chat-history-section has-show-more ${
              !sectionStates.older ? "active" : ""
            }`}
          >
            <h6 className="title">November</h6>
            <ul className="chat-history-list has-show-more-inner-content">
              {threads.older.map((thread, index) => (
                  <SingleRightPanel
                    {...thread}
                    key={index}
                    thread={thread}
                  />
                ))}
            </ul>
            <div
              className={`rbt-show-more-btn mb--100 ${
                !sectionStates.older ? "active" : ""
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

export default RightpanelDashboard;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const SingleRightPanel = ({ thread }) => {
  const router = useRouter();
  const [router_thread_id, setRouterThreadId] = useState(null);

  useEffect(() => {
    if (router.query.thread_id) {
      setRouterThreadId(router.query.thread_id);
    }
  }, [router.query.thread_id]);

  return (
    <>
      <li className={`history-box ${thread.thread_id == router_thread_id ? "active" : ""}`}>
        {thread.title}
        <div className="dropdown history-box-dropdown">
          <button
            type="button"
            className="more-info-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="feather-more-horizontal"></i>
          </button>
          <ul className="dropdown-menu">
            {/* {item.list.map((innerItem, innerIndex) => (
              <li key={innerIndex}>
                <a className="dropdown-item" href="#">
                  <i className={`feather-${innerItem.icon}`}></i>{" "}
                  {innerItem.text}
                </a>
              </li>
            ))} */}
          </ul>
        </div>
      </li>
    </>
  );
};

export default SingleRightPanel;

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

import sal from "sal.js";

const AIToolsItem = ({ AIToolsItem }) => {
  useEffect(() => {
    console.log(AIToolsItem); // [object Object]

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

  return (
    <>
      <ul className="genarator-card-group full-width-list">
      {AIToolsItem &&
        AIToolsItem.map((data, index) => (
          <li key={index}>
            <Link
              href={data.slug}
              className={`genarator-card bg-flashlight-static center-align ${data.badge == "coming" ? "disabled" : ""}`}
            >
              <div className="inner">
                <div className="left-align">
                  <div className="img-bar">
                    <Image
                      src={data.icon}
                      width={data.wdt ? data.wdt : 40}
                      height={40}
                      alt={data.name + " | AI Tool"}
                    />
                  </div>
                  <h5 className="title">{data.name}</h5>
                  <span className="rainbow-demo-btn">
                    Try It Now
                  </span>
                </div>
              </div>
              {data.badge !== "" && (
                <span className="rainbow-badge-card text-capitalize">
                  {data.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AIToolsItem;

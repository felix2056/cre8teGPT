import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/Context";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import sal from "sal.js";

import boxedLogo from "../../public/images/logo/boxed-logo.png";
import PageHead from "@/pages/Head";

const Error = () => {
    let [error, setError] = useState("");

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
        
        // set error from query parameters
        setError(new URLSearchParams(window.location.search).get("error"));
    }, []);

  return (
    <>
      <PageHead title="Error" />
      <div
        className="signup-area rainbow-section-gapTop-big"
        data-black-overlay="2"
      >
        <div className="sign-up-wrapper rainbow-section-gap">
          <div className="sign-up-box bg-flashlight">
            <div className="signup-box-top top-flashlight light-xl">
              <Image
                src={boxedLogo}
                width={476}
                height={158}
                alt="sign-up logo"
              />
            </div>
            <div className="separator-animated animated-true"></div>
            <div className="signup-box-bottom">
              <div className="signup-box-content">
                <h4 className="title">An Error Occurred!</h4>
                <p className="subtitle">
                    { error }
                </p>
              </div>
              <div className="signup-box-footer">
                <div className="bottom-text">
                    <p>
                        <Link href="/auth/signin">Back to Login</Link>
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;

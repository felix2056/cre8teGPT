import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/Context";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import sal from "sal.js";

import boxedLogo from "../../public/images/logo/boxed-logo.png";
import google from "../../public/images/sign-up/google.png";
import apple from "../../public/images/sign-up/apple.png";
import facebook from "../../public/images/sign-up/facebook.png";
import twitter from "../../public/images/sign-up/twitter.png";
import PageHead from "@/pages/Head";

import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// import { getProviders } from "next-auth/react"
import { getCsrfToken } from "next-auth/react"
import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const UserAuth = () => {
  const router = useRouter();
  const { toggleAuth, setToggleAuth } = useAppContext();
  const [csrfToken, setCsrfToken] = useState("");
  const [providers, setProviders] = useState({});
  let [isLoading, setIsLoading] = useState(false);
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

    async function fetchProviders() {
      const providersData = await getProviders();
      setProviders(providersData);
    }
    // fetchProviders();

    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token ?? "");
    };
    fetchCsrfToken();
  }, []);

  const handleOauthLogin = (providerId) => {
    signIn(providerId);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("login_email");
    const password = formData.get("login_password");

    setIsLoading(true);

    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((response) => {
      if (response.ok) {
        setIsLoading(false);

        //check for callback url in query params
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get("callbackUrl");
        
        if (callbackUrl) {
          // strip out host from callbackUrl
          if (callbackUrl.includes("http")) {
            const url = new URL(callbackUrl);
            router.push(url.pathname);
          } else {
            router.push(callbackUrl);
          }
        }
        
        router.push("/dashboard");
      } else {
        setError(response.error);
        setIsLoading(false);
      }
    }).catch((error) => {
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const first_name = formData.get("register_first_name");
    const last_name = formData.get("register_last_name");
    const email = formData.get("register_email");
    const password = formData.get("register_password");
    const confirm_password = formData.get("register_confirm_password");

    setIsLoading(true);

    if (password !== confirm_password) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // get sanctum cookie
    await axios.get('/sanctum/csrf-cookie', { 
      withCredentials: true 
    }).then(response => {
      console.log(response);
    });
    
    const data = {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
    };

    await axios.post('/api/register', data, {
      withCredentials: true,
    }).then(response => {
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then((response) => {
        if (response.ok) {
          setIsLoading(false);
          router.push("/dashboard");
        } else {
          setError(response.error);
          setIsLoading(false);
        }
      }).catch((error) => {
        setError("Something went wrong. Please try again later.");
        setIsLoading(false);
      });
    }).catch(error => {
      setError(error.response.data.message);
      setIsLoading(false);
    });
  }

  return (
    <>
      <PageHead title={`${toggleAuth ? "Log In" : "SignUp"}`} />
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
                <h4 className="title">{toggleAuth ? "Welcome Back!" : "Get Started"}</h4>
                <div className="social-btn-grp">
                  <Link className="btn-default btn-border" href="#" onClick={() => handleOauthLogin("google")}>
                    <span className="icon-left">
                      <Image
                        src={google}
                        width={18}
                        height={18}
                        alt="Google Icon"
                      />
                    </span>
                    Login with Google
                  </Link>
                  <Link className="btn-default btn-border" href="#" onClick={() => handleOauthLogin("apple")}>
                    <span className="icon-left">
                      <Image
                        src={apple}
                        width={18}
                        height={18}
                        alt="Apple Icon"
                      />
                    </span>
                    Login with Apple
                  </Link>
                </div>
                <div className="social-btn-grp">
                  <Link className="btn-default btn-border" href="#" onClick={() => handleOauthLogin("facebook")}>
                    <span className="icon-left">
                      <Image
                        src={facebook}
                        width={18}
                        height={18}
                        alt="Google Icon"
                      />
                    </span>
                    Login with Facebook
                  </Link>
                  <Link className="btn-default btn-border" href="#" onClick={() => handleOauthLogin("twitter")}>
                    <span className="icon-left">
                      <Image
                        src={twitter}
                        width={18}
                        height={18}
                        alt="Twitter Icon"
                      />
                    </span>
                    Login with Twitter
                  </Link>
                </div>
                <div className="text-social-area">
                  <hr />
                  <span>Or continue with</span>
                  <hr />
                </div>
                {toggleAuth ? (
                  <form action="/api/auth/callback/credentials" onSubmit={handleLogin}>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <div className="input-section mail-section">
                      <div className="icon">
                        <i className="feather-mail"></i>
                      </div>
                      <input type="email" name="login_email" placeholder="Enter email address" />
                    </div>
                    <div className="input-section password-section">
                      <div className="icon">
                        <i className="feather-lock"></i>
                      </div>
                      <input type="password" name="login_password" placeholder="Password" />
                    </div>
                    <div className="forget-text">
                      <Link className="btn-read-more" href="#">
                        <span>Forgot password</span>
                      </Link>
                    </div>
                    <button type="submit" className="btn-default">
                      Sign In
                      {isLoading ? <i className="fa fa-spinner fa-spin ms-2"></i> : <i className="feather-arrow-right"></i>}
                    </button>
                  </form>
                ) : (
                  <form action="/api/auth/callback/credentials" onSubmit={handleRegister}>
                    <div className="input-section mail-section">
                      <div className="icon">
                        <i className="feather-user"></i>
                      </div>
                      <input type="text" name="register_first_name" placeholder="Enter Your First Name" />
                    </div>
                    <div className="input-section mail-section">
                      <div className="icon">
                        <i className="feather-user"></i>
                      </div>
                      <input type="text" name="register_last_name" placeholder="Enter Your Last Name" />
                    </div>
                    <div className="input-section mail-section">
                      <div className="icon">
                        <i className="feather-mail"></i>
                      </div>
                      <input type="email" name="register_email" placeholder="Enter email address" />
                    </div>
                    <div className="input-section password-section">
                      <div className="icon">
                        <i className="feather-lock"></i>
                      </div>
                      <input type="password" name="register_password" placeholder="Create Password" />
                    </div>
                    <div className="input-section password-section">
                      <div className="icon">
                        <i className="feather-lock"></i>
                      </div>
                      <input type="password" name="register_confirm_password" placeholder="Confirm Password" />
                    </div>
                    <button type="submit" className="btn-default">
                      Sign Up
                      {isLoading ? <i className="fa fa-spinner fa-spin ms-2"></i> : <i className="feather-arrow-right"></i>}
                    </button>
                  </form>
                )}
              </div>
              <div className="signup-box-footer">
                <div className="bottom-text">
                  { error && <p className="text-danger">{error}</p> }
                  Don&apos;t have an account?
                  <Link
                    className="btn-read-more ps-2"
                    href="javascript:void(0)"
                    onClick={() => setToggleAuth(!toggleAuth)}
                  >
                    {toggleAuth ? <span>Sign Up</span> : <span>Sign In</span>}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAuth;

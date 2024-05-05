import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/Context";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import sal from "sal.js";

import boxedLogo from "../../public/images/logo/boxed-logo.png";
import PageHead from "@/pages/Head";

import { useSession, signIn, signOut } from "next-auth/react";

import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OAuth = () => {
    const { data: session } = useSession();
    const router = useRouter();

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

        // wait for session to be available
        if (!session) return;

        const verify_toast = toast.loading("Verifying your account... ⏳", {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            width: "100%",
        });

        console.log("session", session)

        // get sanctum cookie
        axios.get('/sanctum/csrf-cookie')
        .then(() => {
            const data = {
                email: session?.user?.email,
                name: session?.user?.name,
                image: session?.user?.image,
                provider: session?.user?.provider || new URLSearchParams(window.location.search).get("provider"),
                provider_id: session?.user?.provider_id,
            };
    
            axios.post("/api/after-social-login", data)
            .then((response) => {
                console.log("response", response)
                const user = response.data.user;

            //     signIn("credentials", {
            //         email: user.email,
            //         password: user.provider_id,
            //         redirect: false,
            //     }).then((response) => {
            //         if (response.ok) {
            //             toast.update(verify_toast, {
            //                 render: "Your account has been verified!🎉. Redirecting to dashboard...",
            //                 type: "success",
            //                 isLoading: false,
            //                 autoClose: 3000,
            //             });

            //             setTimeout(() => {
            //                 router.push("/dashboard");
            //             }, 3000);
            //         } else {
            //             toast.update(verify_toast, {
            //                 render: "Sorry, we couldn't verify your account!😢. Please try again",
            //                 type: "error",
            //                 isLoading: false,
            //                 autoClose: 5000,
            //             });

            //             signOut({ callbackUrl: "/auth/signin" });
            //         }
            //     }).catch((error) => {
            //         console.log("error", error)
            //         toast.update(verify_toast, {
            //             render: "Sorry, we couldn't verify your account!😢. Please try again",
            //             type: "error",
            //             isLoading: false,
            //             autoClose: 5000,
            //         });

            //         signOut({ callbackUrl: "/auth/signin" });
            //     }) 
            });
        });
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
                    <h4 className="title">Verifying your account... ⏳</h4>
                    <p className="subtitle">
                        Please wait while we confirm your account.
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
};

export default OAuth;

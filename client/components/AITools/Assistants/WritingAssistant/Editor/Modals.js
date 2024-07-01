import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import axios from "axios";
import sal from "sal.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Link from "next/link";

const WritingAssistantEditorModals = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    
    const headers = {
        "Authorization": `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    useEffect(() => {
        sal();
    }, []);

    const createDocument = async (title) => {
        setIsLoading(true);

        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/writing-assistant/documents/create`, { title }, { headers }).then((response) => {
            if (response.status === 200) {
                setIsLoading(false);
                toast.success("Document created successfully");

                // close the modal
                $("#newdocumentModal").modal("hide");

                setTimeout(() => {
                    router.push(`/tools/assistants/writing-assistant/editor/${response.data.document.slug}`);
                }, 1000);
            }
        }).catch((error) => {
            setIsLoading(false);
            toast.error(error.message);
        });
    };

    const renameDocument = async (title) => {
        setIsLoading(true);

        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/writing-assistant/documents/${router.query.document_slug}/rename`, { title }, { headers }).then((response) => {
            if (response.status === 200) {
                setIsLoading(false);
                toast.success("Document renamed successfully");

                // close the modal
                $("#renameDocumentModal").modal("hide");

                setTimeout(() => {
                    router.push(`/tools/assistants/writing-assistant/editor/${response.data.document.slug}`);
                }, 1000);
            }
        }).catch((error) => {
            setIsLoading(false);
            toast.error(error.message);
        });
    };


    return (
        <>
            <ToastContainer />

            {/* ==== Create Document Modal ==== */}
            <div
                id="newdocumentModal"
                className="modal rbt-modal-box copy-modal fade"
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content wrapper top-flashlight light-xl">
                        <div
                            className="section-title text-center mb--30 sal-animate"
                            data-sal="slide-up"
                            data-sal-duration="400"
                            data-sal-delay="150"
                        >
                            <h3 className="title mb--0 w-600">What's your document about?</h3>

                            <div className="chat-form mt--10">
                                <div className="border-gradient text-form">
                                    <input type="text" rows="6" placeholder="Enter document title and hit 'Enter'" onKeyPress={(e) => { if (e.key === "Enter") { createDocument(e.target.value); } }} />
                                </div>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="genarator-section">

                                <div className="text-center mt--20">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="close-button" data-bs-dismiss="modal">
                            <i className="feather-x"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* ==== Rename Document Modal ==== */}
            <div
                id="renameDocumentModal"
                className="modal rbt-modal-box copy-modal fade"
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content wrapper top-flashlight light-xl">
                        <div
                            className="section-title text-center mb--30 sal-animate"
                            data-sal="slide-up"
                            data-sal-duration="400"
                            data-sal-delay="150"
                        >
                            <h3 className="title mb--0 w-600">Rename your document</h3>

                            <div className="chat-form mt--10">
                                <div className="border-gradient text-form">
                                    <input type="text" rows="6" placeholder="Enter document title and hit 'Enter'" onKeyPress={(e) => { if (e.key === "Enter") { renameDocument(e.target.value); } }} />
                                </div>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="genarator-section">

                                <div className="text-center mt--20">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="close-button" data-bs-dismiss="modal">
                            <i className="feather-x"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WritingAssistantEditorModals;

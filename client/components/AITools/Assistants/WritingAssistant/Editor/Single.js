import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

import axios from "axios";

const WringAssistantSidebarSingle = ({ document }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    
    const [isPinning, setIsPinning] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [documentTitle, setDocumentTitle] = useState(document.title);

    const [router_document_id, setRouterDocumentId] = useState(null);

    const options = [
        // {
        //     "icon": "tag",
        //     "text": "Pin",
        //     "event": "pin"
        // },
        {
            "icon": "file-text",
            "text": "Rename",
            "event": "rename"
        },
        {
            "icon": "share-2",
            "text": "Share",
            "event": "share"
        },
        {
            "icon": "trash-2",
            "text": "Delete",
            "event": "delete"
        }
    ];

    useEffect(() => {
        if (router.query.document_slug) {
            setRouterDocumentId(router.query.router_document_id);
        }
    }, [router.query.document_slug]);

    const handleClick = (event, link) => {
        event.preventDefault();

        if (link == "pin") {
            setIsPinning(true);
            pinDocument();
        } else if (link == "rename") {
            setIsRenaming(true);
        } else if (link == "share") {
            setIsSharing(true);
        } else if (link == "delete") {
            setIsDeleting(true);
            deleteDocument();
        }
    };

    const pinDocument = () => {
        
    };

    const renameDocument = async () => {
        if (documentTitle.trim() === "") return;

        let title = documentTitle.charAt(0).toUpperCase() + documentTitle.slice(1);

        try {
            const headers = {
                "Authorization": `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            };

            setDocumentTitle(title);
            setIsRenaming(false);

            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/writing-assistant/documents/${document.id}/rename`, { title }, { headers })
            .then((response) => {
                router.push(`/tools/assistants/writing-assistant/editor/${response.data.document.slug}`);
            });
        } catch (error) {
            console.error(error);
            setIsRenaming(false);
        }
    };

    const deleteDocument = () => {
        try {
            axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tools/assistants/writing-assistant/documents/${document.id}/delete`)
            .then((response) => {
                console.log(response);

                router.push("/tools/assistants/writing-assistant/editor");
            });
        } catch (error) {
            console.error(error);
        } finally {
            isDeleting(false);
        }
    };

    return (
        <>
            <li className={`history-box ${(document.id == router_document_id || document.slug == router_document_id) ? "active" : ""}`}>
                { isRenaming ? (
                    <input type="text" className="form-control" value={documentTitle} placeholder="Enter new  title and hit 'Enter'" onChange={(event) => setDocumentTitle(event.target.value)} onKeyPress={(event) => event.key === "Enter" ? renameDocument() : null} />
                ) : (
                    <Link href={`/tools/assistants/writing-assistant/editor/${document.slug}`}>
                        {documentTitle}
                    </Link>
                )}
                
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
                        {options.map((option, index) => (
                            <li key={index}>
                                <a className="dropdown-item" onClick={(event) => handleClick(event, option.event)}>
                                    <i className={`feather-${option.icon}`}></i>{" "}
                                    {option.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </li>
        </>
    );
};

export default WringAssistantSidebarSingle;

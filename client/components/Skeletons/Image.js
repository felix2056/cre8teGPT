import React from "react"

const ImageSkeleton = ({number}) => {
    return (
        <>
        { Array(number).fill(0).map((el, index) => (
            <div className="chat-box-list pt--30" key={index}>
                <div className="chat-box author-speech bg-flashlight">
                    <div className="inner">
                        <div className="chat-section">
                            <div className="author">
                                <div className="loading-skeleton">
                                    <div className="thumbnail"></div>
                                </div>
                            </div>
                            <div className="chat-content">
                                <div className="loading-skeleton">
                                    <div className="title"></div>
                                    <div className="message"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chat-box ai-speech bg-flashlight">
                    <div className="inner top-flashlight leftside light-xl">
                        <div className="chat-section">
                            <div className="author">
                                <div className="loading-skeleton">
                                    <div className="thumbnail"></div>
                                </div>
                            </div>
                            <div className="chat-content">
                                <div className="loading-skeleton">
                                    <div className="message"></div>
                                </div>

                                <div className="image-caption mb--20">
                                    <div className="loading-skeleton">
                                        <div className="message"></div>
                                    </div>
                                </div>
                                <div className="img-box-grp mb--20">
                                    <div className="loading-skeleton">
                                        <div className="image"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        </>
    )
}

export default ImageSkeleton
import React from "react"
import Image from "next/image"

const TipTapSkeleton = ({number}) => {
    return (
        <>
        { Array(number).fill(0).map((el, index) => (
            <div className="chat-content">
                <div className="loading-skeleton">
                    <div className="title"></div>
                    <div className="message"></div>
                    <div className="message"></div>
                </div>
            </div>
        ))}
        </>
    )
}

export default TipTapSkeleton
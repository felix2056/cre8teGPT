import React from "react"

const ImageV2Skeleton = ({number}) => {
    return (
        <>
            <div className="banner-poster-inner">
                <div className="row">
                { Array(number).fill(0).map((el, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
                        <div className="image-area">
                            <a href="#">
                                <div className="loading-skeleton">
                                    <div className="image-v2"></div>
                                </div>
                            </a>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ImageV2Skeleton
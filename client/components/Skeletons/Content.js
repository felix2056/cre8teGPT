import React from "react"
import Image from "next/image"

const TextSkeleton = ({number}) => {
    return (
        <>
        { Array(number).fill(0).map((el, index) => (
            <div className="search__generator mt--50" key={index}>
                <div className="tab-content mt--50" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                        <div className="searchoptopn-area mb--30">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <div className="loading-skeleton">
                                            <div className="title"></div>
                                        </div>
                                        <div className="loading-skeleton mt--10">
                                            <div className="text-area"></div>
                                        </div>
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

export default TextSkeleton
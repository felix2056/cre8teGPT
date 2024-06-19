import { useEffect } from "react"

import Image from "next/image";
import sal from "sal.js";;

// import brand1 from "../../public/images/brand/brand-01.png";
// import brand2 from "../../public/images/brand/brand-02.png";
// import brand3 from "../../public/images/brand/brand-03.png";
// import brand4 from "../../public/images/brand/brand-04.png";
// import brand5 from "../../public/images/brand/brand-05.png";
// import brand6 from "../../public/images/brand/brand-06.png";
// import brand7 from "../../public/images/brand/brand-07.png";
// import brand8 from "../../public/images/brand/brand-08.png";
import amd from "../../public/images/brand/amd.png";

import admedia from "../../public/images/brand/admedia.svg";
import next from "../../public/images/brand/next.svg";
import newmark from "../../public/images/brand/newmark.svg";
import zooplus from "../../public/images/brand/zooplus.svg";
import paloalto from "../../public/images/brand/paloalto.svg";
import unwomen from "../../public/images/brand/unwomen.svg";
import deloitte from "../../public/images/brand/deloitte.svg";
import square from "../../public/images/brand/square.svg";
import plivo from "../../public/images/brand/plivo.svg";

const Brands = () => {
  useEffect(() => {
    sal();
}, []);

  return (
    <>
      <div className="rainbow-brand-area rainbow-section-gap" data-sal="slide-up" data-sal-duration="700" data-sal-delay="200">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title text-center sal-animate"
                data-sal="slide-up"
                data-sal-duration="700"
                data-sal-delay="100"
              >
                <h4 className="subtitle ">
                  Used by <span className="theme-gradient">5,000+</span> content creators, marketers, students, influencers and entrepreneurs
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 mt--10">
              <div className="brand-list">
                  <i class="fa-brands fa-dev"></i>
                  <i class="fa-brands fa-teamspeak"></i>
                  <i class="fa-brands fa-product-hunt"></i>
                  <i class="fa-brands fa-free-code-camp"></i>
                  <i class="fa-brands fa-npm"></i>
                  <i class="fa-brands fa-yarn"></i>
                  <i class="fa-brands fa-webflow"></i>
                  <i class="fa-brands fa-codepen"></i>
                  <i class="fa-brands fa-researchgate"></i>
                  <i class="fa-brands fa-foursquare"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brands;

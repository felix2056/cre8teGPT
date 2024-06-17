import Header from "@/components/Header/Header";
import HeaderTop from "@/components/Header/HeaderTop/Header-Top";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";

// import Home from "@/components/Home/Home";
import Home from "@/components/Home/Home_v2";

import Service from "@/components/Service/Service";
import Context from "@/context/Context";
import Separator from "../separator";
import Timeline from "@/components/Timeline/Timeline";
import Split from "@/components/Split/Split";
import PricingTwo from "@/components/Pricing/PricingTwo";
import Accordion from "@/components/Accordion/Accordion";
import Brands from "@/components/Brands/Brands";
import CallToAction from "@/components/CallToAction/CallToAction";
import Footer from "@/components/Footer/Footer";
import Copyright from "@/components/Footer/Copyright";
import PageHead from "../Head";
import FeaturedTools from "@/components/Categories/FeaturedTools";
// import Testimonials from "@/components/Testimonials/Testimonials";
import Reviews from "@/components/Testimonials/Reviews";

const HomePage = () => {
  return (
    <>
      <PageHead title="Home" />

      <main className="page-wrapper">
        <Context>
          
          <HeaderTop />
          <Header
            headerTransparent="header-not-transparent"
            headerSticky="header-sticky"
            btnClass="btn-small round"
          />
          <PopupMobileMenu />

          <Home />
          <Service />
          <Separator top={false} style={{ zIndex: 2 }} />
          <Timeline />
          <Separator top={false} />
          <Split />
          <Separator top={true} />
          <FeaturedTools />
          <Separator top={true} />
          {/* <Testimonials />
          <Separator top={true} /> */}
          <Reviews />
          <Separator top={true} />
          <PricingTwo
              parentClass="col-xl-3 col-lg-6 col-md-6 col-12"
              childClass="tab-content bg-transparent bg-light"
              start={0}
              end={4}
              isHeading={false}
              gap={false}
          />
          <Separator top={true} />
          <Accordion isHead={true} />
          <Separator top={false} />
          <Brands />
          <Separator top={true} />
          <CallToAction />

          <Footer />
          <Copyright />
        </Context>
      </main>
    </>
  );
};

export default HomePage;

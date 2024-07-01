import Header from "@/components/Header/Header";
import HeaderTop from "@/components/Header/HeaderTop/Header-Top";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import TextGeneratorLanding from "@/components/AITools/Generators/TextGeneratorLanding";

import Service from "@/components/Service/Service";
import Context from "@/context/Context";
import Separator from "../../separator";
import Timeline from "@/components/Timeline/Timeline";
import Split from "@/components/Split/Split";
import Pricing from "@/components/Pricing/Pricing";
import Accordion from "@/components/Accordion/Accordion";
import Brands from "@/components/Brands/Brands";
import CallToAction from "@/components/CallToAction/CallToAction";
import Footer from "@/components/Footer/Footer";
import Copyright from "@/components/Footer/Copyright";
import PageHead from "../../Head";

const TextGeneratorLandingPage = () => {
  return (
    <>
      <PageHead title="AI Chat - Chat with Cre8teGPT" />

      <main className="page-wrapper">
        <Context>
          
          <HeaderTop />
          <Header
            headerTransparent="header-not-transparent"
            headerSticky="header-sticky"
            btnClass="btn-small round"
          />
          <PopupMobileMenu />

          <TextGeneratorLanding />
          <Separator top={false} />
          <Split />
          <Separator top={true} />
          <CallToAction />

          <Footer />
          <Copyright />
        </Context>
      </main>
    </>
  );
};

export default TextGeneratorLandingPage;

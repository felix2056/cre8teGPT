import Header from "@/components/Header/Header";
import HeaderTop from "@/components/Header/HeaderTop/Header-Top";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import YouTubeChannelAnalyzerChannels from "@/components/AITools/Generators/YouTubeChannelAnalyzerChannels";

import Service from "@/components/Service/Service";
import Context from "@/context/Context";
import Separator from "../../../separator";
import Timeline from "@/components/Timeline/Timeline";
import Split from "@/components/Split/Split";
import Pricing from "@/components/Pricing/Pricing";
import Accordion from "@/components/Accordion/Accordion";
import Brands from "@/components/Brands/Brands";
import CallToAction from "@/components/CallToAction/CallToAction";
import Footer from "@/components/Footer/Footer";
import Copyright from "@/components/Footer/Copyright";
import PageHead from "../../../Head";

const YouTubeChannelAnalyzerChannelsPage = () => {
  return (
    <>
      <PageHead title="YouTube Channel Analyzer - Analyze Your YouTube Channel" />

      <main className="page-wrapper">
        <Context>
          
          <HeaderTop />
          <Header
            headerTransparent="header-not-transparent"
            headerSticky="header-sticky"
            btnClass="btn-small round"
          />
          <PopupMobileMenu />

          <YouTubeChannelAnalyzerChannels />
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

export default YouTubeChannelAnalyzerChannelsPage;

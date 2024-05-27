import React from "react";
import PageHead from "../../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import SpeechToTextGenerator from "@/components/AITools/Generators/SpeechToText";

const SpeechToTextGeneratorPage = () => {
  return (
    <>
      <PageHead title="Speech To Text Generator" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <Modal />

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <SpeechToTextGenerator />
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

export default SpeechToTextGeneratorPage;

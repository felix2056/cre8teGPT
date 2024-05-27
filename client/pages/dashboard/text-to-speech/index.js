import React from "react";
import PageHead from "../../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import TextToSpeechGenerator from "@/components/AITools/Generators/TextToSpeech";

const TextToSpeechGeneratorPage = () => {
  return (
    <>
      <PageHead title="Vedio Generator" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <Modal />

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <TextToSpeechGenerator />
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

export default TextToSpeechGeneratorPage;

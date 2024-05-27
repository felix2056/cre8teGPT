import React from "react";
import PageHead from "../../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/AITools/Generators/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticbarDashboard";

const TextGeneratorPage = () => {
  return (
    <>
      <PageHead title="Text Generator" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <RightpanelDashboard assistant="text-generator" />
            <Modal />

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <TextGenerator />
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

export default TextGeneratorPage;

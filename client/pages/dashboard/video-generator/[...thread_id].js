import React from "react";
import PageHead from "../../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import Modal from "@/components/Common/Modal";
import StaticbarDashboard from "@/components/Common/StaticbarDashboard";
import VideoGenerator from "@/components/AITools/Generators/VideoGenerator";

const VideoGeneratorPage = () => {
  return (
    <>
      <PageHead title="Vedio Generator" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <RightpanelDashboard assistant="video-generator" />
            <Modal />

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <VideoGenerator />
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

export default VideoGeneratorPage;
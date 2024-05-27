import React from "react";
import PageHead from "../../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import Modal from "@/components/Common/Modal";
import StaticbarDashboard from "@/components/Common/StaticbarDashboard";
import PhotoEditor from "@/components/AITools/Editors/PhotoEditor";

const PhotoEditorPage = () => {
  return (
    <>
      <PageHead title="Image Editor" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <RightpanelDashboard assistant="photo-editor" />
            <Modal />

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <PhotoEditor />
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

export default PhotoEditorPage;

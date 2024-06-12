import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderTop from "@/components/Header/HeaderTop/Header-Top";
import Header from "@/components/Header/Header";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import Footer from "@/components/Footer/Footer";
import Copyright from "@/components/Footer/Copyright";
import Checkout from "@/components/Pricing/Checkout";

const CheckoutPage = () => {
  return (
    <>
      <PageHead title="Checkout" />

      <main className="page-wrapper">
        <Context>
          <HeaderTop />
          <Header
            headerTransparent="header-not-transparent"
            headerSticky="header-sticky"
            btnClass="btn-small round"
          />
          <PopupMobileMenu />

          <div>
            <div className="rainbow-gradient-circle"></div>
            <div className="rainbow-gradient-circle theme-pink"></div>
          </div>

          <Checkout />

          <Footer />
          <Copyright />
        </Context>
      </main>
    </>
  );
};

export default CheckoutPage;
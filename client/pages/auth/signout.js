import Header from "@/components/Header/Header";
import HeaderTop from "@/components/Header/HeaderTop/Header-Top";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import Context from "@/context/Context";
import Footer from "@/components/Footer/Footer";
import Copyright from "@/components/Footer/Copyright";
import SignOut from "@/components/Auth/SignOut";

const AuthPage = () => {
  return (
    <>
      <main className="page-wrapper">
        <Context>
          <HeaderTop />
          <Header
            headerTransparent="header-transparent"
            headerSticky="header-sticky"
            btnClass="btn-small round"
          />
          <PopupMobileMenu />

          <SignOut />

          <Footer />
          <Copyright />
        </Context>
      </main>
    </>
  );
};

export default AuthPage;

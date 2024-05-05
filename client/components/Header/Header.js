import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAppContext } from "@/context/Context";

import logo from "../../public/images/logo/logo.png";
import ToolsData from "../../data/header.json";

import Nav from "./Nav";
import GridMenu from "./GridMenu";

import UserMenu from "./UserMenu";

import { useSession } from "next-auth/react";

const Header = ({ headerTransparent, headerSticky, btnClass }) => {
  const { data: session } = useSession();
  const { activeMobileMenu, setActiveMobileMenu } = useAppContext();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <header
        className={`rainbow-header header-default ${headerTransparent} ${headerSticky} ${isSticky ? "sticky" : ""
          }`}
      >
        <div className="container position-relative">
          <div className="row align-items-center row--0">
            <div className="col-lg-3 col-md-6 col-6">
              <div className="logo">
                <Link href="/">
                  <Image
                    className="logo-light"
                    src={logo}
                    width={201}
                    height={35}
                    alt="ChatBot Logo"
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-9 col-md-6 col-6 position-static">
              <div className="header-right">
                <nav className="mainmenu-nav d-none d-lg-block">
                  <Nav />
                </nav>

                {!session?.user ? (
                  <div className="header-btn">
                    <Link
                      className={`btn-default ${btnClass}`}
                      href="/text-generator"
                    >
                      Get Started FREE
                    </Link>
                  </div>
                ) : (
                  <div className="header-btn">
                    <Link
                      className="btn-default btn-small round"
                      href="/plans-billing"
                    >
                      Upgrade <i className="feather-zap"></i>
                    </Link>
                  </div>
                )}

                <GridMenu ToolsData={ToolsData} />

                {session?.user && (
                  <div className="account-access rbt-user-wrapper right-align-dropdown">
                    <div className="rbt-user ml--0">
                      <a className="admin-img" href="#">
                        <Image src={session?.user?.avatar} alt={session?.user?.full_name} width={128} height={128} />
                      </a>
                    </div>
                    <div className="rbt-user-menu-list-wrapper">
                      <UserMenu />
                    </div>
                  </div>
                )}

                <div className="mobile-menu-bar ml--5 d-block d-lg-none">
                  <div className="hamberger">
                    <button
                      className="hamberger-button"
                      onClick={() => setActiveMobileMenu(!activeMobileMenu)}
                    >
                      <i className="feather-menu"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

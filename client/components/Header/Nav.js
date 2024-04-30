import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import DashboardItem from "../../data/header.json";

import menuImg from "../../public/images/menu-img/menu-img-2.webp";
import { useAppContext } from "@/context/Context";

import { useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showItem, setShowItem } = useAppContext();

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <ul className="mainmenu">
        <li>
          <Link href="/">Home</Link>
        </li>

        {session?.user?.user ? (
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        ) : ''}
        
        <li>
          <Link href="/dashboard">100+ AI Tools</Link>
        </li>

        {session?.user?.user ? (
        <li className="with-megamenu has-menu-child-item position-relative">
          <a
            href="#"
            onClick={() => setShowItem(!showItem)}
            className={`${!showItem ? "open" : ""}`}
          >
            Settings
          </a>
          <div
            className={`rainbow-megamenu right-align with-mega-item-2 ${
              showItem ? "" : "d-block"
            }`}
          >
            <div className="wrapper p-0">
              <div className="row row--0">
                <div className="col-lg-6 single-mega-item">
                  <h3 className="rbt-short-title">Settings</h3>
                  <ul className="mega-menu-item">
                    {DashboardItem &&
                      DashboardItem.navDashboardItem.map((data, index) => (
                        <li key={index}>
                          <Link
                            href={data.link}
                            className={isActive(data.link) ? "active" : ""}
                          >
                            {data.text}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="col-lg-6 single-mega-item">
                  <div className="header-menu-img">
                    <Image src={menuImg} alt="Menu Split Image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        ) : ''}
        
        <li>
          <Link href="/pricing">Pricing</Link>
        </li>
        
        <li>
          <Link href="/about">About</Link>
        </li>
        
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        
        {!session?.user?.user ? (
        <li>
          <Link href="/auth/signin">Sign In</Link>
        </li>
        ) : ''}
      </ul>
    </>
  );
};

export default Nav;

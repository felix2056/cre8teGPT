import React, { useEffect, useState } from "react";
import { Router } from "next/router";
import Script from 'next/script';

import "bootstrap/scss/bootstrap.scss";

// ========= Plugins CSS START =========
import "../public/css/plugins/feature.css";
import "../public/css/plugins/animation.css";
import "../node_modules/sal.js/dist/sal.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-tooltip/dist/react-tooltip.css";
// ========= Plugins CSS END =========

// ========= TipTap CSS START =========
// import '@/public/css/tiptap/index.css'
// import '@/public/css/tiptap/globals.css'

import '@/public/css/tiptap/index-raw.css'
import '@/public/css/tiptap/editor-raw.css'
// ========= TipTap CSS END =========

import "../public/scss/style.scss";
import Loading from "@/components/Loading/Loading";

import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    const handleStart = (url) => url !== Router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return <>
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {loading ? <Loading /> : <Component {...pageProps} />}

      <Script src="/js/vendor/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/js/vendor/metismenu.js" strategy="lazyOnload" />
      <Script src="/js/vendor/imagesloaded.pkgd.min.js" strategy="lazyOnload" />
      <Script src="/js/vendor/isotope.pkgd.min.js" strategy="lazyOnload" />
      <Script src="/js/vendor/magnific-popup.js" strategy="lazyOnload" />
      <Script src="/js/plugins/swiper.js" strategy="lazyOnload" />
      <Script src="/js/plugins/contact.form.js" strategy="lazyOnload" />
      <Script src="/js/main.js" strategy="lazyOnload" />
    </SessionProvider>
  </>;
}
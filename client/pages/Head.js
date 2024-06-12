import Head from "next/head";
import Script from "next/script";

const PageHead = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title} | Cre8teGPT - AI Content Generator</title>

        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Page Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        V2 CSS Files
        <link rel="stylesheet preload" href="/css/plugins/fontawesome-6.css" as="style" />
        <link rel="stylesheet preload" href="/css/plugins/unicons.css" as="style" />
        <link rel="stylesheet preload" href="/css/plugins/swiper.min.css" as="style" />
        <link rel="stylesheet preload" href="/css/vendor/magnific-popup.css" as="style" />
        <link rel="stylesheet preload" href="/css/vendor/metismenu.css" as="style" />

        {/* V2 JS Files */}
        {/* <script src="/js/vendor/jquery.min.js"></script>
        <script src="/js/vendor/metismenu.js" defer=""></script>
        <script src="/js/vendor/imagesloaded.pkgd.min.js" defer=""></script>
        <script src="/js/vendor/isotope.pkgd.min.js" defer=""></script>
        <script src="/js/vendor/magnific-popup.js" defer=""></script>
        <script src="/js/plugins/swiper.js" defer=""></script>
        <script src="/js/plugins/contact.form.js" defer=""></script>
        <script src="/js/main.js"></script> */}
      </Head>
    </>
  );
};

export default PageHead;

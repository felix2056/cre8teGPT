import Head from "next/head";

const PageHead = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title} | Cre8teGPT - AI Content Generator</title>

        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Page Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        V2 CSS Files
        <link rel="stylesheet preload" href="/css/plugins/fontawesome-6.css" as="style" />
        <link rel="stylesheet preload" href="/css/plugins/unicons.css" as="style" />
        <link rel="stylesheet preload" href="/css/plugins/swiper.min.css" as="style" />
        <link rel="stylesheet preload" href="/css/vendor/magnific-popup.css" as="style" />
        <link rel="stylesheet preload" href="/css/vendor/metismenu.css" as="style" />
      </Head>
    </>
  );
};

export default PageHead;

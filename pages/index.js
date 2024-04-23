import HomePage from "./Home";
import BackToTop from "./backToTop";

import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <>
      <HomePage />
      <BackToTop />
    </>
  );
}

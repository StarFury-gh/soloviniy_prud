import { useNavigate } from "react-router-dom";

import { Footer } from "../../components/common";
import {
  CtaSection,
  SeasonsSection,
  HeroSection,
  AboutSection,
  StatsSection,
} from "./sections";

function MainPage() {
  const navigate = useNavigate();
  const onNavigate = (page: string) => {
    navigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <StatsSection />
      <AboutSection />
      <SeasonsSection />
      <CtaSection onNavigate={onNavigate} />
      <Footer />
    </>
  );
}

export default MainPage;

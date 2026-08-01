import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import Hero from './components/section/Hero';
import Expertise from './components/section/Expertise';
import Portfolio from "./components/section/Portfolio";
import Exploration from "./components/section/Exploration";
import Experience from "./components/section/Experience";
import CardCertification from "./components/card/CardCertification";
import CardReviews from "./components/card/CardReviews";
import Contact from "./components/section/Contact";
import Footer from "./components/section/Footer";
import Seo from "./components/seo/Seo";
import useScrollReveal from "./hooks/useScrollReveal";
import {
  getAbsoluteSiteUrl,
  siteConfig,
} from "./config/site";

import { certificationsData } from "./data/certificationsData";
import { reviewsData } from "./data/reviewsData";

function App() {
  const { hash, state } = useLocation();
  const isScrollSync = state?.scrollSync === true;
  useScrollReveal();
  const homeUrl = getAbsoluteSiteUrl("/");
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${homeUrl}#person`,
        name: siteConfig.name,
        url: homeUrl,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        sameAs: siteConfig.socialProfiles,
        knowsAbout: [
          "Web Development",
          "iOS Development",
          "React",
          "Tailwind CSS",
          "Swift",
          "SwiftUI",
          "UI/UX Design",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        url: homeUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        author: {
          "@id": `${homeUrl}#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${homeUrl}#profile`,
        url: homeUrl,
        name: `${siteConfig.name} — ${siteConfig.role}`,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        mainEntity: {
          "@id": `${homeUrl}#person`,
        },
        isPartOf: {
          "@id": `${homeUrl}#website`,
        },
      },
    ],
  };

  useEffect(() => {
    if (isScrollSync) {
      return;
    }

    const sectionId = hash.slice(1) || "hero";
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash, isScrollSync]);

  return (
    <>
    <Seo
      title="Mirko Freschi | Web & iOS Developer"
      description={siteConfig.description}
      path="/"
      structuredData={homeStructuredData}
    />
    <header>
      <Navbar/>
      <section id='hero' data-reveal className='flex min-h-[calc(100svh-5rem)] items-center justify-center'>
        <Hero/>
      </section>
    </header>

    <main>
      <section id="expertise" data-reveal className='py-20 sm:py-28 lg:py-32'>
        <Expertise />
      </section>

      <section id="portfolio" data-reveal className="relative py-20 sm:py-28 lg:py-32">
        <Portfolio />
        <div
            className="
            hidden
            sm:block
            -z-1
            absolute
            -right-80
            top-10
            w-187.5
            aspect-square
            rounded-full
            bg-radial
            from-shadow to-transparent
            blur-xl
            pointer-events-none"
        />
      </section>

      <section id="exploration" data-reveal className="relative py-20 sm:py-28 lg:py-32">
        <Exploration />
        <div
            className="
            hidden
            sm:block
            -z-1
            absolute
            -left-80
            top-10
            w-187.5
            aspect-square
            rounded-full
            bg-radial
            from-shadow to-transparent
            blur-xl
            pointer-events-none"
        />
      </section>
      
      <section id="experience" className="py-20 sm:py-28 lg:py-32">
        <Experience />
      </section>

      <section id="certification"
      data-reveal
      className="relative px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold font-display text-heading sm:text-4xl">
            Certifications & Achievements
          </h2>
          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 mt-10 sm:mt-12 lg:grid-cols-2">
            {certificationsData.map((certification) =>(
              <CardCertification
                key={certification.id}
                {...certification}
              />
            ))}
          </div>
        </div>
        <div
            className="
            hidden
            sm:block
            -z-1
            absolute
            -right-80
            top-10
            w-187.5
            aspect-square
            rounded-full
            bg-radial
            from-shadow to-transparent
            blur-xl
            pointer-events-none"
        />
      </section>

      <section id="reviews"
      className="relative w-full px-5 py-16 bg-surface sm:px-8 sm:py-20">
        <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-display text-heading sm:text-4xl">
          Testimonials
        </h2>
        <div className="flex flex-row gap-5 px-2 py-5 overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden mt-3">
          {reviewsData.map((reviews) => (
            <CardReviews 
              key={reviews.id}
              {...reviews}
            />
          ))}
        </div>
        </div>
        <div
            className="
            hidden
            sm:block
            -z-1
            absolute
            -left-80
            top-10
            w-187.5
            aspect-square
            rounded-full
            bg-radial
            from-shadow to-transparent
            blur-xl
            pointer-events-none"
        />
      </section>

      <section id="contact"
      data-reveal
      className="px-5 py-16 mt-20 bg-surface sm:px-8 sm:py-20 sm:mt-28">
        <Contact />
      </section>
    </main>

    <footer className="w-full px-5 py-12 mt-20 border-t border-border sm:px-8 sm:py-16 sm:mt-28 lg:px-12.5">
      <Footer />
    </footer>
    </>
  )
}

export default App

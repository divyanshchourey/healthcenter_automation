import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import RoleSelection from "../../login-folder/src/components/RoleSelection.jsx";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from data.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback data in case of fetch error
        setData({
          hero: {
            title: "Health Automation",
            subtitle:
              "Streamline healthcare operations with intelligent automation solutions",
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            ctaText: "Learn More",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Error Loading Content
          </h1>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />


    <Routes>
      <Route path="/getStarted" element={<RoleSelection />} />
    </Routes>


      {/* Hero Section */}
      <section id="hero">
        <Hero data={data.hero} />
      </section>

       
      {/* Testimonials Section */}
      {data.testimonials && (
        <section id="testimonials">
          <Testimonials data={data.testimonials} />
        </section>
      )}

      {/* CTA Section */}
      {data.cta && (
        <section id="cta">
          <CTA data={data.cta} />
        </section>
      )}

      {/* Contact Section */}
      {data.contact && (
        <section id="contact">
          <Contact data={data.contact} />
        </section>
      )}

      {/* Footer */}
      {data.footer && <Footer data={data.footer} />}
    </div>
  );
}

export default App;

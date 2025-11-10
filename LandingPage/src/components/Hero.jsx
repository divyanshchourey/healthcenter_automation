import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Hero = ({ data }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };
  
  const navigate = useNavigate() ;





  return (
    <section
      className="hero-section relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Video Background */}
      <div className="video-container w-full ">
        <iframe
          ref={videoRef}
          src={data.videoUrl}
          title="Health Automation Video"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; muted"
          allowFullScreen
          onLoad={handleVideoLoad}
        ></iframe>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow-lg animate-fade-in-up">
          {data.title}
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 mb-8 max-w-4xl mx-auto leading-relaxed text-shadow animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {data.subtitle}
        </p>

        
  

      <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a href="/login/index.html" className="bg-white  text-lg sm:text-xl px-10 py-4 sm:px-12 sm:py-5 rounded-2xl">
            {data.ctaText}
          </a>
        </div>
      

        {/* Scroll Indicator */}
      </div>

      {/* Gradient overlay for better text contrast on mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 sm:opacity-0 z-10"></div>
    </section>
  );
};

export default Hero;

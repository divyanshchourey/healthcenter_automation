import React from "react";

const CTA = ({ data }) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Content */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {data.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            {data.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
             
            <button className="btn-secondary text-lg sm:text-xl px-10 py-4 sm:px-12 sm:py-5 bg-white text-gray-900 hover:bg-gray-100">
              {data.secondaryCtaText}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-6">
              Trusted by thousands of users worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-gray-400 font-semibold">Apple App Store</div>
              <div className="text-gray-400 font-semibold">Google Play</div>
              <div className="text-gray-400 font-semibold">Web App</div>
              <div className="text-gray-400 font-semibold">Desktop</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

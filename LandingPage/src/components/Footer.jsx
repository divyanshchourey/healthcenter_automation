import React, { useState } from "react";

const Footer = ({ data }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">{data.companyName}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {data.description}
            </p>
            {/* Social Media */}

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {data.links.about}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {data.links.contact}
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {data.links.privacy}
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {data.links.terms}
                </a>
              </li>
            </ul>
          </div>

          {/* Creators Section */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold mb-4">
              {data.creators.title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {data.creators.names.map((name, index) => {
                const link = data.creators.links?.[name];
                return (
                  <div key={index} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 {data.companyName}. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with ❤️ for better health
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

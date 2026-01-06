import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PlatformFeatures = ({ data }) => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {data.subtitle}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-14">
                    {data.sections.map((section, sectionIndex) => (
                        <div
                            key={sectionIndex}
                            className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
                        >
                            {/* Section Title */}
                            <h3 className="text-xl font-semibold text-gray-900 lg:col-span-1">
                                {section.title}
                            </h3>

                            {/* Features */}
                            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {section.items.map((item, itemIndex) => (
                                    <motion.div
                                        key={itemIndex}
                                        initial={{ opacity: 0, y: 6 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.25 }}
                                        tabIndex={0}
                                        className="group relative flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 
                                        hover:bg-white hover:shadow-md focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                                    >
                                        {/* Left Accent */}
                                        <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-l-lg" />

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="text-blue-600 mt-1 shrink-0"
                                        >
                                            <CheckCircle size={18} />
                                        </motion.div>

                                        {/* Text */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 leading-snug">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformFeatures;

// components/common/Card.js
import React from 'react';

const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg p-6';
  const hoverClasses = hover ? 'cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
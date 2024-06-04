import React from 'react'

const Card = ({ className = "card", bgColor = "white", children }) => {
    return (
      <div className={className} style={{ backgroundColor: bgColor }}>
        {children}
      </div>
    );
  };

export default Card
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Button = ({ className = "btn-icon-square", content, onClick }) => {
    return (
      <button onClick={onClick} className={className}>
        {className.startsWith("btn-icon") ? (
          <FontAwesomeIcon icon={content} />
        ) : (
          content
        )}
      </button>
    );
  };

export default Button
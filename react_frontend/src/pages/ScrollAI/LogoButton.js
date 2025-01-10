// LogoButton.js

import React from 'react';
import './LogoButton.css';

const LogoButton = ({ onClick }) => {
  return (
    <button className="logo-button" onClick={onClick}>
      Scroll
    </button>
  );
};

export default LogoButton;

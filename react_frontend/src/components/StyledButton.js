// StyledButton.js
import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({buttonWidth, backgroundColor, disableColor, disabled, size }) => {
  // Function to determine shadow color based on backgroundColor
  const getShadowColor = (color) => {
    if (color) {
      // Extract RGB from hex color and create rgba string
      return `0 3px 5px 2px rgba(${color.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
        (m, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)},`
      )} 0.3)`; 
    } 
    return '0 3px 5px 2px rgba(33, 203, 243, .3)'; // Default shadow color
  };

  return {
    justifyContent: 'center',
    textAlign: 'center',
    width: buttonWidth || 300,
    background: disabled 
      ? disableColor 
        ? disableColor 
        : 'grey' 
      : backgroundColor 
        ? backgroundColor 
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: disabled 
      ? 'none' 
      : getShadowColor(backgroundColor), // Use calculated shadow color
    color: 'white', 
    height: size === 'small' ? 30 : 40, // Height based on size
    padding: size === 'small' ? '0 10px' : '0 20px', // Padding based on size
    fontSize: size === 'small' ? '0.75rem' : '0.875rem', // Font size based on size
    margin: '1rem auto', 
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  
    '&:hover': {
      background: disabled 
        ? disableColor 
          ? disableColor 
          : 'grey' 
        : backgroundColor 
          ? backgroundColor 
          : 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
      transform: disabled ? 'none' : 'scale(1.05)',
      boxShadow: disabled 
        ? 'none' 
        : getShadowColor(backgroundColor), // Use calculated shadow color on hover
    },
  };
});

const StyledButtonComponent = ({ children, buttonWidth, backgroundColor, disableColor, size, ...otherProps }) => {
  return (
    <StyledButton 
      buttonWidth={buttonWidth} 
      backgroundColor={backgroundColor} 
      disableColor={disableColor} 
      size={size} // Pass the size prop to the StyledButton
      {...otherProps}
    >
      {children}
    </StyledButton>
  );
};

export default StyledButtonComponent;

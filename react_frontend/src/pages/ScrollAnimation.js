import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
 
const ScrollAnimation = ({
  children,
  direction = 'up',
  duration = 0.6,
  delay = 0,
  distance = 50
}) => {
  const elementRef = useRef(null);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          elementRef.current.classList.add('animate');
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
 
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
 
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);
 
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      default:
        return 'none';
    }
  };
 
  return (
    <Box
      ref={elementRef}
      sx={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `all ${duration}s ease-out ${delay}s`,
        '&.animate': {
          opacity: 1,
          transform: 'translate(0, 0)'
        }
      }}
    >
      {children}
    </Box>
  );
};
 
export default ScrollAnimation;
import { useState, useEffect } from 'react';

// Custom hook for handling scroll behavior
function useScrollHandler(targetClass) {
  console.log(targetClass);
  const [loadContent, setLoadContent] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => {
      const targetElements = document.getElementsByClassName(targetClass);

      if (!contentLoaded && targetElements.length > 0) {
        Array.from(targetElements).forEach((element) => {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;

          if (!loadContent && rect.top + rect.height * 0.2 <= windowHeight) {
            setLoadContent(true);
          } else if ((loadContent && rect.bottom < 0) || rect.top > windowHeight) {
            // Reset contentLoaded when target element is completely out of view
            setContentLoaded(false);
          } else if (loadContent && rect.top + rect.height * 0.2 > windowHeight) {
            setLoadContent(false);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contentLoaded, loadContent, targetClass]);

  return { loadContent, contentLoaded };


  
}

export default useScrollHandler;

import React, { useState, useEffect } from 'react';
import LogoButton from './LogoButton';

function ScrollAI({ sectionIds }) {
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionIds.map(id => document.getElementById(id));
      const scrollPos = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        if (section && section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
          setCurrentSection(index + 1);
        }
      });

      if (window.scrollY === 0) {
        setCurrentSection(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const handleLogoClick = () => {
    const nextSectionId = currentSection === sectionIds.length ? sectionIds[0] : sectionIds[currentSection];
    const target = document.getElementById(nextSectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return <LogoButton onClick={handleLogoClick} />;
}

export default ScrollAI;

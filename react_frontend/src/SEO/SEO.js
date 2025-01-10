// src/components/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSEO } from './SEOContext';

const SEO = ({  location}) => {
  
  const seoData = useSEO()[location];  // Default to '/' if no SEO data for current path

  return (
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <link rel="canonical" href={seoData.canonical} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
    </Helmet>
  );
};

export default SEO;

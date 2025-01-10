// import React, { createContext, useContext, useState } from 'react';

// // Create the SEO context
// const SEOContext = createContext();

// // Create a provider component
// export const SEOProvider = ({ children }) => {
//   const [seoData, setSeoData] = useState({
//     title: 'Default Title',
//     description: 'Default description',
//     keywords: 'default, keywords',
//   });

//   return (
//     <SEOContext.Provider value={{ seoData, setSeoData }}>
//       {children}
//     </SEOContext.Provider>
//   );
// };

// // Custom hook to use SEO context
// export const useSEO = () => {
//   return useContext(SEOContext);
// };

import React, { createContext, useContext } from 'react';

const SEOContext = createContext();

export const useSEO = () => useContext(SEOContext);

export const SEOProvider = ({ children }) => {
 
  // Placeholder for SEO data, can be fetched from a server or managed here.
  const seoData = {
    '/': {
      title: 'Next Generation of Insurance Solution | Innovon AI',
      description: `Streamline insurance workflows with Innovontech's intelligent document processing solutions. Automate data extraction, improve accuracy, and enhance efficiency.`,
      canonical: 'https://innovon.ai/',
      keywords: ['Next Generation of Insurance Solution', 'Intelligent Document Processing for Insurance', 'Insurance Virtual AI Assistant', 'Virtual Assistants for Property and Casualty Insurance'],
    },
    '/smart-claim': {
      title: 'FNOL Portal for Claims with Innovon Tech | Innovontech',
      description: `Manage your claims efficiently with Innovon Tech's FNOL Portal. Experience quick reporting, faster resolutions, and improved service for all your claims needs.`,
      canonical: 'https://innovon.ai/smart-claim',
      keywords: ['FNOL Reporting With AI', 'FNOL Automation Software for Insurance', 'FNOL Automation', 'FNOL Reporting with Innovon Tech AI', 'FNOL Portal for Claims with Innovon Tech'],
    },
    '/doc-ai-loss-run-report': {
      title: 'Intelligent Loss Run Extraction Using AI | Innovon Tech',
    description:"Optimize loss run extraction with AI-powered solutions by Innovontech. Improve accuracy, efficiency, and decision-making in insurance data management.",
      canonical: 'https://innovon.ai/doc-ai-loss-run-report',
      keywords: ['Intelligent Loss Run Extraction Using AI', 'IDP Loss Run', 'IDP Loss Run Innovon Tech', 'Insurance IDP Loss Run with Innovon Tech', 'IDP Loss Run with Innovon Tech'],
    },
    '/doc-ai-med-bill': {
      title:"DocAI Medbill Extraction Innovon Tech Solution | Innovontech",
      description:"Revolutionize medical billing with AI IDP Medbill Extraction by Innovontech. Enhance accuracy, speed, and efficiency in healthcare data processing.",
     canonical: 'https://innovon.ai/doc-ai-med-bill',
      keywords: ['AI Powered Medical Bill', 'Medical Data Management With AI', 'AI IDP Medbill Extraction Innovon Tech Solution', 'IDP Medbill Innovon Tech'],
    },
    '/insur-admin-platform': {
      title:"Insurer Admin Solutions Innovon Tech | Innovontech",
      description:"Improve your insurance admin tasks with Innovon Tech's solutions. Boost efficiency and accuracy effortlessly. Explore our innovative technology today!",
     canonical: 'https://innovon.ai/insur-admin-platform',
      keywords: ['Insur Admin Platform Innovon Tech', 'Insurer Admin Solutions Innovon Tech', 'Integrated Carrier Admin Platform'],
    },
    '/insur-ai': {
      title:"P&C Insurance Solutions Innovon Tech | Innovontech",
        description:"Discover comprehensive P&C insurance solutions with Innovon Tech. Tailored coverage, innovative technology, and expert support for your peace of mind.",
       canonical: 'https://innovon.ai/insur-ai',
      keywords: ['P&C Insurance Solutions Innovon Tech'],
    },
    '/mail-2-quote': {
      title:"Submission Workflow With Ai | Email to Submission | Mail2Quote | Innovontech",
      description:"Simplify your submission process with AI. From email to submission, Innovontech boosts efficiency and accuracy in your workflow. Discover seamless automation now!",
     canonical: 'https://innovon.ai/mail-2-quote',
      keywords: ['Submission Workflow with Ai', 'Email to Submission Solution', 'Email to Submission'],
    },
    // Add more paths as needed
  };

  return (
    <SEOContext.Provider value={seoData}>
      {children}
    </SEOContext.Provider>
  );
};


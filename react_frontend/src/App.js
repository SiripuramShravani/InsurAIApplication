import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Claimcapture from './pages/SmartClaim Portal/ClaimPortal.js';
import Claimsuccess from './pages/success.js';
import CustomerInsuranceCompany from './pages/custometinsurancecompany.js';
import Companysuccess from './pages/companysuccess.js';
import Servicetypes from './pages/servicetypes.js';
import Company from './pages/company.js';
import Signin from "./pages/signin.js";
import Aboutus from './pages/About.js';
import Fnol from './pages/FNOL/Fnol.js';
import IDPFnol from './pages/IDP_FNOL/IDP_Fnol.js';
import InsurAI from './pages/InsurAI/InsurAI.js';
import InsurAIAgent from './pages/InsurAI/InsurAI_Agent.js';
import EmailToFnol from './pages/IDP_FNOL/Email_to_FNOL.js';
import InsuredSignup from './pages/InsuredSignup.js';
import LossRunReports from "./pages/LossRunReports.js";
import ScrollToTop from "./components/ScrollToTop.js";
import PolicyIntake from "./pages/FNOL/PolicyIntake/PolicyIntake.js"
import DemoPage from "./pages/RequestDemo.js";
import DashboardApp from "../src/pages/CompanyDashboardLayout/DashboardApp.js";
import { MaterialUIControllerProvider } from './CompanyDashboardChartsCardsLayouts/context';
import TermsOfUse from "./pages/TermsOfUse.js";
import InsurAIDemo from "./pages/DemoPages/InsurAIDemo.js";
import EmailTOFnolDemo from "./pages/DemoPages/EmailToFnolDemo.js";
import LossRunReportsDemo from "./pages/DemoPages/LossRunReportsDemo.js";
import IdpDemo from "./pages/DemoPages/IdpDemo.js";
import IdpPolicyIntake from "./pages/IDP_FNOL/IDP_Policy_Intake.js";
import IdpPolicyIntakeDemo from "./pages/DemoPages/IDP_Policy_Intake_DEMO.js";
import AddUser from "./pages/NewRegister/AddUser.js";
import UserDashboard from "./pages/NewRegister/Dashboard.js";
import EmailToPolicyIntake from "./pages/IDP_FNOL/Email_to_PolicyIntake.js";
import EmailToPolicyIntakeDemo from "./pages/DemoPages/EmailTo_PolicyIntakeDemo.js";
import IDCardExtraction from "./pages/IDP_FNOL/ID_Card_Extraction.js";
import IDCardExtractionDemo from './pages/DemoPages/IDP_ID_Card_Demo.js';
import MedBill from "./pages/IDP_FNOL/MedBill.js";
import MedBillDemo from "./pages/DemoPages/MedBillDemo.js";
import SubmissionPortal from "./pages/FNOL/PolicyIntake/SubmissionPortal.js";
import InnovonAdminDashboard from "./pages/Innovon_Company_Admin/InnovonAdminDashboard.js";
import InsurerPlatform from "./pages/Innovon_Company_Admin/InsurerPlatform.js";
import SuccessPage from "./components/SucessMessage.js";
import routeTitles from "./pages/RoutesTitle.js";
import InstaClaim from "./pages/MobileApps/InstaClaim.js";
import InstaQuote from "./pages/MobileApps/InstaQuote.js";
import DocAIClassify from "./pages/IDP_FNOL/DocAIClassify.js";
import DocAIClassifyDemo from "./pages/DemoPages/DocAIClassify.js";
import DocAISOV from "./pages/IDP_FNOL/DocAISOV.js";
import DocAISOVDemo from "./pages/DemoPages/DocAISOV.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import NotFound from "./components/NotFound.js";
import Loading from './components/ErrorPages/loading.js';
import useNetworkStatus from "./components/ErrorPages/UseNetworkStatus.js";
import NetworkError from "./components/ErrorPages/NetworkError.js";
import NotFoundPage from "./components/ErrorPages/PageNotFound.js";
import DatabaseError from "./components/ErrorPages/DatabaseError.js";
import QuoteSuccess from "../src/pages/QuoteSuccess.js";
import { SEOProvider } from "./SEO/SEOContext.js";
import FileUploads from "./components/Upload.js";
import DocAISummaryPage from './pages/IDP_FNOL/DocAISummary.js';
import DocAISummaryDemo from './pages/DemoPages/DocAISummaryDemo.js';

const theme = createTheme();
const TitleUpdater = () => {
  const location = useLocation();
  React.useEffect(() => {
    const path = location.pathname;
    const title = Object.keys(routeTitles).find(route => path.startsWith(route));
    document.title = routeTitles[title] || 'Innovon Tech';
  }, [location]);
  return null;
};

function App() {

  const { isOnline, appState } = useNetworkStatus({
    currentRoute: '/',
    formData: {},
  });

 
  return (
    <SEOProvider>
      <ThemeProvider theme={theme}>
        <MaterialUIControllerProvider>
          <BrowserRouter>
            <ScrollToTop />
            <TitleUpdater />
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <ToastContainer position="top-center" />
              {isOnline ? (
                <Routes>
                  <Route index element={<Servicetypes />} />
                  <Route exact path="/signin" element={<Signin />} />
                  <Route exact path="/smart-claim" element={<Fnol />} />
                  <Route exact path="/SmartQuote" element={<SubmissionPortal />} />
                  <Route exact path="/docai/claim" element={<IDPFnol />} />
                  <Route exact path="/DocAIQuote" element={<IdpPolicyIntake />} />
                  <Route exact path="/docai/idcardextraction" element={<IDCardExtraction />} />
                  <Route exact path="/doc-ai-loss-run-report" element={<LossRunReports />} />
                  <Route exact path="/doc-ai-med-bill" element={<MedBill />} />
                  <Route exact path="/Mail2Claim" element={<EmailToFnol />} />
                  <Route exact path="/mail-2-quote" element={<EmailToPolicyIntake />} />
                  <Route exact path="/App/instaClaim" element={<InstaClaim />} />
                  <Route exact path="/App/instaQuote" element={<InstaQuote />} />
                  <Route exact path="/insur-ai" element={<InsurAI />} />
                  <Route exact path="/insur-admin-platform" element={<InsurerPlatform />} />
                  <Route exact path="/requestdemo" element={<DemoPage />} />
                  <Route exact path="/docaiClassify" element={<DocAIClassify />} />
                  <Route exact path="/docaiSov" element={<DocAISOV />} />
                  <Route path="*" element={<NotFound />} />
                  <Route exact path="loading" element={<Loading />} />
                  <Route exact path="/aboutus" element={<Aboutus />} />
                  <Route exact path="/TermsofUse" element={<TermsOfUse />} />
                  <Route exact path="/upload" element={<FileUploads />} />
                  <Route exact path="/summary" element={<DocAISummaryPage />} />
                  <Route exact path="/summaryDemo" element={<ProtectedRoute><DocAISummaryDemo /></ProtectedRoute>} />
                  <Route path="/claimcapture" element={<ProtectedRoute><Claimcapture /></ProtectedRoute>} />
                  <Route path="/claimsuccess" element={<ProtectedRoute><Claimsuccess /></ProtectedRoute>} />
                  <Route path="/quotesuccess" element={<ProtectedRoute><QuoteSuccess /></ProtectedRoute>} />
                  <Route exact path="/companysuccess" element={<ProtectedRoute><Companysuccess /></ProtectedRoute>} />
                  <Route exact path="/insur-ai/Agent" element={<ProtectedRoute><InsurAIAgent /></ProtectedRoute>} />
                  <Route exact path="/insuredsignup" element={<ProtectedRoute><InsuredSignup /></ProtectedRoute>} />
                  <Route exact path="/Demo/SmartQuote" element={<ProtectedRoute><PolicyIntake /></ProtectedRoute>} />
                  <Route exact path="/demo/insur-ai" element={<ProtectedRoute><InsurAIDemo /></ProtectedRoute>} />
                  <Route exact path="/Demo/Mail2Claim" element={<ProtectedRoute><EmailTOFnolDemo /></ProtectedRoute>} />
                  <Route exact path="/Demo/doc-ai-loss-run-report" element={<ProtectedRoute><LossRunReportsDemo /></ProtectedRoute>} />
                  <Route exact path="/demo/DocAI" element={<ProtectedRoute><IdpDemo /></ProtectedRoute>} />
                  <Route exact path="/Demo/doc-ai-med-bill" element={<ProtectedRoute><MedBillDemo /></ProtectedRoute>} />
                  <Route exact path="/addUser" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                  <Route exact path="/Demo/mail-2-quote" element={<ProtectedRoute><EmailToPolicyIntakeDemo /></ProtectedRoute>} />
                  <Route exact path="/UserDashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route exact path="/demo/idcardextraction" element={<ProtectedRoute><IDCardExtractionDemo /></ProtectedRoute>} />
                  <Route exact path="/Demo/DocAIQuote" element={<ProtectedRoute><IdpPolicyIntakeDemo /></ProtectedRoute>} />
                  <Route exact path="/SucessMessage" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
                  <Route exact path="/App/instaClaim" element={<ProtectedRoute><InstaClaim /></ProtectedRoute>} />
                  <Route path="/dashboard/*" element={<ProtectedRoute><DashboardApp /></ProtectedRoute>} />
                  <Route exact path="/customercompany" element={<ProtectedRoute><Company><CustomerInsuranceCompany /></Company></ProtectedRoute>} />
                  <Route path="/innovonadmindashboard" element={<ProtectedRoute><InnovonAdminDashboard /></ProtectedRoute>} />
                  <Route exact path="/demo/docaiClassify" element={<ProtectedRoute><DocAIClassifyDemo /></ProtectedRoute>} />
                  <Route exact path="demo/docaiSov" element={<ProtectedRoute><DocAISOVDemo /></ProtectedRoute>} />
                  <Route path="/notFound" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
                  <Route path="/databaseerror" element={<ProtectedRoute><DatabaseError /></ProtectedRoute>} />
                </Routes>) : (
                <NetworkError
                  isOnline={isOnline}
                  appState={appState}
                  lastRoute={appState.currentRoute}
                />)}
            </div>
          </BrowserRouter>
        </MaterialUIControllerProvider>
      </ThemeProvider>
    </SEOProvider>
  );
}

export default App;
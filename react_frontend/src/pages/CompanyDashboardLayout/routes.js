import Dashboard from "../CompanyDashboardLayout/dashboard";
import Tables from "../CompanyDashboardLayout/tables";
import AgentTables from "../CompanyDashboardLayout/tables copy"; 
import CompanyProfile from "../CompanyDashboardLayout/CompanyProfile/CompanyProfile";
import PoliciesDashboard from "../CompanyDashboardLayout/Policies Dashboard/PoliciesDashboard";
import ClaimsDashboard from "../CompanyDashboardLayout/ClaimsDashboard/ClaimsDashboard"; 

// @mui icons
import Icon from "@mui/material/Icon";

 
// const routes = [
//   {
//     type: "collapse",
//     name: "Dashboard",
//     key: "dashboard",
//     icon: <Icon fontSize="small">dashboard</Icon>,
//     route: "/dashboard",
//     component: <Dashboard />,
//   },       
//   {
//     type: "collapse",
//     name: "Policies",
//     key: "policies",
//     icon: <Icon fontSize="small">description</Icon>,
//     route: "/policies",
//     component: <PoliciesDashboard />,
//   },
//   {
//     type: "collapse",
//     name: "Claims",
//     key: "claims",
//     icon: <Icon fontSize="small">policy</Icon>,
//     route: "/claims",
//     component: <ClaimsDashboard />,
//   },
//   {
//     type: "collapse",
//     name: "Agents",
//     key: "agents",
//     icon: <Icon fontSize="small">groups</Icon>, // Represents a group of agents
//     route: "/agents",
//     component: <AgentTables />,
//   },
//   {
//     type: "collapse",
//     name: "Reports",
//     key: "reports",
//     icon: <Icon fontSize="small">analytics</Icon>, // Clearer for data reports
//     route: "/reports",
//     component: <Tables />,
//   },
//   {
//     type: "collapse",
//     name: "Profile",
//     key: "profile",
//     icon: <Icon fontSize="small">person</Icon>,
//     route: "/profile",
//     component: <CompanyProfile />,
//   },
// ];

const routes = () => {
  const userAccessString = localStorage.getItem('userAccess');
  const userAccess = userAccessString ? JSON.parse(userAccessString) : [];

  const showProfile = userAccess.includes("company_Dashboard") || userAccess.includes("companies_administration");
  const isClaimManager = userAccess.includes("claim_manager");
  const isAdjuster = userAccess.includes("adjuster");
  const isUnderwriter = userAccess.includes("underwriter");
  const isReportAnalyst = userAccess.includes("reports_analyst"); // Use camelCase for consistency
  const isAgentAdmin = userAccess.includes("agent_admin"); 

  const allRoutes = []; // Start with an empty array

  if (isReportAnalyst) {
    // Add Dashboard and Reports for report analysts
    allRoutes.push(
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/dashboard",
        component: <Dashboard />,
      },
      {
        type: "collapse",
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">analytics</Icon>,
        route: "/reports",
        component: <Tables />,
      }
    );
  } else if (isAgentAdmin) {
    // Agent Admin routes
    allRoutes.push(
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/dashboard",
        component: <Dashboard />,
      },
      {
        type: "collapse",
        name: "Agents",
        key: "agents",
        icon: <Icon fontSize="small">groups</Icon>,
        route: "/agents",
        component: <AgentTables />,
      },
      {
        type: "collapse",
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">analytics</Icon>,
        route: "/reports",
        component: <Tables />,
      }
    );
  }  
  else {
    // Add all other routes for non-report analysts
    allRoutes.push(
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/dashboard",
        component: <Dashboard />,
      },
      {
        type: "collapse",
        name: "Policies",
        key: "policies",
        icon: <Icon fontSize="small">description</Icon>,
        route: "/policies",
        component: <PoliciesDashboard />,
      },
      {
        type: "collapse",
        name: "Claims",
        key: "claims",
        icon: <Icon fontSize="small">policy</Icon>,
        route: "/claims",
        component: <ClaimsDashboard />,
      },
      {
        type: "collapse",
        name: "Reports",
        key: "reports",
        icon: <Icon fontSize="small">analytics</Icon>,
        route: "/reports",
        component: <Tables />,
      }
    );

    if (!isClaimManager && !isAdjuster && !isUnderwriter) {
      allRoutes.push({
        type: "collapse",
        name: "Agents",
        key: "agents",
        icon: <Icon fontSize="small">groups</Icon>,
        route: "/agents",
        component: <AgentTables />,
      });
    }

    if (showProfile) {
      allRoutes.push({
        type: "collapse",
        name: "Profile",
        key: "profile",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/profile",
        component: <CompanyProfile />,
      });
    }
  } 

  return allRoutes;
};


export default routes;

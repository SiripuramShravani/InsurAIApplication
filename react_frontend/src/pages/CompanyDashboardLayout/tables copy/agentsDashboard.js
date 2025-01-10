import Grid from "@mui/material/Grid";
import React, { useState, useRef } from "react";
import { Card } from "@mui/material"; 
import CloseIcon from '@mui/icons-material/Close';

// Vision UI Dashboard React components
import VuiBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox";
import VuiTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiTypography";

// Material Dashboard 2 React components
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";


import ComplexStatisticsCard from "../../../CompanyDashboardChartsCardsLayouts/Cards/StatisticsCards/ComplexStatisticsCard";
import DefaultDoughnutChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/DoughnutCharts/DefaultDoughnutChart";
import LineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/LineChart";
import { lineChartOptionsDashboardAgent } from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/lineChartOptionsforAgent";

import DownloadIcon from "@mui/icons-material/Download";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";

import DataTable from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable";


// Data
import AgentProfile from "../AgentProfile/UserProfile";
import PersonIcon from "@mui/icons-material/Person";
// ... other imports in PerformanceChartContainer.js
import { Description as DescriptionIcon, TableChart as TableChartIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { addPageNumbers, addDateToPDF } from "../../../CompanyDashboardChartsCardsLayouts/TablePDFfunctions";



const AgentName = ({ name, email }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <CustomAvatar name={name} size="sm" />
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        <span>{name}</span>
      </MDTypography>
      <MDTypography variant="caption">
        <span style={{ color: "gray" }}>{email}</span>
      </MDTypography>
    </MDBox>
  </MDBox>
);

const CustomAvatar = ({ name, size }) => {
  const avatarSize = size === "sm" ? 40 : 56;
  const iconSize = size === "sm" ? "medium" : "large";

  return (
    <MDBox
      bgcolor="grey.300"
      width={avatarSize}
      height={avatarSize}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
    >
      <PersonIcon fontSize={iconSize} color="action" />
    </MDBox>
  );
};


const ClaimNumber = ({ number }) => (
  <MDTypography display="block" variant="button" fontWeight="medium">
    {number}
  </MDTypography>
);

const PerformanceChartContainer = ({
  performanceData,
  selectedAgentID,
  openPerformanceViewPage,
  setOpenPerformanceViewPage // Pass the function to update the state
}) => {
  const [policiesDownloadAnchorEl, setPoliciesDownloadAnchorEl] = useState(null);
  const [claimsDownloadAnchorEl, setClaimsDownloadAnchorEl] = useState(null);
  const policiesTableRef = useRef(null); // Ref for the policies table
  const claimsTableRef = useRef(null);  // Ref for the claims table
  const pdfPoliciesTableRef = useRef(null);
  const pdfClaimsTableRef = useRef(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // State for active tab


  if (!performanceData) {
    return <div>Select an agent to view performance.</div>;
  }

  const {
    totalPolicies,
    totalClaims,
    activePolicies,
    policiesByHO,
    claimsByChannel,
    claimsByHO,
    agentDetails,
    percentageIncreases,
  } = performanceData;

  // Prepare data for charts
  const channelDataForAgent = {
    labels: Object.keys(claimsByChannel),
    datasets: {
      label: "Claims",
      data: Object.values(claimsByChannel),
      backgroundColor: ["#003870", "#1578CF", "#249CFF", "#77C2FE"],
    },
    cutout: 105,
  };

  const dashboardSummary = {
    policies_claims_per_HO_by_agent: [
      {
        name: "Policies",
        data: Object.values(policiesByHO),
      },
      {
        name: "Claims",
        data: Object.values(claimsByHO),
      },
    ],
  };

  const agentPoliciesData = {
    columns: [
      { Header: "Policy Holder", accessor: "policyHolder", width: "17%", align: "left" },
      { Header: "Policy Number", accessor: "policyNumber", width: "12.5%", align: "left" },
      { Header: "Policy Type", accessor: "policyType", width: "11%", align: "left" },
      { Header: "Effective Date", accessor: "effectiveDate", width: "12.5%", align: "center" },
      { Header: "Expiration Date", accessor: "expirationDate", width: "13%", align: "center" },
      { Header: "Mobile", accessor: "mobile", width: "13%", align: "left" },
    ],
    rows: Object.entries(performanceData?.agentPolicies ?? {}).map(
      ([policyNumber, policyData]) => ({
        policyHolder: <AgentName name={policyData.policy_holder_name} />,
        policyNumber: <ClaimNumber number={policyNumber} />,
        policyType: policyData.policy_type,
        effectiveDate: policyData.eff_date,
        expirationDate: policyData.exp_date,
        mobile: policyData.mobile,
      })),
  };

  const agentClaimsData = {
    columns: [
      { Header: "Policy Holder", accessor: "policyholder", width: "20%", align: "left" },
      { Header: "Claim Number", accessor: "claimNumber", align: "left" },
      { Header: "Policy Number", accessor: "policyNumber", align: "left" },
      { Header: "Policy Type", accessor: "policyType", align: "left" },
      { Header: "Date Filed", accessor: "dateFiled", align: "left" },
    ],
    rows: Object.entries(performanceData?.agentClaims ?? {}).map(
      ([claimNumber, claimData]) => ({
        policyholder: <AgentName name={claimData.policy_holder_name} />,
        claimNumber: <ClaimNumber number={claimNumber} />,
        policyNumber: <ClaimNumber number={claimData.policy_number} />,
        policyType: claimData.policy_type,
        dateFiled: claimData.claim_date,
      })),
  };



  const handleDownload = (format, data, filename, originalData) => { // Add originalData parameter
    if (format === 'csv') {
      const simplifiedData = data.map((row, index) => {
        // Access original data using the index
        const dataItem = originalData[index][1]; // Get the policyData from originalData
        if (filename === 'agent_policies') { // Policies data
          return {
            'Policy Holder Name': dataItem.policy_holder_name,
            'Policy Number': row.policyNumber.props.number,
            'Policy Type': row.policyType,
            'Effective Date': row.effectiveDate,
            'Expiration Date': row.expirationDate,
            'Mobile': row.mobile
          };
        } else { // Claims data (filename === 'agent_claims')
          return {
            'Policy Holder Name': dataItem.policy_holder_name,
            'Claim Number': row.claimNumber.props.number,
            'Policy Number': row.policyNumber.props.number,
            'Policy Type': row.policyType,
            'Date Filed': row.dateFiled
          };
        }
      });

      // CSV Download Logic
      const csvContent = `data:text/csv;charset=utf-8,${[
        Object.keys(simplifiedData[0]), // Get header row from simplifiedData
        ...simplifiedData.map(row => Object.values(row))
      ].map(e => e.join(",")).join("\n")}`;

      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else if (format === 'excel') {
      const simplifiedData = data.map((row, index) => {
        // Access original data using the index
        const dataItem = originalData[index][1]; // Get the policyData from originalData

        if (filename === 'agent_policies') { // Policies data
          return {
            'Policy Holder Name': dataItem.policy_holder_name,
            'Policy Number': row.policyNumber.props.number,
            'Policy Type': row.policyType,
            'Effective Date': row.effectiveDate,
            'Expiration Date': row.expirationDate,
            'Mobile': row.mobile
          };
        } else { // Claims data (filename === 'agent_claims')
          return {
            'Policy Holder Name': dataItem.policy_holder_name,
            'Claim Number': row.claimNumber.props.number,
            'Policy Number': row.policyNumber.props.number,
            'Policy Type': row.policyType,
            'Date Filed': row.dateFiled
          };
        }
      });
      const ws = XLSX.utils.json_to_sheet(simplifiedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, filename);
      XLSX.writeFile(wb, `${filename}.xlsx`);

    } else if (format === 'pdf') {
      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const doc = new jsPDF('landscape');

      // Main Heading (Center Aligned)
      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename} Report`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename} Report`, textOffset, 22);

      // Add the current date to the PDF (Right Aligned, below the heading)
      addDateToPDF(doc, 28); // Adjust vertical position as needed 

      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of agent ${displayFilename}.`, 14, 40);

      // Data (Right Aligned) 
      doc.text(
        `Agent ID: ${selectedAgentID}`,
        doc.internal.pageSize.getWidth() - 40,
        40, // Adjust vertical position as needed
        { align: 'right' }
      );

      // Table (Default Alignment - you can customize further)
      doc.autoTable({
        html: filename === "agent_policies" ? pdfPoliciesTableRef.current : pdfClaimsTableRef.current,
        startY: 50, // Adjust starting position to accommodate text and date
        styles: { halign: 'right' }, // Right align data cells
        headStyles: { halign: 'center', fontStyle: 'bold' } // Center align headers and make them bold
      });

      addPageNumbers(doc);
      doc.save(`${filename}.pdf`);
    }
  };

  const handlePoliciesDownloadClick = (event) => {
    setPoliciesDownloadAnchorEl(event.currentTarget);
  };

  const handleClaimsDownloadClick = (event) => {
    setClaimsDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setPoliciesDownloadAnchorEl(null);
    setClaimsDownloadAnchorEl(null);
  };

  const handleFormatSelect = (format, type) => {
    if (type === 'policies') {
      handleDownload(format, agentPoliciesData.rows, 'agent_policies', Object.entries(performanceData?.agentPolicies ?? {}));
    } else if (type === 'claims') {
      handleDownload(format, agentClaimsData.rows, 'agent_claims', Object.entries(performanceData?.agentClaims ?? {}));
      handleDownloadClose();
    };
  }


  if (!performanceData) {
    return <div>Select an agent to view performance.</div>;
  }

  return (
    <MDBox py={3}>     
      <MDBox mb={4}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={2}>
              {["dashboard", "policies", "claims", "profile"].map((tab) => (
                <Grid item key={tab}>
                  <MDTypography
                    variant="h6" // Increased text size
                    color={activeTab === tab ? "info" : "text"}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: activeTab === tab ? "bold" : "normal",
                      borderBottom: activeTab === tab ? "3px solid #0B70FF" : "none", // Added border for active tab
                      padding: "8px 16px", // Added padding for spacing
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} {/* Capitalize first letter */}
                  </MDTypography>
                </Grid>
              ))}
            </Grid>
            </Grid>
            <Grid item> {/* Close button container */}
              <IconButton
                onClick={() => setOpenPerformanceViewPage(false)}
                sx={{ cursor: "pointer", color: "#0B70FF", fontSize:"1.2rem" }}
              >
               <CloseIcon /> Close 
              </IconButton>
            </Grid>
          </Grid>
      </MDBox>

      {/* Content based on active tab */}
      <MDBox mt={10}>
        {activeTab === "dashboard" && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="description" // Updated icon for Total Policies
                    title="Total Policies"
                    count={totalPolicies}
                    percentage={{
                      color: percentageIncreases.policies_increase >= 0 ? "success" : "error",
                      amount: `${Math.trunc(percentageIncreases.policies_increase)}%`,
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="policy" // Updated icon for Total Claims
                    title="Total Claims"
                    count={totalClaims}
                    percentage={{
                      color: percentageIncreases.claims_increase >= 0 ? "success" : "error",
                      amount: `${Math.trunc(percentageIncreases.claims_increase)}%`,
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="policy" // Updated icon for Active Policies
                    title="Active Policies"
                    count={activePolicies}
                    percentage={{
                      color: percentageIncreases.active_policies_increase >= 0 ? "success" : "error",
                      amount: `${Math.trunc(percentageIncreases.active_policies_increase)}%`,
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4.5} lg={4.5}>
                  <MDBox mb={3}>
                    <DefaultDoughnutChart
                      icon={{ color: "info", component: "pie_chart" }}
                      title="Claims by Channel allocated to Agent"
                      height="20rem"
                      chart={channelDataForAgent}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={7.5} lg={7.5}>
                  <MDBox mb={3}>
                    <Card style={{ padding: "20px" }}>
                      <VuiBox sx={{ height: "100%" }}>
                        <VuiTypography variant="lg" color="#010066" fontWeight="bold" mt="55px">
                          Total Policies & Claims handling by Agent per HO Category
                        </VuiTypography>
                        <VuiBox sx={{ height: "340px" }}>
                          <LineChart
                            lineChartData={dashboardSummary.policies_claims_per_HO_by_agent}
                            lineChartOptions={lineChartOptionsDashboardAgent}
                          />
                        </VuiBox>
                      </VuiBox>
                    </Card>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </>
        )}

        {activeTab === "profile" && (
          <Grid item xs={12}>
            <AgentProfile
              selectedAgentID={selectedAgentID}
              agentDetails={agentDetails}
            />
          </Grid>
        )}

        {activeTab === "policies" && (
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Card>
                <MDBox
                  sx={{
                    height: {
                      xs: "60px",
                      sm: "60px",
                      md: "60px",
                      lg: "60px",
                    },
                  }}
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" color="white">
                    Agent Policies Table ({selectedAgentID})
                  </MDTypography>
                  <MDBox>
                    <IconButton onClick={handlePoliciesDownloadClick} sx={{ cursor: "pointer", color: "#ffffff" }}>
                      <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                    <Menu
                      anchorEl={policiesDownloadAnchorEl}
                      open={Boolean(policiesDownloadAnchorEl)}
                      onClose={handleDownloadClose}
                    >
                      <MenuItem onClick={() => handleFormatSelect('csv', 'policies')}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as CSV" />
                      </MenuItem>
                      <MenuItem onClick={() => handleFormatSelect('excel', 'policies')}>
                        <ListItemIcon>
                          <TableChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as Excel" />
                      </MenuItem>
                      <MenuItem onClick={() => handleFormatSelect('pdf', 'policies')}>
                        <ListItemIcon>
                          <PictureAsPdfIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as PDF" />
                      </MenuItem>
                    </Menu>
                  </MDBox>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: agentPoliciesData.columns, rows: agentPoliciesData.rows }}
                    canSearch
                    isSorted={true}
                    entriesPerPage={true}
                    pagination={{ variant: "contained", color: "primary" }}
                    showTotalEntries={true}
                    noEndBorder
                    tableRef={policiesTableRef}
                  />
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        )}

        {activeTab === "claims" && (
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Card>
                <MDBox
                  sx={{
                    height: {
                      xs: "60px",
                      sm: "60px",
                      md: "60px",
                      lg: "60px",
                    },
                  }}
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" color="white">
                    Agent Claims Table ({selectedAgentID})
                  </MDTypography>
                  <MDBox>
                    <IconButton onClick={handleClaimsDownloadClick} sx={{ cursor: "pointer", color: "#ffffff" }}>
                      <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                    <Menu
                      anchorEl={claimsDownloadAnchorEl}
                      open={Boolean(claimsDownloadAnchorEl)}
                      onClose={handleDownloadClose}
                    >
                      <MenuItem onClick={() => handleFormatSelect('csv', 'claims')}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as CSV" />
                      </MenuItem>
                      <MenuItem onClick={() => handleFormatSelect('excel', 'claims')}>
                        <ListItemIcon>
                          <TableChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as Excel" />
                      </MenuItem>
                      <MenuItem onClick={() => handleFormatSelect('pdf', 'claims')}>
                        <ListItemIcon>
                          <PictureAsPdfIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as PDF" />
                      </MenuItem>
                    </Menu>
                  </MDBox>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: agentClaimsData.columns, rows: agentClaimsData.rows }}
                    canSearch
                    isSorted={true}
                    entriesPerPage={true}
                    pagination={{ variant: "contained", color: "primary" }}
                    showTotalEntries={true}
                    noEndBorder
                    tableRef={claimsTableRef}
                  />
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        )}
      </MDBox>


      {/* Hidden Tables for PDF Generation */}
      <div style={{ display: 'none' }}>
        {/* PDF Table for Policies */}
        <table ref={pdfPoliciesTableRef}>
          <thead>
            <tr>
              <th>Policy Holder Name</th>
              <th>Policy Number</th>
              <th>Policy Type</th>
              <th>Effective Date</th>
              <th>Expiration Date</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {agentPoliciesData.rows.map((row, index) => {
              const policyData = Object.entries(performanceData?.agentPolicies ?? {})[index][1];
              return (
                <tr key={index}>
                  <td>{policyData.policy_holder_name}</td>
                  <td>{row.policyNumber.props.number}</td>
                  <td>{row.policyType}</td>
                  <td>{row.effectiveDate}</td>
                  <td>{row.expirationDate}</td>
                  <td>{row.mobile}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* PDF Table for Claims */}
        <table ref={pdfClaimsTableRef}>
          <thead>
            <tr>
              <th>Policy Holder Name</th>
              <th>Claim Number</th>
              <th>Policy Number</th>
              <th>Policy Type</th>
              <th>Date Filed</th>
            </tr>
          </thead>
          <tbody>
            {agentClaimsData.rows.map((row, index) => {
              const claimData = Object.entries(performanceData?.agentClaims ?? {})[index][1];
              return (
                <tr key={index}>
                  <td>{claimData.policy_holder_name}</td>
                  <td>{row.claimNumber.props.number}</td>
                  <td>{row.policyNumber.props.number}</td>
                  <td>{row.policyType}</td>
                  <td>{row.dateFiled}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MDBox>
  );
};
export default PerformanceChartContainer;

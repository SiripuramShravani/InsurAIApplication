import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import DownloadIcon from "@mui/icons-material/Download";          
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";

import DashboardLayout from "../../../CompanyDashboardChartsCardsLayouts/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../CompanyDashboardChartsCardsLayouts/Navbars/DashboardNavbar";
import DataTable from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { Description as DescriptionIcon, TableChart as TableChartIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { addPageNumbers, addDateToPDF } from "../../../CompanyDashboardChartsCardsLayouts/TablePDFfunctions"; // Adjust the path if necessary


// Custom Components for Styling
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

const AgentID = ({ number }) => {
  return (
    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      {number}
    </MDTypography>
  );
}

function Tables() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [tableData, setTableData] = useState({
    agent: { columns: [], rows: [] },
    policy: { columns: [], rows: [] },
    claim: { columns: [], rows: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentDownloadAnchorEl, setAgentDownloadAnchorEl] = useState(null);
  const [policyDownloadAnchorEl, setPolicyDownloadAnchorEl] = useState(null);
  const [claimDownloadAnchorEl, setClaimDownloadAnchorEl] = useState(null);

  const openAgentDownloadMenu = Boolean(agentDownloadAnchorEl);
  const openPolicyDownloadMenu = Boolean(policyDownloadAnchorEl);
  const openClaimDownloadMenu = Boolean(claimDownloadAnchorEl);

  // Refs for Hidden Tables
  const agentTableRef = useRef(null);
  const policiesTableRef = useRef(null);
  const claimsTableRef = useRef(null);
  const company = JSON.parse(localStorage.getItem("carrier_admin_company"));
  const ic_id = localStorage.getItem("ic_id_for_dashboard")
  const ic_name = localStorage.getItem("ic_name_for_dashboard")
  const userAccessString = localStorage.getItem('userAccess');
  const userAccess = userAccessString ? JSON.parse(userAccessString) : [];
  const isClaimManager = userAccess.includes("claim_manager");
  const isAdjuster = userAccess.includes("adjuster");
  const isUnderwriter = userAccess.includes("underwriter");
  const isAgentAdmin = userAccess.includes("agent_admin"); 
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append("ic_id", ic_id || company.ic_id);
        const response = await axiosInstance.post('get_all_reports/', formData);
        const transformedData = transformAPIData(response.data);
        setTableData(transformedData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch table data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const transformAPIData = (apiData) => {
    const transformed = {
      agent: { columns: [], rows: [] },
      policy: { columns: [], rows: [] },
      claim: { columns: [], rows: [] },
    };

    // 1. Transform Agent Data
    transformed.agent.columns = [
      { Header: "Agent", accessor: "agent", width: "25%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Agent ID", accessor: "agentID", align: "left" },
      { Header: "Policies Sold", accessor: "policiesSold", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "left" },
      { Header: "State", accessor: "state", align: "left" },
    ];

    transformed.agent.rows = Object.entries(apiData.Agents_data).map(([agentID, agentData]) => ({
      agent: <AgentName name={agentData.Agent_name} />, // Use AgentName component
      email: agentData.Agent_email,
      agentID: <AgentID number={String(agentID)} />, // Convert agentID to string
      plainAgentID: String(agentID), // Convert plainAgentID to string 
      policiesSold: <AgentID number={String(agentData.No_of_policies)} />, // Convert to string
      mobile: agentData.Agent_number,
      state: agentData.Agent_state,
      agentName: agentData.Agent_name
    }));

    // 2. Transform Policy Data
    transformed.policy.columns = [
      { Header: "Policy Holder", accessor: "policyHolder", width: "17%", align: "left" },
      { Header: "Policy Number", accessor: "policynumber", width: "12.5%", align: "left" },
      { Header: "Policy Type", accessor: "policyType", width: "11%", align: "left" },
      { Header: "Effective Date", accessor: "effectiveDate", width: "12.5%", align: "left" },
      { Header: "Expiration Date", accessor: "expirationDate", width: "13%", align: "left" },
      { Header: "Mobile", accessor: "mobile", align: "left" },
      { Header: "Agent ID", accessor: "agentID", align: "left" },
    ];

    transformed.policy.rows = Object.entries(apiData.Policies_data).map(([policyNumber, policyData]) => ({
      policyHolder: (
        <AgentName
          name={policyData.policy_holder_name}
          email={policyData.email}
        />
      ),
      policyHolderName: policyData.policy_holder_name,
      policyHolderEmail: policyData.email,
      policynumber: <ClaimNumber number={policyNumber} />,
      plainPolicyNumber:policyNumber,
      policyType: policyData.policy_type,
      effectiveDate: policyData.policy_effective_date,
      expirationDate: policyData.policy_expiry_date,
      mobile: policyData.policy_holder_mobile_number,
      agentID: policyData.Agent_id,
    }));

    // 3. Transform Claim Data
    transformed.claim.columns = [
      { Header: "Policy Holder", accessor: "policyholder", width: "20%", align: "left" },
      { Header: "Claim Number", accessor: "claimNumber", align: "left" },
      { Header: "Policy Number", accessor: "policyNumber", width: "13%", align: "left" },
      { Header: "Policy Type", accessor: "policyType", width: "12%", align: "left" },
      { Header: "Date Filed", accessor: "dateFiled", align: "left" },
      { Header: "Agent ID", accessor: "agentID", align: "left" },
      { Header: "Agent Name", accessor: "agentName", align: "left" },
    ];

    transformed.claim.rows = Object.entries(apiData.claims_data).map(([claimNumber, claimData]) => ({
      policyholder: <AgentName name={claimData.Name} email={claimData.email} />, // Use AgentName component
      policyHolderName: claimData.Name,
      policyHolderEmail: claimData.email,
      claimNumber: <ClaimNumber number={claimNumber} />,
      plainClaimNumber: claimNumber,
      policyNumber: <ClaimNumber number={claimData.policy_number} />,
      plainPolicyNumber:claimData.policy_number,
      policyType: claimData.Type,
      dateFiled: claimData.claim_created_at,
      agentID: claimData.agent_id,
      agentName: claimData.agent_name,
    }));
    return transformed;
  };
   // Download Handlers
  const handleAgentDownloadClick = (event) => {
    setAgentDownloadAnchorEl(event.currentTarget);
  };

  const handlePolicyDownloadClick = (event) => {
    setPolicyDownloadAnchorEl(event.currentTarget);
  };

  const handleClaimDownloadClick = (event) => {
    setClaimDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setAgentDownloadAnchorEl(null);
    setPolicyDownloadAnchorEl(null);
    setClaimDownloadAnchorEl(null);
  };

  const handleDownloadOption = (format, tableName) => {
    handleDownloadClose();
    handleDownload(format, tableName);
  };

  const handleDownload = (format, tableName) => { // Add tableName parameter 
    let data = [];
    let filename = "";

    // Determine data and filename based on tableName
    switch (tableName) {
      case 'agent':
        data = tableData.agent.rows.map((row) => ({
          "Agent Name": row.agent.props.name,
          "Email": row.email,
          "Agent ID": row.agentID.props.number,
          "Policies Sold": row.policiesSold.props.number,
          "Mobile": row.mobile,
          "State": row.state,
        }));
        filename = 'agents_data';
        break;
      case 'policy':
        data = tableData.policy.rows.map((row) => {
          console.log("row", row);
          return {
            "Policy Holder Name": row.policyHolder.props.name,
            "Email": row.policyHolder.props.email,
            "Policy Number": row.policynumber.props.number,
            "Policy Type": row.policyType,
            "Effective Date": row.effectiveDate,
            "Expiration Date": row.expirationDate,
            "Mobile": row.mobile,
            "Agent ID": row.agentID
          }

        });
        filename = 'policies_data';
        break;
      case 'claim':
        data = tableData.claim.rows.map((row) => {
          console.log("row", row);

          return {
            "Policy Holder Name": row.policyholder.props.name,
            "Policy Holder Email": row.policyholder.props.email,
            "Claim Number": row.claimNumber.props.number,
            "Policy Number": row.policyNumber.props.number,
            "Policy Type": row.policyType,
            "Date Filed": row.dateFiled,
            "Agent ID": row.agentID,
            "Agent Name": row.agentName,
          }
        });
        filename = 'claims_data';
        break;
      default:
        break;
    }

    if (format === "csv") {
      const csvHeaders = Object.keys(data[0]).join(',') + '\n';
      const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = csvHeaders + csvRows;

      const csvLink = document.createElement("a");
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      csvLink.target = '_blank';
      csvLink.download = `${filename}.csv`;
      csvLink.click();
    } else if (format === "pdf") {
      const doc = new jsPDF('landscape');
      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Main Heading (Center Aligned)
      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename} Report`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename} Report`, textOffset, 22);

      // Add the current date to the PDF (Right Aligned, below the heading)
      addDateToPDF(doc, 28);

      // Text Content (Left Aligned)
      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of ${displayFilename}.`, 14, 40);

      // Table
      doc.autoTable({
        html: tableName === 'agent' ? agentTableRef.current :
          tableName === 'policy' ? policiesTableRef.current :
            claimsTableRef.current,
        startY: 50,
        styles: { halign: 'right' },
        headStyles: { halign: 'center', fontStyle: 'bold' }
      });

      addPageNumbers(doc);
      doc.save(`${filename}.pdf`);
    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, filename);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    }
  };
 
  if (isLoading) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Reports - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Loading table data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Reports - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Error: {error}</div>
      </DashboardLayout>
    );
  }

  const agentCustomComponents = {
    agent: AgentName,
    agentID: AgentID,
   };

   const policyCustomComponents = {
    policyHolder: AgentName, // Use AgentName for "Policy Holder"
    policynumber: ClaimNumber, 
    agentID: AgentID,
  };

  const claimCustomComponents = {
    policyholder: AgentName, // Use AgentName for "Policy Holder"
    claimNumber: ClaimNumber,
    policyNumber: ClaimNumber,
    agentID: AgentID,
  };

  return (
    <DashboardLayout>
      <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Reports - {ic_name}</MDTypography>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                sx={{
                  height: {
                    xs: "60px", // 100px height on extra-small screens
                    sm: "60px", // 150px height on small screens
                    md: "60px", // 200px height on medium screens
                    lg: "60px", // 250px height on large screens
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
                  Agents Table
                </MDTypography>
                {!(isClaimManager || isAdjuster || isUnderwriter) && ( 
                  <MDBox>
                    <IconButton onClick={handleAgentDownloadClick} sx={{ cursor: "pointer", color: "#ffffff" }}>
                      <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                    <Menu
                      anchorEl={agentDownloadAnchorEl}
                      open={openAgentDownloadMenu}
                      onClose={handleDownloadClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={() => handleDownloadOption('csv', 'agent')}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as CSV" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDownloadOption('excel', 'agent')}>
                        <ListItemIcon>
                          <TableChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as Excel" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDownloadOption('pdf', 'agent')}>
                        <ListItemIcon>
                          <PictureAsPdfIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as PDF" />
                      </MenuItem>
                    </Menu>

                  </MDBox>
                )}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  // table={{ columns: agentColumns, rows: agentRows }}
                  table={{ columns: tableData.agent.columns, rows: tableData.agent.rows }} // Access data from state
                  canSearch
                  isSorted={true}
                  entriesPerPage={true}
                  pagination={{ variant: "contained", color: "primary" }}
                  showTotalEntries={true}
                  noEndBorder
                  searchKeys={["agentName", "email", "plainAgentID", "policiesSold", "mobile", "state"]} 
                  // AgentName={AgentName}
                  // AgentID={AgentID}
                  customComponents={agentCustomComponents}
                />
              </MDBox> 
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                sx={{
                  height: {
                    xs: "60px", // 100px height on extra-small screens
                    sm: "60px", // 150px height on small screens
                    md: "60px", // 200px height on medium screens
                    lg: "60px", // 250px height on large screens
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
                  Policies Table
                </MDTypography>
                {!(isClaimManager || isAdjuster || isAgentAdmin) && ( 
                  <MDBox>
                    <IconButton onClick={handlePolicyDownloadClick} sx={{ cursor: "pointer", color: "#ffffff" }}>
                      <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                    <Menu
                      anchorEl={policyDownloadAnchorEl}
                      open={openPolicyDownloadMenu}
                      onClose={handleDownloadClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={() => handleDownloadOption('csv', 'policy')}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as CSV" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDownloadOption('excel', 'policy')}>
                        <ListItemIcon>
                          <TableChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as Excel" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDownloadOption('pdf', 'policy')}>
                        <ListItemIcon>
                          <PictureAsPdfIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as PDF" />
                      </MenuItem>
                    </Menu>

                  </MDBox>
                )}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  // table={{ columns: policyColumns, rows: policyRows }}
                  table={{ columns: tableData.policy.columns, rows: tableData.policy.rows }} // Access data from state

                  canSearch
                  isSorted={true}
                  entriesPerPage={true}
                  pagination={{ variant: "contained", color: "primary" }}
                  showTotalEntries={true}
                  noEndBorder
                  searchKeys={["policyHolderName", "policyHolderEmail", "plainPolicyNumber", "policyType", "effectiveDate", "expirationDate","mobile","agentID"]} 
                  customComponents={policyCustomComponents}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                sx={{
                  height: {
                    xs: "60px", // 100px height on extra-small screens
                    sm: "60px", // 150px height on small screens
                    md: "60px", // 200px height on medium screens
                    lg: "60px", // 250px height on large screens
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
                  Claims Table
                </MDTypography>
                {!(isUnderwriter || isAgentAdmin) && (
                <MDBox>
                  <IconButton onClick={handleClaimDownloadClick} sx={{ cursor: "pointer", color: "#ffffff" }}>
                    <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                  </IconButton>
                  <Menu
                    anchorEl={claimDownloadAnchorEl}
                    open={openClaimDownloadMenu}
                    onClose={handleDownloadClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleDownloadOption('csv', 'claim')}>
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary="Download as CSV" />
                    </MenuItem>
                    <MenuItem onClick={() => handleDownloadOption('excel', 'claim')}>
                      <ListItemIcon>
                        <TableChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Download as Excel" />
                    </MenuItem>
                    <MenuItem onClick={() => handleDownloadOption('pdf', 'claim')}>
                      <ListItemIcon>
                        <PictureAsPdfIcon />
                      </ListItemIcon>
                      <ListItemText primary="Download as PDF" />
                    </MenuItem>
                  </Menu>

                </MDBox>
                   )}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  // table={{ columns: claimColumns, rows: claimRows }}
                  table={{ columns: tableData.claim.columns, rows: tableData.claim.rows }} // Access data from state

                  canSearch
                  isSorted={true}
                  entriesPerPage={true}
                  pagination={{ variant: "contained", color: "primary" }}
                  showTotalEntries={true}
                  noEndBorder
                  searchKeys={["policyHolderName", "policyHolderEmail", "plainClaimNumber", "plainPolicyNumber", "policyType", "dateFiled","agentID","agentName"]} 
                  customComponents={claimCustomComponents}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
      {/* Hidden Tables for PDF Generation */}
      <div style={{ display: 'none' }}>
        <table ref={agentTableRef}>
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Email</th>
              <th>Agent ID</th>
              <th>Policies Sold</th>
              <th>Mobile</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {tableData.agent.rows.map((row, index) => (
              <tr key={index}>
                <td>{row.agent.props.name}</td>
                <td>{row.email}</td>
                <td>{row.agentID.props.number}</td>
                <td>{row.policiesSold.props.number}</td>
                <td>{row.mobile}</td>
                <td>{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table ref={policiesTableRef}>
          <thead>
            <tr>
              <th>Policy Holder</th>
              <th>Email</th>
              <th>Policy Number</th>
              <th>Policy Type</th>
              <th>Effective Date</th>
              <th>Expiration Date</th>
              <th>Mobile</th>
              <th>Agent ID</th>
            </tr>
          </thead>
          <tbody>
            {tableData.policy.rows.map((row, index) => (         
               <tr key={index}>
                <td>{row.policyHolder.props.name}</td>
                <td>{row.policyHolder.props.email}</td>
                <td>{row.policynumber.props.number}</td>
                <td>{row.policyType}</td>
                <td>{row.effectiveDate}</td>
                <td>{row.expirationDate}</td>
                <td>{row.mobile}</td>
                <td>{row.agentID}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table ref={claimsTableRef}>
          <thead>
            <tr>
              <th>Policy Holder</th>
              <th>Policy Holder Email</th>
              <th>Claim Number</th>
              <th>Policy Number</th>
              <th>Policy Type</th>
              <th>Date Filed</th>
              <th>Agent ID</th>
              <th>Agent Name</th>
            </tr>
          </thead>
          <tbody>
            {tableData.claim.rows.map((row, index) => (          
               <tr key={index}>
                <td>{row.policyholder.props.name}</td>
                <td>{row.policyholder.props.email}</td>
                <td>{row.claimNumber.props.number}</td>
                <td>{row.policyNumber.props.number}</td>
                <td>{row.policyType}</td>
                <td>{row.dateFiled}</td>
                <td>{row.agentID}</td>
                <td>{row.agentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Tables;

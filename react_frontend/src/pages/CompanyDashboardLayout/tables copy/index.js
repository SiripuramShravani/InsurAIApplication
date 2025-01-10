import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import DownloadIcon from "@mui/icons-material/Download";

// Vision UI Dashboard React components
import VuiBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox";
// Vision UI Dashboard React example components
import DashboardLayout from "../../../CompanyDashboardChartsCardsLayouts/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../CompanyDashboardChartsCardsLayouts/Navbars/DashboardNavbar";
import DataTable from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import InsightsIcon from '@mui/icons-material/Insights';
import PerformanceChartContainer from "./agentsDashboard";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
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

const AgentID = ({ number }) => {
  return (
    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      {number}
    </MDTypography>
  );
};




function Tables() {
   const [tableData, setTableData] = useState({
    agent: { columns: [], rows: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState(null); // Add state for performance data
  const [selectedAgentID, setSelectedAgentID] = useState(null); // Add state for selected agent ID
  const [selectedAgentName, setSelectedAgentName] = useState(null);
  const tableRef = useRef(null); // Create a ref for the table
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const openDownloadMenu = Boolean(downloadAnchorEl);
  const pdfTableRef = useRef(null); // Ref for the hidden table (used for PDF)
  const [openPerformanceViewPage, setOpenPerformanceViewPage] = useState(false);


  const company = JSON.parse(localStorage.getItem("carrier_admin_company"));
  const ic_id = localStorage.getItem("ic_id_for_dashboard")
  const ic_name = localStorage.getItem("ic_name_for_dashboard")
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append("ic_id", ic_id || company.ic_id);
        const response = await axiosInstance.post(
          'get_agents_details/',
          formData
        );
        console.log("API Response:", response.data);

        const transformedData = transformAPIData(response.data);
        setTableData(transformedData);

        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch agent data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformAPIData = (apiData) => {
    const transformed = {
      agent: { columns: [], rows: [] },
    };

    // 1. Transform Agent Data
    transformed.agent.columns = [
      { Header: "Agent", accessor: "agent", width: "25%", align: "left" },
      { Header: "Agent ID", accessor: "agentID", align: "left" },
      { Header: "Policies Sold", accessor: "policiesSold", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "left" },
      { Header: "State", accessor: "state", align: "left" },
      {
        Header: "Agent Insights",
        accessor: "performance",
        align: "center",
        Cell: ({ row }) => renderPerformanceCell(row.original),
      },
    ];

    transformed.agent.rows = Object.entries(apiData.agents_details).map(([agentID, agentData]) => ({
      agent: <AgentName name={agentData.agent_name} />,
      agentID: <AgentID number={agentID} />,
      plainAgentID: String(agentID),
      policiesSold: <AgentID number={String(agentData.No_of_policies_sold)} />,     
      mobile: agentData.agent_mobile,
      state: agentData.agent_state,
      performance: null,
      agentName: agentData.agent_name
    }));

    return transformed;
  };


  const openPerformanceView = (value) => {
    setOpenPerformanceViewPage(value);
  }

  const renderPerformanceCell = (row) => (
    <MDBox display="flex" alignItems="center" justifyContent="center"
      onClick={() => { // <-- onClick handler moved here
        console.log("selected row data", row);
        setSelectedAgentID(row.agentID.props.number);
        setSelectedAgentName(row.agent.props.name);
        openPerformanceView(true);
        const chartContainer = document.getElementById("performance-chart-container");
        if (chartContainer) {
          chartContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
       }}
      sx={{ cursor: "pointer" }} // <-- Cursor style for the entire MDBox
    >

      <MDBox
        sx={{
          backgroundColor: '#0B70FF',
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.2rem",
          paddingBottom: "0.2rem",
          borderRadius: "0.3rem",
        }}
      >
        <InsightsIcon
          sx={{
            fontSize: "2.5rem",
            color: "#ffffff",
          }}
        />
      </MDBox>


    </MDBox>
  );
  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleDownloadOption = (format) => {
    handleDownloadClose();
    handleDownload(format);
  };

  // Function to handle download for different formats
  const handleDownload = (format) => {
    const data = tableData.agent.rows.map((row) => {
      console.log("Row Data:", row); // Log the entire row object

      return {
        "Agent Name": row.agent.props.name,
        "Agent ID": row.agentID.props.number,
        "Policies Sold": row.policiesSold.props.number,
        "Mobile": row.mobile,
        "State": row.state,
      };
    });



    if (format === "csv") {
      // Create the header row
      const csvHeaders = Object.keys(data[0]).join(',') + '\n'; // Assuming all data objects have the same keys

      // Create the data rows
      const csvRows = data.map(row => Object.values(row).join(',')).join('\n');

      // Combine headers and rows
      const csvContent = csvHeaders + csvRows;

      // Create the download link
      const csvLink = document.createElement("a");
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      csvLink.target = '_blank';
      csvLink.download = "agents-data.csv";
      csvLink.click();
    } else if (format === "pdf") {
      const doc = new jsPDF('landscape'); // Set landscape orientation
      const filename = "agents_info"; // Set the desired filename

      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Main Heading (Center Aligned)
      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename} Report`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename} Report`, textOffset, 22);

      // Add the current date to the PDF (Right Aligned, below the heading)
      addDateToPDF(doc, 28); // Pass the y-position for the date

      // Text Content (Left Aligned)
      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of agents.`, 14, 40);

      // Table (Default Alignment - you can customize further)
      doc.autoTable({
        html: pdfTableRef.current,
        startY: 50,
        styles: { halign: 'right' },
        headStyles: { halign: 'center', fontStyle: 'bold' }
      });

      addPageNumbers(doc);
      doc.save(`${filename}.pdf`);


    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Agents Data");
      XLSX.writeFile(workbook, "agents-data.xlsx");
    }
  };


  // performance related logic
  // useEffect to fetch performance data when selectedAgentID changes
  useEffect(() => {
    const fetchPerformanceData = async () => {
      console.log("agent selected id", selectedAgentID);
      if (selectedAgentID) {
        try {
          const formData = new FormData();
          formData.append("agent_id", selectedAgentID); // Pass agent ID to API
          const response = await axiosInstance.post(
            'get_agent_stats/',
            formData
          );
          console.log("api response data", response.data);

          setPerformanceData(response.data);
        } catch (err) {
          console.error("Error fetching performance data:", err);
          // Handle error (e.g., display error message)
        }
      }
    };

    fetchPerformanceData();
  }, [selectedAgentID]);

  console.log("performnce of agent", performanceData);

  const transformPerformanceData = (apiData) => {
    console.log("data", apiData);
    console.log("check", apiData.Total_No_of_policies_sold);
    return {
      totalPolicies: apiData.Total_No_of_policies_sold,
      totalClaims: apiData.Total_No_of_claims,
      activePolicies: apiData.active_policies,
      policiesByHO: apiData.No_of_policies_by_HO,
      claimsByChannel: apiData.claims_by_channels,
      claimsByHO: apiData.claims_by_HO,
      agentDetails: apiData.agent_details,
      percentageIncreases: apiData.percentage_increases,
      agentPolicies: apiData.policy_details,
      agentClaims: apiData.claim_details,
    };
  };


  if (isLoading) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agents - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Loading table data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agents - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Error: {error}</div>
      </DashboardLayout>
    );
  }

  const agentCustomComponents = {
    agent: AgentName,
    agentID: AgentID,
   };


  return (
    <DashboardLayout>
      {openPerformanceViewPage === false ? (
        <>
          <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agents - {ic_name}</MDTypography>
          <DashboardNavbar />
          <VuiBox py={3}>
            <MDBox mb={3}>
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
                    Agents Info
                  </MDTypography>
                  <MDBox>
                    <IconButton
                      onClick={handleDownloadClick}
                      sx={{ cursor: "pointer", color: "#ffffff" }}
                    >
                      <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                    <Menu
                      anchorEl={downloadAnchorEl}
                      open={openDownloadMenu}
                      onClose={handleDownloadClose}
                    >
                      <MenuItem onClick={() => handleDownloadOption("csv")}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as CSV" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDownloadOption("excel")}>
                        <ListItemIcon>
                          <TableChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download as Excel" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDownloadOption("pdf")}>
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
                    // table={{ columns: agentColumns, rows: agentRows }}
                    table={{ columns: tableData.agent.columns, rows: tableData.agent.rows }}
                    canSearch
                    isSorted={true}
                    entriesPerPage={true}
                    pagination={{ variant: "contained", color: "primary" }}
                    showTotalEntries={true}
                    noEndBorder
                    tableRef={tableRef} // Attach the ref to the DataTable
                    searchKeys={["agentName", "plainAgentID", "policiesSold", "mobile", "state"]}
                    customComponents={agentCustomComponents}
                  />
                </MDBox>
              </Card>
            </MDBox>
          </VuiBox>
        </>
      ) : (
        <div id="performance-chart-container" style={{ minHeight: "200px" }}>
          {performanceData &&
            <>
              <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agent - {selectedAgentName}</MDTypography>
              <DashboardNavbar />
              <PerformanceChartContainer
                performanceData={transformPerformanceData(performanceData)} // Transform and pass data
                selectedAgentID={selectedAgentID}
                openPerformanceViewPage={openPerformanceViewPage}
                setOpenPerformanceViewPage={setOpenPerformanceViewPage} // Pass the function 
              />
            </>
          }
        </div>
      )}


      {/* <Footer /> */}
      {/* Hidden Table for PDF Generation */}
      {/* Hidden Table for PDF Generation */}
      <table ref={pdfTableRef} style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Agent Name</th>
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
              <td>{row.agentID.props.number}</td>
              <td>{row.policiesSold.props.number}</td>
              <td>{row.mobile}</td>
              <td>{row.state}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </DashboardLayout>
  );
}

export default Tables;

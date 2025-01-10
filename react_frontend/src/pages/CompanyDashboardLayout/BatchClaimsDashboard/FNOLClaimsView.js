import React, { useState, useRef, useEffect } from "react";
import { Avatar, Card, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import DownloadIcon from "@mui/icons-material/Download";
import VuiBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox";
import DataTable from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { Description as DescriptionIcon, TableChart as TableChartIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { addPageNumbers, addDateToPDF } from "../../../CompanyDashboardChartsCardsLayouts/TablePDFfunctions";
import WebIcon from '@mui/icons-material/Web';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import themeFunction from '../../../InsurAdminNewUIModificationsComponents/UIComponents-NewDashbaordUI/themes';
const theme = themeFunction();


function FNOLClaimsView({ claimsData, setClickedCard }) {
  const [tableData, setTableData] = useState({
    claims: { columns: [], rows: [] }
  });
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const openDownloadMenu = Boolean(downloadAnchorEl);
  const tableRef = useRef(null);
  const pdfTableRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(claimsData) && claimsData.length > 0) {
      const transformedData = transformClaimsData(claimsData);
      setTableData(transformedData);
    }
  }, [claimsData]);

  const Boldfont = ({ number }) => {
    return (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {number}
      </MDTypography>
    );
  }

  const fontboldCustomComponents = {
    claimNumber: Boldfont,
    policyNumber: Boldfont,
  };

  const handleCancelClick = () => {
    setClickedCard("");
  };
  const transformClaimsData = (data) => {
    const transformed = {
      claims: { columns: [], rows: [] }
    };

    transformed.claims.columns = [
      { Header: "Claim Number", accessor: "claimNumber", align: "left" },
      { Header: "Claim Created At", accessor: "claimCreatedAt", align: "left" },
      { Header: "Policy Holder Name", accessor: "policyHolderName", align: "left" },
      { Header: "Policy Number", accessor: "policyNumber", align: "left" },
      { Header: "Loss Date and Time", accessor: "lossDateTime", align: "left" },
      { Header: "Loss Location", accessor: "lossLocation", align: "left" },
    ];

    transformed.claims.rows = data.map((claim) => ({
      claimNumber: <Boldfont number={String(claim.claim_id)} />,
      claimCreatedAt: claim.claim_created_at,
      policyHolderName: claim.policy_holder_name,
      policyNumber: <Boldfont number={String(claim.policy_number)} />,
      lossDateTime: claim.loss_date_and_time,
      lossLocation: claim.loss_location
    }));
    return transformed;
  };

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

  const handleDownload = (format) => {
    const data = tableData.claims.rows.map((row) => ({
      "Claim Number": row.claimNumber.props.number,
      "Claim Created At": row.claimCreatedAt,
      "Policy Holder Name": row.policyHolderName,
      "Policy Number": row.policyNumber.props.number,
      "Loss Date and Time": row.lossDateTime,
      "Loss Location": row.lossLocation
    }));

    if (format === "csv") {
      const csvHeaders = Object.keys(data[0]).join(',') + '\n';
      const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = csvHeaders + csvRows;

      const csvLink = document.createElement("a");
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      csvLink.target = '_blank';
      csvLink.download = "SmartClaim-portal-claims-data.csv";
      csvLink.click();
    } else if (format === "pdf") {
      const doc = new jsPDF('landscape');
      const filename = "SmartClaim_portal_claims_report";

      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename}`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename}`, textOffset, 22);
      addDateToPDF(doc, 28);
      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of SmartClaim Portal claims.`, 14, 40);

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
      XLSX.utils.book_append_sheet(workbook, worksheet, "SmartClaim Portal Claims Data");
      XLSX.writeFile(workbook, "SmartClaim-portal-claims-data.xlsx");
    }
  };

  if (!Array.isArray(claimsData) || claimsData.length === 0) {
    return (
      <MDBox pt={3} pb={3}>
        <VuiBox py={3}>
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
              mt={-4}
              py={3}
              px={2}
              variant="contained"
              bgColor="#fff8e1"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderRadius="lg"
            >
              <MDTypography variant="h6" color="Black">
                <List sx={{ py: 0 }}>
                  <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.largeAvatar,
                          backgroundColor: '#ffffff',
                          color: '#ffc107',
                          cursor: 'default'
                        }}
                      >
                        <WebIcon fontSize="inherit" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        py: 0,
                        mt: 0.45,
                        mb: 0.45
                      }}
                      primary={<Typography variant="h6">SmartClaim Portal Claims Information</Typography>}
                    />
                  </ListItem>
                </List>
              </MDTypography>
              <MDBox>
              <IconButton
                sx={{ cursor: "pointer", color: "#5e35b1" }}
                onClick={handleCancelClick}
              >
                <CancelIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              </MDBox>
               </MDBox>
               <MDBox pt={3} px={3} py={3}>                   
              <MDTypography sx={{fontSize:"1rem"}}><InfoOutlinedIcon sx={{mr: 1, color:"#ffc107"}} fontSize="inherit"/>No Claims found.</MDTypography>
            </MDBox>        
          </Card>
        </VuiBox>
      </MDBox>
    )
  }

  return (
    <MDBox pt={3} pb={3}>
      <VuiBox py={3}>
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
            mt={-4}
            py={3}
            px={2}
            variant="contained"
            bgColor="#fff8e1"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="lg"
          >
            <MDTypography variant="h6" color="Black">
              <List sx={{ py: 0 }}>
                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: '#ffffff',
                        color: '#ffc107',
                        cursor: 'default'
                      }}
                    >
                      <WebIcon fontSize="inherit" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      py: 0,
                      mt: 0.45,
                      mb: 0.45
                    }}
                    primary={<Typography variant="h6">SmartClaim Portal Claims Information</Typography>}
                  />
                </ListItem>
              </List>
            </MDTypography>
            <MDBox>
              <IconButton
                onClick={handleDownloadClick}
                sx={{ cursor: "pointer", color: "#ffc107" }}
              >
                <DownloadIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <IconButton
                sx={{ cursor: "pointer", color: "#ffc107" }}
                onClick={handleCancelClick}
              >
                <CancelIcon sx={{ fontSize: "1.5rem" }} />
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
              table={{ columns: tableData.claims.columns, rows: tableData.claims.rows }}
              canSearch
              isSorted={true}
              entriesPerPage={true}
              pagination={{ variant: "contained", color: "light" }}
              showTotalEntries={true}
              noEndBorder
              tableRef={tableRef}
              searchKeys={["claimNumber", "policyHolderName", "policyNumber", "lossLocation"]}
              customComponents={fontboldCustomComponents}
            />
          </MDBox>
        </Card>
      </VuiBox>

      {/* Hidden Table for PDF Generation */}
      <table ref={pdfTableRef} style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Claim Number</th>
            <th>Claim Created At</th>
            <th>Policy Holder Name</th>
            <th>Policy Number</th>
            <th>Loss Date and Time</th>
            <th>Loss Location</th>
          </tr>
        </thead>
        <tbody>
          {tableData.claims.rows.map((row, index) => (
            <tr key={index}>
              <td>{row.claimNumber}</td>
              <td>{row.claimCreatedAt}</td>
              <td>{row.policyHolderName}</td>
              <td>{row.policyNumber}</td>
              <td>{row.lossDateTime}</td>
              <td>{row.lossLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MDBox>
  );
}

export default FNOLClaimsView;
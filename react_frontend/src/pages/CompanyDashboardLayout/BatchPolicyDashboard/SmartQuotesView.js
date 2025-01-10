import React, { useState, useRef, useEffect } from "react";
import { Avatar, Card, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
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
import MDBox from '../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox';
import MDTypography from '../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography';
import themeFunction from "../../../InsurAdminNewUIModificationsComponents/UIComponents-NewDashbaordUI/themes";
const theme = themeFunction();

function SmartQuotesView({ policiesData, setClickedCard }) {
  const [tableData, setTableData] = useState({
    policies: { columns: [], rows: [] }
  });
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const openDownloadMenu = Boolean(downloadAnchorEl);
  const tableRef = useRef(null);
  const pdfTableRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(policiesData) && policiesData.length > 0) {
      const transformedData = transformQuotesData(policiesData);
      setTableData(transformedData);
    }
  }, [policiesData]);
  const Boldfont = ({ number }) => {
    return (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {number}
      </MDTypography>
    );
  }
  const fontboldCustomComponents = {
    quoteNumber: Boldfont,
    quoteAmount: Boldfont,
  };
  const handleCancelClick = () => {
    setClickedCard("");
  };
  const transformQuotesData = (data) => {
    const transformed = {
      policies: { columns: [], rows: [] }
    };

    transformed.policies.columns = [
      { Header: "Quote Number", accessor: "quoteNumber", align: "left" },
      { Header: "Quote Amount($)", accessor: "quoteAmount", align: "left" },
      { Header: "Policy Holder Name", accessor: "policyHolderName", align: "left" },
      { Header: "Policy Holder Email", accessor: "policyHolderEmail", align: "left" },
      { Header: "Selected Policy", accessor: "selectedPolicy", align: "left" },
      { Header: "Quote Created At", accessor: "quoteCreatedAt", align: "left" },
    ];

    transformed.policies.rows = data.map((policy) => ({
      quoteNumber: <Boldfont number={String(policy.quote_number)} />,
      quoteAmount: <Boldfont number={String(`$${policy.quote_amount}`)} />,
      policyHolderName: policy.policy_holder_name,
      policyHolderEmail: policy.policy_holder_email,
      selectedPolicy: policy.selected_policy,
      quoteCreatedAt: policy.policy_created_at
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
    const data = tableData.policies.rows.map((row) => ({
      "Quote Number": row.quoteNumber.props.number,
      "Quote Amount($)":row.quoteAmount.props.number,
      "Policy Holder Name": row.policyHolderName,
      "Policy Holder Email": row.policyHolderEmail,
      "Selected Policy": row.selectedPolicy,
      "Quote Created At": row.quoteCreatedAt
    }));

    if (format === "csv") {
      const csvHeaders = Object.keys(data[0]).join(',') + '\n';
      const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = csvHeaders + csvRows;
      const csvLink = document.createElement("a");
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      csvLink.target = '_blank';
      csvLink.download = "SmartQuote-portal-Quotes-data.csv";
      csvLink.click();
    } else if (format === "pdf") {
      const doc = new jsPDF('landscape');
      const filename = "SmartQuote-portal-Quotes_report";
      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename}`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename}`, textOffset, 22);
      addDateToPDF(doc, 28);
      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of SmartQuote Portal Quotes.`, 14, 40);
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "SmartQuote Portal Quotes Data");
      XLSX.writeFile(workbook, "SmartQuote-portal-Quotes-data.xlsx");
    }
  };
  if (!Array.isArray(policiesData) || policiesData.length === 0) {
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
              bgColor="#ede7f6"
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
                          color: '#5e35b1',
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
                      primary={<Typography variant="h6">SmartQuote Portal Quotes Information</Typography>}
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
              <MDTypography sx={{fontSize:"1rem"}}><InfoOutlinedIcon sx={{mr: 1, color:"#5e35b1"}} fontSize="inherit"/>No Quotes found.</MDTypography>
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
            bgColor="#ede7f6"
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
                        color: '#5e35b1',
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
                    primary={<Typography variant="h6">SmartQuote Portal Quotes Information</Typography>}
                  />
                </ListItem>
              </List>
            </MDTypography>
            <MDBox>
              <IconButton
                onClick={handleDownloadClick}
                sx={{ cursor: "pointer", color: "#5e35b1" }}
              >
                <DownloadIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <IconButton
                sx={{ cursor: "pointer", color: "#5e35b1" }}
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
              table={{ columns: tableData.policies.columns, rows: tableData.policies.rows }}
              canSearch
              isSorted={true}
              entriesPerPage={true}
              pagination={{ variant: "contained", color: "light" }}
              showTotalEntries={true}
              noEndBorder
              tableRef={tableRef}
              searchKeys={["quoteNumber", "quoteAmount", "policyHolderName", "policyHolderEmail", "selectedPolicy"]}
              customComponents={fontboldCustomComponents}
            />
          </MDBox>
        </Card>
      </VuiBox>

      {/* Hidden Table for PDF Generation */}
      <table ref={pdfTableRef} style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Quote Number</th>
            <th>Quote Amount($)</th>
            <th>Policy Holder Name</th>
            <th>Policy Holder Email</th>
            <th>Selected Policy</th>
            <th>Quote Created At</th>
          </tr>
        </thead>
        <tbody>
          {tableData.policies.rows.map((row, index) => (
            <tr key={index}>
              <td>{row.quoteNumber}</td>
              <td>{row.quoteAmount}</td>
              <td>{row.policyHolderName}</td>
              <td>{row.policyHolderEmail}</td>
              <td>{row.selectedPolicy}</td>
              <td>{row.quoteCreatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MDBox>
  );
}
 
export default SmartQuotesView
import React, { useState, useRef, useEffect } from "react";
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
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import MDButton from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDButton";
import { Tooltip, CircularProgress, Dialog, DialogActions, DialogContent, Button, DialogTitle } from "@mui/material";
import { Avatar, Card, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import themeFunction from '../../../InsurAdminNewUIModificationsComponents/UIComponents-NewDashbaordUI/themes';
const theme = themeFunction();


function IDPFNOLClaimsView({ claimsData, setClickedCard }) {
  const [tableData, setTableData] = useState({
    claims: { columns: [], rows: [] }
  });
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const openDownloadMenu = Boolean(downloadAnchorEl);
  const tableRef = useRef(null);
  const pdfTableRef = useRef(null);
  const [openDocument, setOpenDocument] = useState(false);
  const [documentContent, setDocumentContent] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [loadingClaims, setLoadingClaims] = useState({});
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const ic_id = localStorage.getItem("ic_id_for_dashboard")
  useEffect(() => {
    if (Array.isArray(claimsData) && claimsData.length > 0) {
      const transformedData = transformClaimsData(claimsData);
      setTableData(transformedData);
    }
  }, [claimsData]);

  const handleDocumentView = async (claimId) => {
    setLoadingClaims(prevLoading => ({ ...prevLoading, [claimId]: true }));
    try {
      const company = JSON.parse(localStorage.getItem("carrier_admin_company"));
      const response = await axiosInstance.post(
        'get_idp_process_documents/',
        {
          ic_id: ic_id || company.ic_id,
          claim_id: claimId
        }
      );
      if (response.data.encoded_content) {
        setDocumentContent(response.data.encoded_content);
        setDocumentType(response.data.content_type);
        setDocumentName(response.data.document_name);
        setOpenDocument(true);
      } else {
        console.error("Error fetching document: No content received");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoadingClaims(prevLoading => ({ ...prevLoading, [claimId]: false }));
    }
  };

  const handleCloseDocument = () => {
    setOpenDocument(false);
    setDocumentContent(null);
    setDocumentType(null);
    setDocumentName("");
  };

  const handleCancelClick = () => {
    setClickedCard("");
  };

  const getDocumentUrl = () => {
    if (documentType === 'pdf') {
      const pdfBytes = Uint8Array.from(atob(documentContent), c => c.charCodeAt(0));
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } else if (documentType === 'html') {
      return `data:text/html;base64,${btoa(documentContent)}`;
    } else {
      return null;
    }
  };

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
      // { Header: "Loss Location", accessor: "lossLocation", align: "left" },
      {
        Header: "Document",
        accessor: "document",
        align: "center",
        Cell: ({ row }) => (
          <Tooltip title="View Document" arrow placement="right">
            <MDButton
              variant="outlined"
              onClick={() => {
                handleDocumentView(row.original.claimNumber.props.number);
              }}
              size="small"
              disabled={loadingClaims[row.original.claimNumber.props.number] || false}
              startIcon={loadingClaims[row.original.claimNumber.props.number] && <CircularProgress size={16} color="#1e88e5" />}
              sx={{
                borderColor: "#1e88e5",
                color: "#1e88e5",
                '&:hover': {
                  borderColor: "#1e88e5",
                  borderWidth: 2,
                },
              }}
            >
              <DescriptionIcon sx={{ color: "#1e88e5" }} />
            </MDButton>
          </Tooltip>
        )
      }
    ];

    transformed.claims.rows = data.map((claim) => ({
      claimNumber: <Boldfont number={String(claim.claim_id)} />,
      claimCreatedAt: claim.claim_created_at,
      policyHolderName: claim.policy_holder_name,
      policyNumber: <Boldfont number={String(claim.policy_number)} />,
      lossDateTime: claim.loss_date_and_time,
      // lossLocation: claim.loss_location
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
      // "Loss Location": row.lossLocation
    }));

    if (format === "csv") {
      const csvHeaders = Object.keys(data[0]).join(',') + '\n';
      const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = csvHeaders + csvRows;

      const csvLink = document.createElement("a");
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      csvLink.target = '_blank';
      csvLink.download = "DocAI™Claim-claims-data.csv";
      csvLink.click();
    } else if (format === "pdf") {
      const doc = new jsPDF('landscape');
      const filename = "DocAI™_Claim_claims_report";

      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename}`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename}`, textOffset, 22);
      addDateToPDF(doc, 28);
      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of DocAI™ Claim claims.`, 14, 40);

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
      XLSX.utils.book_append_sheet(workbook, worksheet, "DocAI™ Claim Claims Data");
      XLSX.writeFile(workbook, "DocAI™Claiml-claims-data.xlsx");
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
              bgColor="#eef2f6"
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
                          color: '#1e88e5',
                          cursor: 'default'
                        }}
                      >
                        <DescriptionIcon fontSize="inherit" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        py: 0,
                        mt: 0.45,
                        mb: 0.45
                      }}
                      primary={<Typography variant="h6">DocAI™ Claim Claims Information</Typography>}
                    />
                  </ListItem>
                </List>
              </MDTypography>
              <MDBox>
                  <IconButton
                    sx={{ cursor: "pointer", color: "#53918e" }}
                    onClick={handleCancelClick}
                  >
                    <CancelIcon sx={{ fontSize: "1.5rem" }} />
                  </IconButton>
                </MDBox>
            </MDBox>
            <MDBox pt={3} px={3} py={3}>                   
              <MDTypography sx={{fontSize:"1rem"}}><InfoOutlinedIcon sx={{mr: 1, color:"#1e88e5"}} fontSize="inherit"/>No Claims found.</MDTypography>
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
            bgColor="#eef2f6"
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
                        color: '#1e88e5',
                        cursor: 'default'
                      }}
                    >
                      <DescriptionIcon fontSize="inherit" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      py: 0,
                      mt: 0.45,
                      mb: 0.45
                    }}
                    primary={<Typography variant="h6">DocAI™ Claim Claims Information</Typography>}
                  />
                </ListItem>
              </List>
            </MDTypography>
            <MDBox>
              <IconButton
                onClick={handleDownloadClick}
                sx={{ cursor: "pointer", color: "#1e88e5" }}
              >
                <DownloadIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <IconButton
                sx={{ cursor: "pointer", color: "#1e88e5" }}
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
              pagination={{ variant: "contained", color: "primary" }}
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
            {/* <th>Loss Location</th> */}
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
              {/* <td>{row.lossLocation}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={openDocument} onClose={handleCloseDocument} fullWidth maxWidth="md">
        <DialogTitle>{documentName}</DialogTitle>
        <DialogContent>
          {documentType === 'pdf' && (
            <embed src={getDocumentUrl()} width="100%" height="600px" type="application/pdf" />
          )}
          {documentType === 'html' && (
            <div dangerouslySetInnerHTML={{ __html: documentContent }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocument} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}


export default IDPFNOLClaimsView;

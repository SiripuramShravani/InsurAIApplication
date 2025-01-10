import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Grid, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button,
  Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Menu, ListItemIcon, ListItemText, useMediaQuery, createTheme,
  Container, Card, CardContent,
} from '@mui/material';
import { GetApp as GetAppIcon, Description as DescriptionIcon, TableChart as TableChartIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material'; import * as XLSX from 'xlsx';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



const Report = () => {
  const [policyFilter, setPolicyFilter] = useState({ id: '', type: '', from: '', to: '' });
  const [claimFilter, setClaimFilter] = useState({ id: '', type: '' });
  const [agentFilter, setAgentFilter] = useState({ id: '', name: '' });
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState(''); // State to track download format
  const [downloadType, setDownloadType] = useState(''); // State to track download type (policies, claims, agents)
  const [policiesData, setPoliciesData] = useState({});
  const [claimsData, setClaimsData] = useState({});
  const [agentsData, setAgentsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  // --- Refs for PDF Generation --- 
  // Create references (refs) for the Table components to capture their HTML for PDF
  const policiesTableRef = useRef(null);
  const claimsTableRef = useRef(null);
  const agentsTableRef = useRef(null);

  const MAX_ROWS_TO_SHOW = 5; // Constant for the maximum number of rows


  useEffect(() => {
    const fetchData = async () => {
      try {
        const company = JSON.parse(localStorage.getItem('carrier_admin_company'));
        const ic_id = localStorage.getItem('ic_id_for_dashboard')
        const formData = new FormData();
        formData.append('ic_id', ic_id || company.ic_id);
        const response = await axiosInstance.post('get_all_reports/', formData);
        console.log(response, response.data);
        localStorage.setItem("reports_dashboard_data", JSON.stringify(response.data));
        const dataFromLocalStorage = JSON.parse(localStorage.getItem("reports_dashboard_data"));
        console.log(dataFromLocalStorage);
        if (dataFromLocalStorage) {
          setPoliciesData(dataFromLocalStorage.Policies_data);
          setClaimsData(dataFromLocalStorage.claims_data);
          setAgentsData(dataFromLocalStorage.Agents_data);
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch Reports data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(policiesData, claimsData, agentsData);

  // Policies Filtering
  const filteredPolicies = Object.entries(policiesData)
    .filter(([policyNumber, policyData]) => {
      return (
        (policyFilter.id === '' || policyNumber.includes(policyFilter.id)) &&
        (policyFilter.type === '' || policyData.policy_type === policyFilter.type) &&
        // Directly compare policyNumber (without removing "HI")
        (policyFilter.from === '' || policyNumber >= policyFilter.from) &&
        (policyFilter.to === '' || policyNumber <= policyFilter.to)
      );
    })
    .map(([policyNumber, policyData]) => ({ // <-- Add this .map after filtering
      id: policyNumber, // Create an 'id' property from policyNumber
      ...policyData    // Spread the rest of the policyData 
    }));

  // Claims Filtering
  const filteredClaims = Object.entries(claimsData)
    .filter(([claimNumber, claimData]) => {
      return (
        (claimFilter.id === '' || claimNumber.includes(claimFilter.id)) &&
        (claimFilter.type === '' || claimData.Type === claimFilter.type)
      );
    })
    .map(([claimNumber, claimData]) => ({
      id: claimNumber,
      ...claimData
    }));

  // Agents Filtering
  const filteredAgents = Object.entries(agentsData)
    .filter(([agentId, agentData]) => {
      return (
        (agentFilter.id === '' || agentId.includes(agentFilter.id)) &&
        (agentFilter.name === '' || agentData.Agent_name.toLowerCase().includes(agentFilter.name.toLowerCase()))
      );
    })
    .map(([agentId, agentData]) => ({
      id: agentId,
      ...agentData
    }));

  // Function to add page numbers to PDF
  const addPageNumbers = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
    }
  };

  // Function to add the current date to the PDF
  const addDateToPDF = (doc) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); 
    const day = ("0" + currentDate.getDate()).slice(-2);
    const formattedDate = `${year}/${month}/${day}`;

    doc.setFontSize(10); 
    doc.text(formattedDate, doc.internal.pageSize.getWidth() - 40, 10); 
  };



  const handlePolicyDownload = (format) => {
    let data = filteredPolicies.map(policy => ({
      'Policy Number': policy.id,
      'Name': policy.policy_holder_name,
      'Email': policy.email,
      'Mobile Number': policy.policy_holder_mobile_number,
      'Policy Type': policy.policy_type,
      'Agent ID': policy.Agent_id
    }));

    if (format === 'csv') {
      // CSV Download Logic
      const csvContent = `data:text/csv;charset=utf-8,${[
        Object.keys(data[0]), // Get header row from data
        ...data.map(row => Object.values(row))
      ].map(e => e.join(",")).join("\n")}`;

      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.setAttribute('download', 'filtered_policies.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else if (format === 'excel') {
      // Excel Download Logic
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Filtered Policies');
      XLSX.writeFile(wb, 'filtered_policies.xlsx');
    } else if (format === 'pdf') {
      const doc = new jsPDF('landscape'); // Set orientation to landscape
      // Add heading 
      doc.setFontSize(20);
      doc.text("Policies Report", 14, 22); // Add heading to PDF
      // Add some descriptive text
      doc.setFontSize(12);
      doc.text("This report provides a detailed list of all policies, including policy details, insured information, and associated agents.", 14, 30);
      // Add table to PDF
      doc.autoTable({ 
        html: policiesTableRef.current, 
        startY: 40, // Start table below heading and text
        styles: { halign: 'right' } 
      });

      addPageNumbers(doc); // Add page numbers to the PDF
      addDateToPDF(doc);  // Add the date to the PDF
      doc.save('filtered_policies.pdf');
    }
  };

  const handleClaimDownload = (format) => {
    let data = filteredClaims.map((claim) => ({
      'Claim Number': claim.id, // Assuming 'id' holds the claim number
      Name: claim.Name,
      Email: claim.email,
      'Policy Type': claim.Type,
      'Claim Created On': claim.claim_created_at,
    }));

    if (format === 'csv') {
      const csvContent = `data:text/csv;charset=utf-8,${[
        Object.keys(data[0]),
        ...data.map((row) => Object.values(row)),
      ]
        .map((e) => e.join(','))
        .join('\n')}`;

      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.setAttribute('download', 'filtered_claims.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Filtered Claims');
      XLSX.writeFile(wb, 'filtered_claims.xlsx');
    } else if (format === 'pdf') {
      const doc = new jsPDF('landscape');

      doc.setFontSize(20);
      doc.text("Claims Report", 14, 22); 

      doc.setFontSize(12);
      doc.text("This report provides details of all submitted claims, including claimant information and associated policy types.", 14, 30); 

      doc.autoTable({
        html: claimsTableRef.current,
        startY: 40, 
        styles: { halign: 'right' } 
      });

      addPageNumbers(doc);
      addDateToPDF(doc); 
      doc.save('filtered_claims.pdf');
    }
  };

  const handleAgentDownload = (format) => {
    let data = filteredAgents.map((agent) => ({
      'Agent ID': agent.id,
      Name: agent.Agent_name,
      'Policies Sold': agent.No_of_policies,
      Mobile: agent.Agent_number,
      State: agent.Agent_state,
      // Add other relevant agent data
    }));

    if (format === 'csv') {
      const csvContent = `data:text/csv;charset=utf-8,${[
        Object.keys(data[0]),
        ...data.map((row) => Object.values(row)),
      ]
        .map((e) => e.join(','))
        .join('\n')}`;

      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.setAttribute('download', 'filtered_agents.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Filtered Agents');
      XLSX.writeFile(wb, 'filtered_agents.xlsx');
    } else if (format === 'pdf') {
      const doc = new jsPDF('landscape');

      doc.setFontSize(20);
      doc.text("Agents Report", 14, 22);

      doc.setFontSize(12);
      doc.text("This report provides an overview of all registered agents, their sales performance, and contact details.", 14, 30); 

      doc.autoTable({
        html: agentsTableRef.current,
        startY: 40, 
        styles: { halign: 'right' }
      });

      addPageNumbers(doc);
      addDateToPDF(doc); 
      doc.save('filtered_agents.pdf');
    }
  };


  const handleDownloadClick = (event, type) => {
    setDownloadType(type);
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleFormatSelect = (format) => {
    setDownloadFormat(format);
    if (downloadType === 'policies') {
      handlePolicyDownload(format);
    } else if (downloadType === 'claims') {
      handleClaimDownload(format);
    } else if (downloadType === 'agents') {
      handleAgentDownload(format);
    }
    setDownloadAnchorEl(null); // Close the download menu after format selection
  };

  const handlePolicyFilterChange = (event) => {
    const { name, value } = event.target;
    setPolicyFilter({ ...policyFilter, [name]: value });
  };

  const handleClaimFilterChange = (event) => {
    const { name, value } = event.target;
    setClaimFilter({ ...claimFilter, [name]: value });
  };

  const handleAgentFilterChange = (event) => {
    const { name, value } = event.target;
    setAgentFilter({ ...agentFilter, [name]: value });
  };
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 650,
        md: 970,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {loading ? (
        <div>loading.......</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) :
        <Container >
          <Grid item xs={2} sm={5} md={4} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center" }}>
            <Typography className="Nasaliza" style={{ color: "blue", fontSize: "2rem", margin: "0rem 0rem 1rem 0rem" }}>Reports Dashboard</Typography>
          </Grid>
          {/* <Grid item style={{ marginTop: "2rem", margin: "auto", }}> */}
          <Grid item xs={6} sm={9.5} md={10} sx={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(3),
            boxShadow: '0 8px 10px 0 rgba(31, 38, 135, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            height: '100%',
            display: 'flex',
            flexWrap: "wrap",
            flexDirection: 'column',
            justifyContent: 'space-between',

            border: "2px solid blue"
          }}>
            <Typography variant="h6" className="Nasaliza" style={{ fontSize: '1.3rem', margin: "1rem 0rem" }}>
              Policies ({Object.keys(filteredPolicies).length}) {/* Display total policies count */}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Policy ID"
                  name="id"
                  value={policyFilter.id}
                  onChange={handlePolicyFilterChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Policy Type"
                  name="type"
                  value={policyFilter.type}
                  onChange={handlePolicyFilterChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="From Policy Number"
                  name="from"
                  value={policyFilter.from}
                  onChange={handlePolicyFilterChange}
                  placeholder="Enter (e.g., HI23001001)"
                /> {/* Removed type="number" */}
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="To Policy Number"
                  name="to"
                  value={policyFilter.to}
                  onChange={handlePolicyFilterChange}
                  placeholder="Enter (e.g., HI23001017)"
                /> {/* Removed type="number" */}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => handleDownloadClick(event, 'policies')}
                  disabled={filteredPolicies.length === 0}
                  startIcon={<GetAppIcon />}
                >
                  Download Policies
                </Button>
                <Menu
                  anchorEl={downloadAnchorEl}
                  open={Boolean(downloadAnchorEl) && downloadType === 'policies'}
                  onClose={handleDownloadClose}
                >
                  <MenuItem onClick={() => handleFormatSelect('csv')}>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as CSV" />
                  </MenuItem>
                  <MenuItem onClick={() => handleFormatSelect('excel')}>
                    <ListItemIcon>
                      <TableChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as Excel" />
                  </MenuItem>
                  {/* --- Add PDF option to menu --- */}
                  <MenuItem onClick={() => handleFormatSelect('pdf')}>
                    <ListItemIcon>
                      <PictureAsPdfIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as PDF" />
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>

            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "100%",
                maxHeight: `${MAX_ROWS_TO_SHOW * 52}px`, // Calculate max height based on row count
                overflowY: "auto",
                paddingBottom: "2rem"
              }}
            >
              {/* Attach the ref to the Table component */}
              <Table ref={policiesTableRef}>
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Number</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Policy Type</TableCell>
                    <TableCell>Agent ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>{policy.id}</TableCell> {/* Now accessible as policy.id */}
                      <TableCell>{policy.policy_holder_name}</TableCell>
                      <TableCell>{policy.email}</TableCell>
                      <TableCell>{policy.policy_holder_mobile_number}</TableCell>
                      <TableCell>{policy.policy_type}</TableCell>
                      <TableCell>{policy.Agent_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </Grid>

          <Grid item xs={8} sm={9.5} md={10} style={{ marginTop: "2rem" }} sx={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(3),
            boxShadow: '0 8px 10px 0 rgba(31, 38, 135, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: "2px solid blue"
          }}>
            <Typography variant="h6" className="Nasaliza" style={{ fontSize: '1.3rem', margin: "1rem 0rem" }}>  Claims ({Object.keys(filteredClaims).length}) </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Claim ID"
                  name="id"
                  value={claimFilter.id}
                  onChange={handleClaimFilterChange}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel>Claim Type</InputLabel>
                  <Select
                    value={claimFilter.type}
                    onChange={handleClaimFilterChange}
                    inputProps={{
                      name: 'type',
                      id: 'claim-type-select',
                    }}
                    MenuProps={{
                      style: {
                        maxHeight: 255,
                      },
                    }}
                    sx={{
                      '& .MuiSelect-select': { textAlign: 'left' },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {/* Generate options for H01 to H08 */}
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                      <MenuItem key={`H0${num}`} value={`H0${num}`}>
                        H0{num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => handleDownloadClick(event, 'claims')}
                  disabled={filteredClaims.length === 0}
                  startIcon={<GetAppIcon />}
                >
                  Download Claims
                </Button>
                <Menu
                  anchorEl={downloadAnchorEl}
                  open={Boolean(downloadAnchorEl) && downloadType === 'claims'}
                  onClose={handleDownloadClose}
                >
                  <MenuItem onClick={() => handleFormatSelect('csv')}>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as CSV" />
                  </MenuItem>
                  <MenuItem onClick={() => handleFormatSelect('excel')}>
                    <ListItemIcon>
                      <TableChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as Excel" />
                  </MenuItem>
                  {/* --- Add PDF option to menu --- */}
                  <MenuItem onClick={() => handleFormatSelect('pdf')}>
                    <ListItemIcon>
                      <PictureAsPdfIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as PDF" />
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
            <Box mt={2}>
              <TableContainer component={Paper} sx={{ maxHeight: `${MAX_ROWS_TO_SHOW * 52}px`, overflowY: "auto" }}>
                <Table ref={claimsTableRef}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Claim Number</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>policy Type</TableCell>
                      <TableCell>Claim Created on</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.id}</TableCell>
                        <TableCell>{claim.Name}</TableCell>
                        <TableCell>{claim.email}</TableCell>
                        <TableCell>{claim.Type}</TableCell>
                        <TableCell>{claim.claim_created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          <Grid item xs={8} sm={9.5} md={10} style={{ marginTop: "2rem" }} sx={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(3),
            boxShadow: '0 8px 10px 0 rgba(31, 38, 135, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: theme.spacing(3),
            border: "2px solid blue",
          }}>
            <Typography variant="h6" className="Nasaliza" style={{ fontSize: '1.3rem', margin: "1rem 0rem" }}>   Agents ({Object.keys(filteredAgents).length})</Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Agent ID"
                  name="id"
                  value={agentFilter.id}
                  onChange={handleAgentFilterChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Agent Name"
                  name="name"
                  value={agentFilter.name}
                  onChange={handleAgentFilterChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => handleDownloadClick(event, 'agents')}
                  disabled={filteredAgents.length === 0}
                  startIcon={<GetAppIcon />}
                >
                  Download Agents
                </Button>
                <Menu
                  anchorEl={downloadAnchorEl}
                  open={Boolean(downloadAnchorEl) && downloadType === 'agents'}
                  onClose={handleDownloadClose}
                >
                  <MenuItem onClick={() => handleFormatSelect('csv')}>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as CSV" />
                  </MenuItem>
                  <MenuItem onClick={() => handleFormatSelect('excel')}>
                    <ListItemIcon>
                      <TableChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as Excel" />
                  </MenuItem>
                  {/* --- Add PDF option to menu --- */}
                  <MenuItem onClick={() => handleFormatSelect('pdf')}>
                    <ListItemIcon>
                      <PictureAsPdfIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download as PDF" />
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
            <Box mt={2}>
              <TableContainer component={Paper} sx={{ maxHeight: `${MAX_ROWS_TO_SHOW * 52}px`, overflowY: "auto" }}>
                <Table ref={agentsTableRef}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Agent ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Policies Sold</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>{agent.id}</TableCell>
                        <TableCell>{agent.Agent_name}</TableCell>
                        <TableCell>{agent.No_of_policies}</TableCell>
                        <TableCell>{agent.Agent_number}</TableCell>
                        <TableCell>{agent.Agent_state}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          {/* </Grid> */}
        </Container>
      }
    </>
  );
};

export default Report;

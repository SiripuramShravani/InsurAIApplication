/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "../../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import PropTypes from "prop-types";
import MDAvatar from "../../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDAvatar";
import MDBadge from "../../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBadge"; 
import PersonIcon from "@mui/icons-material/Person"; // Import a default person icon

export default function data() {
  const Claim = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <CustomAvatar image={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  Claim.propTypes = {
    claimNumber: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };
  const CustomAvatar = ({ image, name, size }) => {
    const avatarSize = size === "sm" ? 40 : 56; // Increased sizes
    const iconSize = size === "sm" ? "medium" : "large"; // New prop for icon size
    if (image) {
      return <MDAvatar src={image} name={name} size={size} />;
    }
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

  return {
    columns: [
      { Header: "Claimant", accessor: "claimant", width: "20%", align: "left" },
      { Header: "Claim Number", accessor: "claimnumber", align: "left" },
      { Header: "Policy Type", accessor: "policyType", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Date Filed", accessor: "dateFiled", align: "left" },
      { Header: "Agent ID", accessor: "agentID", align: "left" },
      { Header: "Assigned To", accessor: "assignedTo", align: "left" },
    ],

    rows: [
      {
        claimant: <Claim name="John Doe" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-001
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="In Progress" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            05/05/2023
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Alice Johnson
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Jane Smith" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-002
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Home
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Approved" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            04/15/2023
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Bob Williams
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="David Lee" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-003
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Life
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            03/28/2023
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Carol Davis
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Sarah Jones" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-004
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="In Progress" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            02/10/2023
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            David Garcia
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Michael Brown" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-005
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Home
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Approved" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            01/22/2023
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Emily Rodriguez
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Emily Wilson" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-006
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Life
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            12/05/2022
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Frank Wilson
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Daniel Garcia" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-007
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="In Progress" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            11/18/2022
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Gina Martinez
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Olivia Rodriguez" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-008
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Home
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Approved" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            10/30/2022
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Henry Thomas
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Ethan Martinez" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-009
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Life
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            09/22/2022
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Isabella Jackson
          </MDTypography>
        ),
      },
      {
        claimant: <Claim name="Sophia Taylor" />,
        claimnumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            CLM-010
          </MDTypography>
        ),
        policyType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="In Progress" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        dateFiled: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            08/10/2022
          </MDTypography>
        ),
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J2345
          </MDTypography>
        ),
        assignedTo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Jack White
          </MDTypography>
        ),
      },
    ],
  };
}

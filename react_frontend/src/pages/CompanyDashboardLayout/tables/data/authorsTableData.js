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
import MDAvatar from "../../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDAvatar";
import MDBadge from "../../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBadge"; 
import PersonIcon from "@mui/icons-material/Person"; // Import a default person icon

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <CustomAvatar image={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          <span>{name}</span> {/* Wrap text in a span */}
        </MDTypography>
        <MDTypography variant="caption">
          <span style={{ color: "gray" }}>{email}</span> {/* Wrap text in a span */}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

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

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Agent", accessor: "agent", width: "35%", align: "left" },
      { Header: "Agent ID", accessor: "agentID", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Polices Sold", accessor: "policiesSold", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "left" },
      { Header: "State", accessor: "state", align: "left" },
    ],

    rows: [
      {
        agent: <Author name="John Michael" email="john@creative-tim.com" />, // Missing Image
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            A2312
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            20
          </MDTypography>
        ),
        mobile: "123-456-7890",
        state: "California",
      },
      {
        agent: <Author name="Alexa Liras" email="alexa@creative-tim.com" />,
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            B5678
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            8
          </MDTypography>
        ),
        mobile: "987-654-3210",
        state: "New York",
      },
      {
        agent: <Author name="Sophia Johnson" email="sophia@example.com" />, // Missing Image
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            C9012
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            35
          </MDTypography>
        ),
        mobile: "555-123-4567",
        state: "Texas",
      },
      {
        agent: <Author name="Michael Levi" email="michael@creative-tim.com" />,
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            D1234
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            12
          </MDTypography>
        ),
        mobile: "555-123-4534",
        state: "Florida",
      },
      {
        agent: <Author name="Emily Chen" email="emily@example.com" />, // Missing Image
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            E5678
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            5
          </MDTypography>
        ),
        mobile: "555-456-4567",
        state: "Illinois",
      },
      {
        agent: <Author name="David Wilson" email="david@creative-tim.com" />,
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            F9012
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            28
          </MDTypography>
        ),
        mobile: "555-123-4567",
        state: "California",
      },
      {
        agent: <Author name="Olivia Garcia" email="olivia@example.com" />, // Missing Image
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            G1234
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            11
          </MDTypography>
        ),
        mobile: "555-123-4567",
        state: "New York",
      },
      {
        agent: <Author name="Daniel Rodriguez" email="daniel@creative-tim.com" />,
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            H5678
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            19
          </MDTypography>
        ),
        mobile: "555-123-4567",
        state: "Texas",
      },
      {
        agent: <Author name="Mia Martinez" email="mia@example.com" />,
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            I9012
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            32
          </MDTypography>
        ),
        mobile: "555-123-4567",
        state: "Florida",
      },
      {
        agent: <Author name="Kevin Anderson" email="kevin@example.com" />, // Missing Image
        agentID: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            J1234
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        policiesSold: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            7
          </MDTypography>
        ),
        mobile: "555-123-4567",
        state: "Illinois",
      },
    ],
  };
}

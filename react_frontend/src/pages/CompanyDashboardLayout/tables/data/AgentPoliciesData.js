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
import PersonIcon from "@mui/icons-material/Person"; // Not used in this file

export default function data() {
  const Policy = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <CustomAvatar image={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  Policy.propTypes = {
    policyNumber: PropTypes.string.isRequired,
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
      { Header: "Policy Holder", accessor: "policy", width: "17%", align: "left" },
      { Header: "Policy Number", accessor: "policynumber", width: "12.5%", align: "left" },
      { Header: "Policy Type", accessor: "type", width: "11%", align: "left" },
      { Header: "Status", accessor: "status", width: "9%", align: "left" },
      { Header: "Effective Date", accessor: "startDate", width: "12.5%", align: "center" },
      { Header: "Expiration Date", accessor: "endDate", width: "13%", align: "center" },
      { Header: "Mobile", accessor: "mobile", width: "13%", align: "left" },
    ],

    rows: [
      {
        policy: <Policy name="John Doe" email="john@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-001
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            8121-4567-234
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Jane Smith" email="jane@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-002
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Home
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Pending" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            9876-5432-101
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="David Lee" email="david@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-003
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Life
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            7654-3210-987
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Sarah Jones" email="sarah@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-004
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Cancelled" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            6543-2109-876
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Michael Brown" email="michael@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-005
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Home
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            5432-1098-765
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Emily Wilson" email="emily@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-006
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Life
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Pending" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            4321-0987-654
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Daniel Garcia" email="daniel@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-007
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            3210-9876-543
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Olivia Rodriguez" email="olivia@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-008
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Home
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Cancelled" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2109-8765-432
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Ethan Martinez" email="ethan@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-009
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Life
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            1098-7654-321
          </MDTypography>
        ),
      },
      {
        policy: <Policy name="Sophia Taylor" email="sophia@example.com" />,
        policynumber: (
          <MDTypography display="block" variant="button" fontWeight="medium">
            POL-010
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Auto
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Pending" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ),
        startDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2023/06/05
          </MDTypography>
        ),
        endDate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2024/06/04
          </MDTypography>
        ),
        mobile: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0987-6543-210
          </MDTypography>
        ),
      },
    ],
  };
}

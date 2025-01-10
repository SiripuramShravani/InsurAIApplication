import { useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Bill from "layouts/billing/components/Bill";

// Data for rows (success, failure, edited success)
const successData = [
  {
    name: "John Doe",
    company: "Tech Solutions",
    email: "john@tech.com",
    vat: "FRB1234567",
  },
  {
    name: "Jane Smith",
    company: "Innovate LLC",
    email: "jane@innovate.com",
    vat: "FRB1234567",
  },
];

const failureData = [
  {
    name: "Alice Johnson",
    company: "Creative Inc",
    email: "alice@creative.com",
    vat: "FRB1234567",
  },
  {
    name: "Bob Brown",
    company: "Design Hub",
    email: "bob@design.com",
    vat: "FRB1234567",
  },
];

const editedSuccessData = [
  {
    name: "Charlie Davis",
    company: "BuildRight",
    email: "charlie@buildright.com",
    vat: "FRB1234567",
  },
  {
    name: "Dana Wilson",
    company: "MakeThings",
    email: "dana@makethings.com",
    vat: "FRB1234567",
  },
];

function BillingInformation() {
  const [view, setView] = useState("success");

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const renderRows = (data) =>
    data.map((bill, index) => (
      <Bill
        key={index}
        name={bill.name}
        company={bill.company}
        email={bill.email}
        vat={bill.vat}
        noGutter={index === data.length - 1}
        actions={
          <MDBox display="flex" gap={1}>
            {view === "failure" ? (
              <>
                <MDButton variant="outlined" color="info">
                  <Icon>visibility</Icon>&nbsp;Document View
                </MDButton>
                <MDButton variant="outlined" color="error">
                  <Icon>edit</Icon>&nbsp;Edit
                </MDButton>
              </>
            ) : (
              <>
                <MDButton variant="outlined" color="info">
                  <Icon>visibility</Icon>&nbsp;Document View
                </MDButton>
                <MDButton variant="outlined" color="info">
                  <Icon>email</Icon>&nbsp;Email View
                </MDButton>
              </>
            )}
          </MDBox>
        }
      />
    ));

  const getData = () => {
    if (view === "success") return successData;
    if (view === "failure") return failureData;
    if (view === "editedSuccess") return editedSuccessData;
    return [];
  };

  return (
    <Card id="billing-info">
      <MDBox pt={3} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Claims Information
        </MDTypography>
        <MDBox display="flex" gap={2}>
          <MDButton
            variant="gradient"
            color={view === "success" ? "success" : "secondary"}
            onClick={() => handleViewChange("success")}
          >
            <Icon>check_circle</Icon>&nbsp;Success
          </MDButton>
          <MDButton
            variant="gradient"
            color={view === "failure" ? "error" : "secondary"}
            onClick={() => handleViewChange("failure")}
          >
            <Icon>error</Icon>&nbsp;Failure
          </MDButton>
          <MDButton
            variant="gradient"
            color={view === "editedSuccess" ? "warning" : "secondary"}
            onClick={() => handleViewChange("editedSuccess")}
          >
            <Icon>edit</Icon>&nbsp;Edited Success
          </MDButton>
        </MDBox>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {renderRows(getData())}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;

import { useState } from "react";
import PropTypes from "prop-types";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import BillingInformation from "layouts/billing/components/BillingInformation";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function PaymentMethod({ title }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [expanded, setExpanded] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const [processCount, setProcessCount] = useState({ success: 0, failure: 0 });

  const handleFetchClaims = () => {
    // Simulate fetching claims
    const fetchedClaims = Math.floor(Math.random() * 100) + 1;
    setFetchCount(fetchedClaims);
  };

  const handleProcessClaims = () => {
    // Simulate processing claims
    const success = Math.floor(Math.random() * fetchCount);
    const failure = fetchCount - success;
    setProcessCount({ success, failure });
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          {title}
        </MDTypography>
        <MDButton variant="gradient" color="dark" onClick={toggleExpand}>
          <Icon sx={{ fontWeight: "bold" }}>{expanded ? "expand_less" : "expand_more"}</Icon>
          &nbsp;{expanded ? "Hide Claims" : "View Claims"}
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDButton variant="gradient" color="primary" onClick={handleFetchClaims}>
                Fetch Claims
              </MDButton>
              <MDTypography variant="h6" fontWeight="medium">
                Fetched Claims: {fetchCount}
              </MDTypography>
              <MDButton variant="gradient" color="success" onClick={handleProcessClaims}>
                Process Claims
              </MDButton>
              <MDTypography variant="h6" fontWeight="medium">
                Success: {processCount.success}, Failure: {processCount.failure}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <MDBox p={2}>
          <BillingInformation />
        </MDBox>
      </Collapse>
    </Card>
  );
}

// Setting default values for the props of PaymentMethod
PaymentMethod.defaultProps = {
  title: "Payment Method",
};

// Typechecking props for the PaymentMethod
PaymentMethod.propTypes = {
  title: PropTypes.string,
};

export default PaymentMethod;

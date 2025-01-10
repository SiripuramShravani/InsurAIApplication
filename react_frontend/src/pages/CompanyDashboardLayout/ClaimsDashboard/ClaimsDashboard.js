import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import VuiBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox";
import VuiTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiTypography";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import DashboardLayout from "../../../CompanyDashboardChartsCardsLayouts/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../CompanyDashboardChartsCardsLayouts/Navbars/DashboardNavbar";
import ReportsBarChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/BarCharts/ReportsBarChart";
import DefaultDoughnutChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/DoughnutCharts/DefaultDoughnutChart";
import VerticalBarChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/BarCharts/VerticalBarChart";
import LineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/LineChart";
import { lineChartOptionsDashboard } from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/lineChartOptions";
import DefaultInfoCard from "../../../CompanyDashboardChartsCardsLayouts/Cards/InfoCards/DefaultInfoCard";
import ComplexStatisticsCard from "../../../CompanyDashboardChartsCardsLayouts/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";
import WebIcon from '@mui/icons-material/Web';
import DescriptionIcon from '@mui/icons-material/Description';
import MailIcon from '@mui/icons-material/Mail';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import FNOLClaimsView from "../BatchClaimsDashboard/FNOLClaimsView";
import EmailtoFNOLClaimsView from "../BatchClaimsDashboard/EmailtoFNOLClaimsView";
import IDPFNOLClaimsView from "../BatchClaimsDashboard/IDPFNOLClaimsView";
import InsurAIClaimsView from "../BatchClaimsDashboard/InsurAIClaimsView";
import ClaimsChannelsCard from "../../../InsurAdminNewUIModificationsComponents/ClaimsChannelsCard";

function ClaimsDashboard() {
  const [clickedCard, setClickedCard] = useState("");
  const [claims, setClaims] = useState([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  const [processCount, setProcessCount] = useState({ success: 0, failure: 0, editedSuccess: 0 });
  const [mailClaims, setMailClaims] = useState({ success: [], failure: [], editedSuccess: [] });
  const [claimsData, setClaimsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const company = JSON.parse(localStorage.getItem("carrier_admin_company"));
  const ic_id = localStorage.getItem('ic_id_for_dashboard')
  const ic_name = localStorage.getItem('ic_name_for_dashboard');
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
          'get_all_claims_details/',
          formData
        );
        const transformedData = transformAPIData(response.data);
        setClaimsData(transformedData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch claims data");
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Function to transform API response to match your chart data format
  const transformAPIData = (apiData) => {
    return {
      totalClaimsByYear: {
        labels: Object.keys(apiData.total_claims_per_year),
        datasets: {
          label: "Total Claims",
          data: Object.values(apiData.total_claims_per_year),
        },
      },
      Claims_Count_by_Channel: {
        SmartClaim_Portal: apiData.claims_by_channel.FNOL,
        DocAI_Claim: apiData.claims_by_channel.IDP,
        Ivan: apiData.claims_by_channel.IVAN,
        Mail2Claim: apiData.claims_by_channel.Mail2Claim
      },
      channelDataForClaims: {
        labels: Object.keys(apiData.No_of_claims_by_channel),
        datasets: {
          label: "Claims",
          data: Object.values(apiData.No_of_claims_by_channel),
          backgroundColor: ["#003870", "#0A579E", "#1578CF", "#77C2FE"],
        },
        cutout: 105,
      },
      emailtoFnolClaimsStatus: {
        labels: ["Success", "Failed", "Success by Touch"],
        datasets: {
          label: "Claims",
          data: [apiData.success_and_failure_claims.success_claims,
          apiData.success_and_failure_claims.failure_claims,
            0],
          backgroundColor: ["#008080", "#00D4D4", "#00A8A8"],
        },
        cutout: 105,
      },
      claims_by_status: {
        labels: ["Submitted", "In Review", "Approved", "Denied", "Pending", "Closed"],
        datasets: {
          label: "Claims",
          data: [0, 0, 0, 0, 0, apiData.No_of_Claims],
          backgroundColor: [
            "#2D1B4E", "#412B6E", "#553B8E", "#694BAE", "#7D5BCE", "#916BEE"
          ],
        },
        cutout: 100,
      },
      // Add percentage_claims_increase here:
      percentage_claims_increase: apiData.percentage_claims_increase,
      dashboardSummary: {
        Total_claims: apiData.No_of_Claims,
        Success_and_Failure_Claims: apiData.success_and_failure_claims,
        Claims_by_H0_Category: {
          labels: ["HO-1", "HO-2", "HO-3", "HO-4", "HO-5", "HO-6", "HO-7", "HO-8"],
          datasets: [
            {
              label: "Total Claims",
              data: Object.values(apiData.claims_by_HO),
              color: "dark",
            },
          ],
        },
        claims_per_month_ongoing_year: [
          {
            name: "Claims",
            data: Object.values(apiData.total_claims_per_month),
          },
        ],
      },
    };
  };

  const onCardClick = (clickedCardName) => {
    setClickedCard(clickedCardName === clickedCard ? "" : clickedCardName);
  };

  const fetchChannelClaims = async (channel) => {
    setIsLoadingClaims(true);
    try {
      const company = JSON.parse(localStorage.getItem("carrier_admin_company"));
      const ic_id = localStorage.getItem("ic_id_for_dashboard")
      const formData = new FormData();
      formData.append("ic_id", ic_id || company.ic_id);
      formData.append("channel", channel);
      const response = await axiosInstance.post(
        'get_all_channels_claims/',
        formData
      );
      const claimsArray = Object.values(response.data.claims_details);
      setClaims(claimsArray);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  const handleFetchClaims = async () => {
    setIsLoadingClaims(true);
    try {
      const response = await axiosInstance.post('get_email_to_fnol_claims/');
      setMailClaims({
        success: Object.values(response.data.success_data),
        failure: Object.values(response.data.failure_data),
        editedSuccess: Object.values(response.data.edited_success_data),
      });
      setProcessCount({
        success: response.data.no_of_success_mails,
        failure: response.data.no_of_failure_mails,
        editedSuccess: response.data.no_of_edited_success_mails,
      });
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  const handleCloseSuccessPopupToGetUpdatedClaims = () => {
    handleFetchClaims();
  };

  useEffect(() => {
    if (clickedCard === "SmartClaim Portal") {
      fetchChannelClaims("FNOL");
    } else if (clickedCard === "DocAI™ Claim") {
      fetchChannelClaims("IDP");
    } else if (clickedCard === "IVAN") {
      fetchChannelClaims("InsurAI");
    } else if (clickedCard === "Mail2Claim") {
      handleFetchClaims();
    }
    // eslint-disable-next-line
  }, [clickedCard]);

  const RenderTableByChannelname = () => {
    if (isLoadingClaims) {
      return <div>Loading, please wait...</div>;
    }
    switch (clickedCard) {
      case "SmartClaim Portal":
        return <FNOLClaimsView claimsData={claims} setClickedCard={setClickedCard} />;
      case "DocAI™ Claim":
        return <IDPFNOLClaimsView claimsData={claims} setClickedCard={setClickedCard} />;
      case "IVAN":
        return <InsurAIClaimsView claimsData={claims} setClickedCard={setClickedCard} />;
      case "Mail2Claim":
        return (
          <EmailtoFNOLClaimsView
            claimsData={mailClaims}
            setClickedCard={setClickedCard}
            processCount={processCount}
            onClose={handleCloseSuccessPopupToGetUpdatedClaims}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Claims - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Loading claims data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Claims - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Error: {error}</div>
      </DashboardLayout>
    );
  }
  const {
    totalClaimsByYear,
    Claims_Count_by_Channel,
    channelDataForClaims,
    emailtoFnolClaimsStatus,
    dashboardSummary,
  } = claimsData;

  return (
    <DashboardLayout>
      <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Claims - {ic_name}</MDTypography>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#f8fafc", padding: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} xl={12} md={12}>
                  <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.3rem" }} >Claims - Channels</MDTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <ClaimsChannelsCard
                    title="SmartClaim Portal"
                    type="Claims"
                     icon={WebIcon}
                    ColorUI="warning"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Claims_Count_by_Channel.SmartClaim_Portal}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <ClaimsChannelsCard
                    title="DocAI™ Claim"
                    type="Claims"
                     icon={DescriptionIcon}
                    ColorUI="primary"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Claims_Count_by_Channel.DocAI_Claim}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <ClaimsChannelsCard
                    title="IVAN"
                    type="Claims"
                     icon={SmartToyOutlinedIcon}
                    ColorUI="secondary"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Claims_Count_by_Channel.Ivan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <ClaimsChannelsCard
                    title="Mail2Claim"
                    type="Claims"
                     icon={MailIcon}
                    ColorUI="customyellow"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Claims_Count_by_Channel.Mail2Claim}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  {RenderTableByChannelname()}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#f8fafc", padding: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} xl={12} md={12}>
                  <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.3rem" }} >Claims - Analytics</MDTypography>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <MDBox mb={1.5} mt={3.5}>
                    <ComplexStatisticsCard
                      color="info"
                      icon="monetization_on"
                      title="Total Claims"
                      count={claimsData?.dashboardSummary?.Total_claims}
                      percentage={{
                        color: claimsData?.percentage_claims_increase >= 0 ? 'success' : 'error',
                        amount: `${Math.trunc(claimsData?.percentage_claims_increase)}%`,
                        label: "than last month",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={1.8} xl={3}>
                  <DefaultInfoCard
                    icon="check_circle"
                    title="Total Success Claims"
                    value={
                      claimsData?.dashboardSummary?.Success_and_Failure_Claims
                        ?.success_claims
                    }
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} md={1.8} xl={3}>
                  <DefaultInfoCard
                    icon="cancel"
                    title={
                      <div>
                        <span>Total Failure Claims</span>
                        <br />
                        <br />
                      </div>
                    }
                    value={
                      claimsData?.dashboardSummary?.Success_and_Failure_Claims
                        ?.failure_claims
                    }
                    color="error"
                  />
                </Grid>
                <Grid item xs={12} md={1.8} xl={3}>
                  <DefaultInfoCard
                    icon="task_alt"
                    title="Total Edited Success Claims"
                    value="120"
                    color="primary"
                  />
                </Grid>
                <MDBox mt={6.5}>
                  <Grid container spacing={3} sx={{ paddingLeft: "0.8rem" }}>
                    <Grid item xs={12} md={5} lg={5}>
                      <MDBox mb={3}>
                        <DefaultDoughnutChart
                          icon={{ color: "info", component: "pie_chart" }}
                          title="Total Claims by Channel"
                          height="20rem"
                          chart={channelDataForClaims}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={7} lg={7}>
                      <MDBox mb={3} mt={2}>
                        <ReportsBarChart
                          color="info"
                          title="Total Claims"
                          description="Per each year"
                          chart={totalClaimsByYear}
                          height="20.2rem"
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                      <MDBox mb={3}>
                        <DefaultDoughnutChart
                          icon={{ color: "secondary", component: "pie_chart" }}
                          title="Processed Claims status by Channels"
                          height="20rem"
                          chart={emailtoFnolClaimsStatus}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={7} lg={7}>
                      <MDBox mb={3}>
                        <VerticalBarChart
                          icon={{ color: "info", component: "trending_up" }}
                          title="Total claims by HO Category"
                          description=""
                          height="20.5rem"
                          chart={dashboardSummary.Claims_by_H0_Category}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} lg={12} xl={12} md={12}>
                      <Card style={{ padding: "20px" }}>
                        <VuiBox sx={{ height: "100%" }}>
                          <VuiTypography variant="lg" color="#010066" fontWeight="bold" mt="55px">
                            Total Claims per Month of Ongoing Year
                          </VuiTypography>
                          <VuiBox sx={{ height: "310px" }}>
                            <LineChart
                              lineChartData={dashboardSummary.claims_per_month_ongoing_year}
                              lineChartOptions={lineChartOptionsDashboard}
                            />
                          </VuiBox>
                        </VuiBox>
                      </Card>
                    </Grid>
                  </Grid>
                </MDBox>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ClaimsDashboard;
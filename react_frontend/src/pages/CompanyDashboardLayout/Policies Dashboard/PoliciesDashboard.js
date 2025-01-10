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
import ReportsLineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../../CompanyDashboardChartsCardsLayouts/Cards/StatisticsCards/ComplexStatisticsCard";
import VerticalBarChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/BarCharts/VerticalBarChart";
import LineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/LineChart";
import { lineChartOptionsDashboard } from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/lineChartOptions";
import axios from "axios";
import WebIcon from '@mui/icons-material/Web';
import DescriptionIcon from '@mui/icons-material/Description';
import MailIcon from '@mui/icons-material/Mail';
import ClaimsChannelsCard from "../../../InsurAdminNewUIModificationsComponents/ClaimsChannelsCard";
import SmartQuotesView from "../BatchPolicyDashboard/SmartQuotesView";
import DocAIQuotesView from "../BatchPolicyDashboard/DocAIQuotesView";
import Mail2QuotesView from "../BatchPolicyDashboard/Mail2QuotesView";
import BatchCard from "../../../InsurAdminNewUIModificationsComponents/UIComponents-NewDashbaordUI/BatchCard";
import { DocAI_Quote_stepsData } from "../../../InsurAdminNewUIModificationsComponents/UIComponents-NewDashbaordUI/BatchProcessStepsData";

function PoliciesDashboard() {
  const [clickedCard, setClickedCard] = useState("");
  const [policies, setPolicies] = useState([]);
  const [policiesData, setPoliciesData] = useState(null);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [mail2Quotes, setMail2Quotes] = useState({ success: [], failure: [], editedSuccess: [] });
  const [mail2QuotesCount, setMail2QuotesCount] = useState({ success: 0, failure: 0, editedSuccess: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const company = JSON.parse(localStorage.getItem("carrier_admin_company"));
  const companyId = company ? company.ic_id : null;
  const ic_id = localStorage.getItem("ic_id_for_dashboard")
  const ic_name = localStorage.getItem("ic_name_for_dashboard")
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append("ic_id", ic_id || companyId);
        const response = await axiosInstance.post(
          'get_all_policy_details/',
          formData
        );
        const transformedData = transformAPIData(response.data);
        setPoliciesData(transformedData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch policies data");
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [ic_id, companyId]);

  const transformAPIData = (apiData) => {
    return {
      premiumAmountByYear: {
        labels: Object.keys(apiData.premium_by_year),
        datasets: {
          label: "Premium Amount",
          data: Object.values(apiData.premium_by_year),
        },
      },
      Count_of_Channels_Quotes: {
        SmartQuote_Portal: apiData.quote_counts.SmartQuote_Portal,
        DocAI_Quote: apiData.quote_counts.DocAI_Quote,
        Mail2Quote: apiData.quote_counts.Mail2Quote
      },
      dashboardSummary: {
        Total_Premium: `$${apiData["Total_Premium"]}`,
        policies: apiData.Total_policies,
        activePolicies: apiData.active_policies,
        activePremium: `$${apiData["active_policies_premium"]}`,
        policies_percentage: apiData.percentage_changes.policies,
        active_policies_percentage: apiData.percentage_changes.active_policies,
        active_premium_percentage: apiData.percentage_changes.active_premium,
        premium_percentage: apiData.percentage_changes.premium,
        policies_per_month_ongoing_year: [
          {
            name: "Policies",
            data: Object.values(apiData.monthly_policies),
          },
        ],
        premium_per_month_ongoing_year: [
          {
            name: "Premium",
            data: Object.values(apiData.monthly_premium),
          },
        ],
        Premium_by_H0_Category: {
          labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
          datasets: {
            label: "Premium Amount",
            data: Object.values(apiData.Premium_by_type),
          },
        },
        Policies_by_H0_Category: {
          labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
          datasets: [
            {
              label: "Total Policies",
              data: Object.values(apiData.No_of_policies_by_HO),
            },
          ],
        },
      },
    };
  };

  const onCardClick = (clickedCardName) => {
    setClickedCard(clickedCardName === clickedCard ? "" : clickedCardName);
  };

  const fetchChannelPolicies = async (channel) => {
    setIsLoadingPolicies(true);
    try {
      const formData = new FormData();
      formData.append("ic_id", ic_id || company.ic_id);
      formData.append("channel", channel);

      const response = await axiosInstance.post(
        'Policy/get_quotes_by_channel/',
        formData
      );
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setIsLoadingPolicies(false);
    }
  };

  const handleFetchMail2QuotePolicies = async () => {
    setIsLoadingPolicies(true);
    try {
      const formData = new FormData();
      formData.append("ic_id", ic_id || company.ic_id);
      const response = await axiosInstance.post(
        'Policy/get_mail2quote_quotes/', formData
      );
      setMail2Quotes({
        success: Object.values(response.data.success_data),
        editedSuccess: Object.values(response.data.edited_success_data),
        failure: Object.values(response.data.failure_data),
      });
      setMail2QuotesCount({
        success: response.data.no_of_success_mails,
        editedSuccess: response.data.no_of_edited_success_mails,
        failure: response.data.no_of_failure_mails,
      });
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setIsLoadingPolicies(false);
    }
  };
  const handleCloseSuccessPopupToGetUpdatedQuotes = () => {
    handleFetchMail2QuotePolicies();
  };

  useEffect(() => {
    if (clickedCard === "SmartQuote Portal") {
      fetchChannelPolicies("SmartQuote Portal");
    } else if (clickedCard === "DocAI™ Quote") {
      fetchChannelPolicies("DocAI Quote");
    } else if (clickedCard === "Mail2Quote") {
      handleFetchMail2QuotePolicies();
    }
    // eslint-disable-next-line
  }, [clickedCard]);

  const RenderTableByChannelname = () => {
    if (isLoadingPolicies) {
      return <div>Loading, please wait...</div>;
    }
    switch (clickedCard) {
      case "SmartQuote Portal":
        return <SmartQuotesView policiesData={policies} setClickedCard={setClickedCard} />;
      case "DocAI™ Quote":
        return <DocAIQuotesView policiesData={policies} setClickedCard={setClickedCard} />;
      case "Mail2Quote":
        return <Mail2QuotesView
          mail2QuotesData={mail2Quotes}
          setClickedCard={setClickedCard}
          mail2QuotesCount={mail2QuotesCount}
          onClose={handleCloseSuccessPopupToGetUpdatedQuotes}
        />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Policies - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Loading policies data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Policies - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Error: {error}</div>
      </DashboardLayout>
    );
  }
  const {
    premiumAmountByYear, Count_of_Channels_Quotes,
    dashboardSummary } = policiesData;

  return (
    <DashboardLayout>
      <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Policies - {ic_name}</MDTypography>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#f8fafc", padding: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} xl={12} md={12}>
                  <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.3rem" }} >Policies - Channels</MDTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <ClaimsChannelsCard
                    title="SmartQuote Portal"
                    type="Policies"
                    icon={WebIcon}
                    ColorUI="secondary"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Count_of_Channels_Quotes.SmartQuote_Portal}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <ClaimsChannelsCard
                    title="DocAI™ Quote"
                    type="Policies"
                    icon={DescriptionIcon}
                    ColorUI="warning"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Count_of_Channels_Quotes.DocAI_Quote}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <ClaimsChannelsCard
                    title="Mail2Quote"
                    type="Policies"
                    icon={MailIcon}
                    ColorUI="primary"
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                    onCardClick={onCardClick}
                    Count={Count_of_Channels_Quotes.Mail2Quote}
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
                  <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.3rem" }} >Policies - Batch Processes</MDTypography>
                </Grid>
                <Grid item xs={12} lg={12} xl={12} md={12}>
                  <BatchCard
                    heading="DocAI™ Quote Batch Process"
                    steps={DocAI_Quote_stepsData}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#f8fafc", padding: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} xl={12} md={12}>
                  <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.3rem" }} >Policies - Analytics</MDTypography>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={3}>
                    <ComplexStatisticsCard
                      color="dark"
                      icon="description"
                      title="Total Policies"
                      count={dashboardSummary.policies}
                      percentage={{
                        color: dashboardSummary.policies_percentage >= 0 ? 'success' : 'error',
                        amount: `${Math.trunc(dashboardSummary.policies_percentage)}%`,
                        label: "than last month",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={3}>
                    <ComplexStatisticsCard
                      color="success"
                      icon="monetization_on"
                      title="Total Premium Amount"
                      count={dashboardSummary.Total_Premium}
                      percentage={{
                        color: dashboardSummary.premium_percentage >= 0 ? 'success' : 'error',
                        amount: `${Math.trunc(dashboardSummary.premium_percentage)}%`,
                        label: "than last month",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={3}>
                    <ComplexStatisticsCard
                      color="info"
                      icon="description"
                      title="Total Active Policies"
                      count={dashboardSummary.activePolicies}
                      percentage={{
                        color: dashboardSummary.active_policies_percentage >= 0 ? 'success' : 'error',
                        amount: `${Math.trunc(dashboardSummary.active_policies_percentage)}%`,
                        label: "than last month",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={3}>
                    <ComplexStatisticsCard
                      color="info"
                      icon="monetization_on"
                      title="Active Premium Amount"
                      count={dashboardSummary.activePremium}
                      percentage={{
                        color: dashboardSummary.active_premium_percentage >= 0 ? 'success' : 'error',
                        amount: `${Math.trunc(dashboardSummary.active_premium_percentage)}%`,
                        label: "than last month",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid container spacing={3} marginTop={6} paddingLeft={3}>
                  <Grid item xs={12} md={6} lg={6}>
                    <MDBox mb={3}>
                      <ReportsBarChart
                        color="success"
                        title="Premium Amount"
                        description="Per each year"
                        chart={premiumAmountByYear}
                        height="21.2rem"
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <MDBox mb={3}>
                      <VerticalBarChart
                        icon={{ color: "info", component: "trending_up" }}
                        title="Total Policies by HO Category"
                        description=""
                        height="20.5rem"
                        chart={dashboardSummary.Policies_by_H0_Category}
                      />
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid container spacing={3} marginTop={4} paddingLeft={3}>
                  <Grid item xs={12} lg={6} xl={6} md={6}>
                    <Card style={{ padding: "20px" }}>
                      <VuiBox sx={{ height: "100%" }}>
                        <VuiTypography variant="lg" color="#010066" fontWeight="bold">
                          Total Policies per Month of Ongoing Year
                        </VuiTypography>
                        <VuiBox sx={{ height: "320px" }}>
                          <LineChart
                            lineChartData={dashboardSummary.policies_per_month_ongoing_year}
                            lineChartOptions={lineChartOptionsDashboard}
                          />
                        </VuiBox>
                      </VuiBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <MDBox mb={3}>
                      <ReportsLineChart
                        color="info"
                        title="Premium amount by HO Category"
                        description="Home Owners (H01 ... H08)"
                        date="just updated"
                        chart={dashboardSummary.Premium_by_H0_Category}
                        height="20.2rem"
                      />
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid container spacing={3} marginTop={4} paddingLeft={3}>
                  <Grid item xs={12} lg={12} xl={12} md={12}>
                    <Card style={{ padding: "20px" }}>
                      <VuiBox sx={{ height: "100%" }}>
                        <VuiTypography variant="lg" color="#010066" fontWeight="bold" mt="55px">
                          Total Premium per Month of Ongoing Year
                        </VuiTypography>
                        <VuiBox sx={{ height: "310px" }}>
                          <LineChart
                            lineChartData={dashboardSummary.premium_per_month_ongoing_year}
                            lineChartOptions={lineChartOptionsDashboard}
                          />
                        </VuiBox>
                      </VuiBox>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default PoliciesDashboard;

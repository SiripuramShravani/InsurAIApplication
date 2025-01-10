import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import VuiBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox"
import VuiTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiTypography";
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import DashboardLayout from "../../../CompanyDashboardChartsCardsLayouts/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../CompanyDashboardChartsCardsLayouts/Navbars/DashboardNavbar";
import ReportsBarChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts/ReportsLineChart";
import ProgressLineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts/ProgressLineChart";
import ComplexStatisticsCard from "../../../CompanyDashboardChartsCardsLayouts/Cards/StatisticsCards/ComplexStatisticsCard";
import DefaultDoughnutChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/DoughnutCharts/DefaultDoughnutChart";
import VerticalBarChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/BarCharts/VerticalBarChart";
import LineChart from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/LineChart";
import { lineChartOptionsDashboard } from "../../../CompanyDashboardChartsCardsLayouts/Charts/LineCharts copy/lineChartOptions";
import axios from "axios";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const company = JSON.parse(localStorage.getItem('carrier_admin_company'));
  const ic_id = localStorage.getItem('ic_id_for_dashboard')
  const ic_name = localStorage.getItem('ic_name_for_dashboard')
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('ic_id', ic_id || company.ic_id);
        const response = await axiosInstance.post('get_all_details/', formData);
        const transformedData = transformAPIData(response.data);
        setDashboardData(transformedData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const transformAPIData = (apiData) => {
    return {
      premiumAmountByYear: {
        labels: Object.keys(apiData.Premium_by_Year),
        datasets: {
          label: "Premium Amount",
          data: Object.values(apiData.Premium_by_Year),
        },
      },
      channelData: {
        labels: ["FNOL", "DocAI Claim", "Email To FNOL", "AI AGENT"],
        datasets: {
          label: "Claims",
          data: Object.values(apiData.Channels),
          backgroundColor: ["#ff005a", "#130e49", "#F7DC6F", "#F39C12"],
        },
        cutout: 100,
      },
      dashboardSummary: {
        Total_Premium: `$${apiData["Total Premium"]}`,
        premium_increase: apiData.percentage_increases.premium_increase, // Add this
        policies: apiData.policies,
        policies_increase: apiData.percentage_increases.policies_increase, // Add this
        Total_claims: apiData.Total_claims,
        claims_increase: apiData.percentage_increases.claims_increase,   // Add this
        Success_and_Failure_Claims: apiData.Success_and_Failure_Claims,
        monthlyPremium: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: {
            label: "Monthly Premium",
            data: Object.values(apiData.monthly_premium),
          },
        },
        Premium_by_H0_Category: {
          labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
          datasets: {
            label: "Premium Amount",
            data: Object.values(apiData.Premium_by_H0_Category),
          },
        },
        Policies_by_H0_Category: {
          labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
          data: Object.values(apiData.Policy_Types),
        },
        Claims_by_H0_Category: {
          labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
          datasets: [
            {
              label: "Total Claims",
              data: Object.values(apiData.Total_claims_by_H0_Category),
              color: "dark",
            },
          ],
        },
        policies_claims_per_month_ongoing_year: [
          {
            name: "Policies",
            data: Object.values(apiData.Monthly_Policies),
          },
          {
            name: "Claims",
            data: Object.values(apiData.Monthly_Claims),
          },
        ],

      },
    };
  };
  if (isLoading) {
    return (
      <DashboardLayout>
        <MDTypography style={{color:"#0B70FF", textAlign:"left", fontWeight:"bold", fontSize:"1.5rem"}} >Dashboard - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Loading dashboard data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <MDTypography style={{color:"#0B70FF", textAlign:"left", fontWeight:"bold", fontSize:"1.5rem"}} >Dashboard - {ic_name}</MDTypography>
        <DashboardNavbar />
        <div>Error: {error}</div>
      </DashboardLayout>
    );
  }
  // Access transformed data directly from dashboardData 
  const {
    premiumAmountByYear,
    channelData,
    dashboardSummary
  } = dashboardData;

  

  return (
    <DashboardLayout>
      <MDTypography style={{color:"#0B70FF", textAlign:"left", fontWeight:"bold", fontSize:"1.5rem"}} >Dashboard - {ic_name}</MDTypography>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="description" // Updated icon for Total Claims
                title="Total Policies"
                count={dashboardSummary.policies}
                percentage={{
                  color: dashboardSummary.policies_increase >= 0 ? "success" : "error", // Dynamic color based on increase/decrease
                  amount: `${Math.trunc(dashboardSummary.policies_increase)}%`,
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="policy"
                title="Total Claims"
                count={dashboardSummary.Total_claims}
                percentage={{
                  color: dashboardSummary.claims_increase >= 0 ? "success" : "error",
                  amount: `${Math.trunc(dashboardSummary.claims_increase)}%`,
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="monetization_on" // Updated icon for Premium Amount
                title="Premium Amount"
                count={dashboardSummary.Total_Premium}
                percentage={{
                  color: dashboardSummary.premium_increase >= 0 ? "success" : "error",
                  amount: `${Math.trunc(dashboardSummary.premium_increase)}%`,
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="monetization_on"
                title="Claim Amount"
                count="$12k"
                percentage={{
                  color: "success",
                  amount: "-1%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid> */}
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Premium Amount"
                  description="Per each year"
                  chart={premiumAmountByYear}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Premium Amount Per Month"
                  description={
                    <>
                      (<strong>2024</strong>) Ongoing year monthly premium.
                    </>
                  }
                  // date="updated 4 min ago"
                  chart={dashboardSummary.monthlyPremium}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Premium amount by HO Category"
                  description="Home Owners (H01 ... H08)"
                  date="just updated"
                  chart={dashboardSummary.Premium_by_H0_Category}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <MDBox mb={3}>
                <DefaultDoughnutChart
                  icon={{ color: "info", component: "pie_chart" }}
                  title="Total Claims by Channel"
                  height="20rem"
                  chart={channelData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <MDBox mb={3}>
                <ProgressLineChart
                  color="info" // Color of the chart (optional, defaults to "info")
                  icon="policy" // Icon to be displayed (required)
                  title="Total Policies by HO Category"
                  height="20.5rem"
                  chart={dashboardSummary.Policies_by_H0_Category} // The chart data (required)
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <MDBox mb={3}>
                <VerticalBarChart
                  icon={{ color: "info", component: "trending_up" }}
                  title="Total Claims by HO Category"
                  description=""
                  height="20.5rem"
                  chart={dashboardSummary.Claims_by_H0_Category}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="policy" // Updated icon for Total Claims
                  title="Total Success Claims"
                  count={dashboardSummary.Success_and_Failure_Claims.success_claims}
                // percentage={{
                //   color: "success",
                //   amount: "+10%",
                //   label: "than last year",
                // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="error"
                  icon="policy"
                  title="Total Failure Claims"
                  count={dashboardSummary.Success_and_Failure_Claims.failure_claims}
                // percentage={{
                //   color: "success",
                //   amount: "+3%",
                //   label: "than last year",
                // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="info"
                  icon="policy" // Updated icon for Premium Amount
                  title="Total Edited Success Claims"
                  count={dashboardSummary.Success_and_Failure_Claims.success_edited_claims}
                // percentage={{
                //   color: "success",
                //   amount: "+2%",
                //   label: "than last month",
                // }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12} xl={12} md={12}>
              <Card style={{ padding: "20px" }}>
                <VuiBox sx={{ height: "100%" }}>
                  <VuiTypography variant="lg" color="#010066" fontWeight="bold" mt="55px">
                    Total Policies & Claims per month for ongoing Year
                  </VuiTypography>
                  <VuiBox sx={{ height: "310px" }}>
                    <LineChart
                      lineChartData={dashboardSummary.policies_claims_per_month_ongoing_year}
                      lineChartOptions={lineChartOptionsDashboard}
                    />
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;

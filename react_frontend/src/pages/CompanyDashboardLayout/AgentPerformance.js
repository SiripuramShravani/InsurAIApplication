import React, { useState, useEffect } from "react";
import axios from "axios";
import PerformanceChartContainer from "./tables copy/agentsDashboard";
import MDTypography from "../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import VuiBox from "../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox";
import DashboardNavbar from "../../CompanyDashboardChartsCardsLayouts/Navbars/DashboardNavbar";
import DashboardLayout from "../../CompanyDashboardChartsCardsLayouts/LayoutContainers/DashboardLayout";


const AgentPerformance = () => {
    const [performanceData, setPerformanceData] = useState(null); // Add state for performance data
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
      });
    // useEffect to fetch performance data when selectedAgentID changes
    const selectedAgentID = localStorage.getItem("selectedAgentIDinDashboard");
    useEffect(() => {
        const fetchPerformanceData = async () => {
            if (selectedAgentID) {
                try {
                    const formData = new FormData();
                    formData.append("agent_id", selectedAgentID);
                    const response = await axiosInstance.post('get_agent_stats/',formData);
                    setPerformanceData(response.data);
                } catch (err) {
                    console.error("Error fetching performance data:", err);
                    setError("Failed to fetch policies data");
                } finally {
                    setIsLoading(false); // Set loading to false after data fetch or error
                }
            }
        };

        fetchPerformanceData();
    }, [selectedAgentID]);

    console.log("performnce of agent", performanceData);

    const transformPerformanceData = (apiData) => {
        console.log("data", apiData);
        console.log("check", apiData.Total_No_of_policies_sold);
        if (apiData) {
            return {
                totalPolicies: apiData.Total_No_of_policies_sold,
                totalClaims: apiData.Total_No_of_claims,
                activePolicies: apiData.active_policies,
                policiesByHO: apiData.No_of_policies_by_HO,
                claimsByChannel: apiData.claims_by_channels,
                claimsByHO: apiData.claims_by_HO,
                agentDetails: apiData.agent_details,
                percentageIncreases: apiData.percentage_increases,
                agentPolicies: apiData.policy_details,
                agentClaims: apiData.claim_details,
            };
        } else {
            return {};
        }
    };

    if (isLoading) { // Render a loading message while data is being fetched
        return (
            <DashboardLayout>
                <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agent Performance</MDTypography>
                <DashboardNavbar />
                <div>Loading agent {selectedAgentID} data...</div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agent Performance</MDTypography>
                <DashboardNavbar />
                <div>Error: {error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <MDTypography style={{ color: "#0B70FF", textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }} >Agent Performance</MDTypography>
            <DashboardNavbar />
            <VuiBox py={3}>
                {performanceData ? ( // Conditionally render PerformanceChartContainer
                    <PerformanceChartContainer
                        performanceData={transformPerformanceData(performanceData)}
                        selectedAgentID={selectedAgentID}
                    />
                ) : (
                    <div>No performance data available.</div> // Message if no data
                )}
            </VuiBox>
        </DashboardLayout>
    );
};

export default AgentPerformance;
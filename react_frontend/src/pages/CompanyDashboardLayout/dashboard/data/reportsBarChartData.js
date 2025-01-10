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

export default {
  sampleChartData: {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
  },
  premiumAmountByYear: {
    labels: [2020, 2021, 2022, 2023],
    datasets: {
      label: "Premium Amount",
      data: [3500000, 4200000, 4800000, 5500000],
    },
  },
  totalClaimsByYear: {
    labels: [2020, 2021, 2022, 2023],
    datasets: {
      label: "Total Claims",
      data: [350, 420, 480, 550],
    },
  },
  dashboardSummary: {
    Total_Premium: "$15,130,000",
    policies: 650,
    Total_claims: 560,
    Success_and_Failure_Claims: {
      success_claims: 450,
      failure_claims: 110,
      success_edited_claims: 20,
    },
    policies_claims_per_month_ongoing_year: [
      {
        name: "Policies",
        data: [500, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
      },
      {
        name: "Claims",
        data: [200, 230, 300, 350, 370, 420, 550, 350, 400, 500, 330, 550],
      },
    ],
    claims_per_month_ongoing_year: [
      {
        name: "Claims",
        data: [500, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
      },
    ],
    policies_per_month_ongoing_year: [
      {
        name: "Policies",
        data: [500, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
      },
    ],
    premium_per_month_ongoing_year: [
      {
        name: "Premium",
        data: [20000, 23000, 30000, 35000, 37000, 42000, 55000, 35000, 40000, 50000, 33000, 55000],
      },
    ],
    policies_claims_per_HO_by_agent: [
      {
        name: "Policies",
        data: [500, 250, 300, 220, 500, 250, 300, 230],
      },
      {
        name: "Claims",
        data: [200, 230, 300, 350, 370, 420, 550, 350],
      },
    ],
    monthlyPremium: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: {
        label: "Monthly Premium",
        data: [
          1200000, 1500000, 1800000, 1000000, 1500000, 1900000, 1700000, 1400000, 2000000, 2500000,
          2200000, 1800000,
        ],
      },
    },
    Channels: {
      labels: ["FNOL", "IDP_FNOL", "Email-To-FNOL", "AI_AGENT"],
      datasets: {
        label: "Channels",
        data: [30, 25, 15, 10],
      },
    },
    Premium_by_H0_Category: {
      labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
      datasets: {
        label: "Premium Amount",
        data: [3000000, 2500000, 4000000, 1500000, 2800000, 1200000, 1800000, 1000000],
      },
    },
    Policies_by_H0_Category: {
      labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
      data: [100, 250, 400, 150, 280, 120, 180, 100],
    },
    Claims_by_H0_Category: {
      labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
      datasets: [
        {
          label: "Total Claims",
          data: [3, 25, 40, 15, 28, 12, 18, 10],
          color: "dark", // Use a color key from your "colors" object
        },
      ],
    },
  },
  monthData: {
    labels: [
      "2023-01",
      "2023-02",
      "2023-03",
      "2023-04",
      "2023-05",
      "2023-06",
      "2023-07",
      "2023-08",
      "2023-09",
      "2023-10",
      "2023-11",
      "2023-12",
    ],
    datasets: [
      {
        label: "Premium Amount",
        data: [
          800000, 950000, 780000, 1100000, 920000, 1050000, 880000, 1200000, 960000, 1080000,
          900000, 1150000,
        ],
      },
    ],
  },
  channelData: {
    labels: ["FNOL", "DocAI Claim", "Email To FNOL", "AI AGENT"],
    datasets: {
      label: "Claims",
      data: [30, 25, 15, 10],
      backgroundColor: ["#ff005a", "#130e49", "#F7DC6F", "#F39C12"],
    },
    cutout: 100,
  },
  policies_by_status: {
    labels: ["New/Quoted", "Issued", "Expired", "Renewed", "Denied", "Cancelled"],
    datasets: {
      label: "Policies",
      data: [200, 1500, 500, 800, 100, 50],
      backgroundColor: [
        "#97A1D9", // New/Quoted
        "#6978C9", // Issued
        "#4A5596", // Expired
        "#2C3365", // Renewed
        "#111539", // Denied
        "#B0BEC5", // Cancelled
      ],
    },
    cutout: 100,
  },
  claims_by_status: {
    labels: ["Submitted", "In Review", "Approved", "Denied", "Pending", "Closed"],
    datasets: {
      label: "Claims",
      data: [120, 80, 150, 50, 30, 200],
      backgroundColor: [
        "#2D1B4E", // New/Quoted
        "#412B6E", // Issued
        "#553B8E", // Expired
        "#694BAE", // Renewed
        "#7D5BCE", // Denied
        "#916BEE", // Cancelled
      ],
    },
    cutout: 100,
  },
  channelDataForClaims: {
    labels: ["FNOL", "DocAI Claim", "Email To FNOL", "AI AGENT"],
    datasets: {
      label: "Claims",
      data: [30, 25, 15, 10],
      backgroundColor: ["#003870", "#0A579E", "#1578CF", "#77C2FE"],
    },
    cutout: 105,
  },
  emailtoFnolClaimsStatus: {
    labels: ["Success", "Failed", "Success by Touch"],
    datasets: {
      label: "Claims",
      data: [30, 25, 15],
      backgroundColor: ["#008080", "#00D4D4", "#00A8A8"],
    },
    cutout: 105,
  },
  channelDataForAgent: {
    labels: ["FNOL", "DocAI Claim", "Email To FNOL", "AI AGENT"],
    datasets: {
      label: "Claims",
      data: [30, 25, 15, 10],
      backgroundColor: ["#003870", "#1578CF", "#249CFF", "#77C2FE"],
    },
    cutout: 105,
  },
  hoCategoryClaimsData: {
    labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
    datasets: {
      label: "Claims",
      data: [120, 85, 150, 60, 95, 40, 70, 35],
    },
  },
  hoCategoryPoliciesData: {
    labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
    datasets: {
      label: "Policies",
      data: [200, 150, 250, 100, 180, 80, 120, 70],
    },
  },
  hoPremiumClaimData: {
    labels: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"],
    datasets: [
      {
        label: "Policy Premium",
        data: [3000000, 2500000, 4000000, 1500000, 2800000, 1200000, 1800000, 1000000],
      },
    ],
  },
  policiesClaimsTrendData: {
    labels: [
      "2023-01",
      "2023-02",
      "2023-03",
      "2023-04",
      "2023-05",
      "2023-06",
      "2023-07",
      "2023-08",
      "2023-09",
      "2023-10",
      "2023-11",
      "2023-12",
    ],
    datasets: [
      { label: "Policies", data: [150, 180, 160, 210, 190, 230, 200, 250, 220, 280, 240, 290] },
    ],
  },
};

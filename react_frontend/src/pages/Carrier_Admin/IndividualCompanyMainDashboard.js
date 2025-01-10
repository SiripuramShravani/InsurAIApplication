import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Paper, useTheme, useMediaQuery, } from '@mui/material';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector, BarChart, Bar, Brush, XAxis,YAxis, CartesianGrid,} from 'recharts';
import { Line } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import {
  AreaChart,
  Area,
} from 'recharts';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend as ChartLegend,
  Tooltip as ChartTooltip,
} from 'chart.js';
import axios from 'axios';
import moment from 'moment';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartLegend,
  ChartTooltip
);
// start of polices by status
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA0000",
  "#AA00FF",
];
const dataofTypesofPolicies = [
  { name: "New/Quoted", value: 100 },
  { name: "Issued", value: 200 },
  { name: "Expired", value: 400 },
  { name: "Renewed", value: 400 },
  { name: "Denied", value: 400 },
  { name: "Cancelled", value: 500 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 25) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 15;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={"0.7rem"}
        fontWeight={600}
      >{`${payload.name} `}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={"0.6rem"}
        fontWeight={550}
      >
        {`${value}(Policies)`}
      </text>
    </g>
  );
};
// end of policies by status

// start of claims by status
const StatusClaims = [
  { name: "New", value: 10 },
  { name: "Active", value: 35 },
  { name: "Closed", value: 40 },
  { name: "Denied", value: 15 },
];
const ClaimsCOLORS = ["#0088FE", "#00C49F", "#FFBB28", "#AA0000"];
// end of claims by status

// start claim and premium amount by trend
const policyClaimAmountByTrendData = [
  { name: "HO1", pp: 10000, ca: 5000 },
  { name: "HO2", pp: 15000, ca: 10000 },
  { name: "HO3", pp: 20000, ca: 5000 },
  { name: "HO4", pp: 20000, ca: 25000 },
  { name: "HO5", pp: 25000, ca: 30000 },
  { name: "HO6", pp: 30000, ca: 15000 },
  { name: "HO7", pp: 35000, ca: 20000 },
  { name: "HO8", pp: 40000, ca: 25000 },
];

const PpcaCustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Policy Premium: $${payload[0].value}`}</p>
        <p className="intro">{`Claim Amount: $${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};
// end of claim & premium amount by trend

// start of the total claims by ho category
const TotalpoliesclaimsbyHOCategoryCustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p className="label">{`${label}`}</p>

        {payload.map(
          (
            item,
            index // Map through payload items
          ) => (
            <p
              key={index}
              className="intro"
              style={{
                color: item.dataKey === "policies" ? "#8884d8" : "#82ca9d",
              }}
            >
              {`${item.dataKey === "policies" ? "Policies" : "Claims"}: ${item.value
                }`}
            </p>
          )
        )}
      </div>
    );
  }
  return null;
};
// end of the total claims by ho category 

// start of the Total Claims By Channel
 const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// end of Total Claims By Channel
 
const IndividualCompanyMainDashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [yearData, setYearData] = useState({ data: [] });
  const [monthData, setMonthData] = useState({ data: [] });
  const [channelData, setChannelData] = useState([]);
  const [selectedYearForMonth, setSelectedYearForMonth] = useState(new Date().getFullYear() - 1); // Default to previous year
  const [hoCategoryClaimsData, setHoCategoryClaimsData] = useState([]); // New state
  const [hoCategoryPoliciesData, setHoCategoryPoliciesData] = useState([]); // New state
  const [hoPremiumClaimData, setHoPremiumClaimData] = useState([]); // New state
  const [policiesClaimsTrendData, setPoliciesClaimsTrendData] = useState({
    x: [],
    policies: [],
    claims: []
  });
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const company = JSON.parse(localStorage.getItem('carrier_admin_company'));
        const formData = new FormData();
        formData.append('ic_id', company.ic_id);
        const response = await axiosInstance.post('get_all_details/', formData);
         localStorage.setItem("dashboard_data", JSON.stringify(response.data));
        const dataFromLocalStorage = JSON.parse(localStorage.getItem("dashboard_data"));
        setDashboardData(dataFromLocalStorage);

        const newYearData = {
          data: Object.entries(response.data.Premium_by_Year).map(([year, premiumAmount]) => ({
            year: parseInt(year),
            premium_amount: premiumAmount,
            claim_amount: response.data.Claim_Amount_Year_Wise?.[year] || 1000 // Assuming Claim_Amount_Year_Wise exists 
          }))
        };
        setYearData(newYearData);

        // Update monthData from API response 
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const newMonthData = {
          data: Object.entries(response.data.Monthly_Policies).map(([month, policyCount]) => ({
            month: `${previousYear}-${month.padStart(2, '0')}`,
            premium_amount: response.data.monthly_premium?.[month] || 0, // Use monthly_premium
            claim_amount: response.data.Monthly_Claims[month] || 1000
          }))
        };
        setMonthData(newMonthData);

        // Update channelData 
        const newChannelData = Object.entries(response.data.Channels).map(([name, value]) => ({
          name: name.replace(/_/g, " "), // Replace underscores with spaces for display
          value,
          color:
            name === 'FNOL' ? '#0088FE' :
              name === 'IDP_FNOL' ? '#00C49F' :
                name === 'Email-To-FNOL' ? '#FFBB28' :
                  name === 'AI_AGENT' ? '#FF8042' :
                    '#000000' // Default color
        }));
        setChannelData(newChannelData);

        // Update hoCategoryClaimsData
        const allHOCategories = ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08"];
        let claims = 0;
        const newHoCategoryClaimsData = allHOCategories.map(category => {
          claims = response.data.Total_claims_by_H0_Category[category] || 0;
          return { category, claims };
        });
        setHoCategoryClaimsData(newHoCategoryClaimsData);

        // Update hoCategoryPoliciesData
        const newHoCategoryPoliciesData = allHOCategories.map(category => ({
          category,
          policies: response.data.Total_policies_by_H0_Category[category] || 0
        }));
        setHoCategoryPoliciesData(newHoCategoryPoliciesData);

        const newHoPremiumClaimData = allHOCategories.map(category => ({
          name: category, // Use "name" to match the BarChart's dataKey
          pp: response.data.Premium_by_H0_Category[category] || 0,
          ca: 1000 // Default claim amount to 0
        }));
        setHoPremiumClaimData(newHoPremiumClaimData);      

        // Get latest year and update chart data
        const latestYear = Math.max(...Object.keys(response.data.Premium_by_Year).map(Number));
        setSelectedYear(latestYear.toString());

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log("dashboarddata api response", dashboardData);


  useEffect(() => {
     const updatePoliciesClaimsTrendData = async (year, month) => {
      try {
        if (!year) return; // Don't make API call if year is not selected
        const company = JSON.parse(localStorage.getItem('carrier_admin_company'));
        const formData = new FormData();
        formData.append('ic_id', company.ic_id);
        formData.append('year', year);
        formData.append('month', month);

        const response = await axiosInstance.post('get_count_by_year_and_month/', formData);
       console.log("response when selects year or month",response);
        // Process the API response 
        const chartData = { x: [], policies: [], claims: [] };
        if (month === "All") {
          chartData.x = Object.keys(response.data.monthly_polices_by_year).map(month =>
            `${year}-${month.padStart(2, '0')}`
          );
          chartData.policies = Object.values(response.data.monthly_polices_by_year);
          chartData.claims = Object.values(response.data.monthly_claims_by_year);
        } else {
          // If a specific month is selected
          const monthNumber = moment().month(month).format('M');
          chartData.x = [`${year}-${monthNumber.padStart(2, '0')}`];
          chartData.policies = [response.data.monthly_polices_by_year[monthNumber] || 0];
          chartData.claims = [response.data.monthly_claims_by_year[monthNumber] || 0];
        }
        setPoliciesClaimsTrendData(chartData);
      } catch (err) {
        console.error('Error fetching trend data:', err);        
      }
    };
    // Call the update function initially with the current year and "All" months
    updatePoliciesClaimsTrendData(selectedYear, selectedMonth);

  }, [selectedYear, selectedMonth]); // Trigger on year/month change

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // pp & ca by trend chart
  const [brushRange, setBrushRange] = useState([
    0,
    policyClaimAmountByTrendData.length - 1,
  ]);

  const handleBrushChange = (newRange) => {
    setBrushRange(newRange);
  };
  // end of pp & ca trend chart

  //policy claim count chart
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const companyString = localStorage.getItem('carrier_admin_company');
  let company;
  if (companyString) {
    company = JSON.parse(companyString);
  }

  const [selectedData, setSelectedData] = useState('year');
  const [chartData, setChartData] = useState({
    labels: [], // Initialize with empty arrays
    datasets: []
  });

  useEffect(() => {
    updateChartData();
  }, [selectedData, yearData, monthData]);

  const updateChartData = () => {
    if (selectedData === 'year' && yearData?.data) {
      const labels = yearData.data.map((item) => item.year);
      const premiumData = yearData.data.map((item) => item.premium_amount);
      const claimData = yearData.data.map((item) => item.claim_amount);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Premium Amount',
            data: premiumData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
          {
            label: 'Claim Amount',
            data: claimData,
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      });
    } else if (selectedData === 'month' && monthData?.data) {
      // Filter monthData based on selectedYearForMonth
      const filteredMonthData = monthData.data.filter(item => {
        const year = parseInt(item.month.split('-')[0]);
        return year === selectedYearForMonth;
      });    
      const labels = filteredMonthData.map((item) => item.month);
      const premiumData = filteredMonthData.map((item) => item.premium_amount);
      const claimData = filteredMonthData.map((item) => item.claim_amount);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Premium Amount',
            data: premiumData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
          {
            label: 'Claim Amount',
            data: claimData,
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      });
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      {loading ? (
        <div>loading.......</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) :
        <Box>
          <Grid>
            <Typography
              variant="h4"
              color="primary"
              className="Nasaliza"
              style={{ margin: isMobile ? "3rem 0rem 0rem 0rem" : "0rem 0rem", textAlign: 'center' }}

            >
              Admin Dashboard
            </Typography>
          </Grid>
          <Grid container spacing={2} style={{ margin: isMobile ? "auto" : "1rem 0.5rem" }}>
            <Grid>

            </Grid>
            <Grid item xs={11} md={2.5} >
              <Card elevation={3} item sx={2} md={2.5}>
                <CardContent>
                  <Typography variant="h6" color="primary" className='Nasaliza'>
                    Premium Amount
                  </Typography>
                  <Typography variant="h5">${dashboardData.Total_Premium}</Typography>
                </CardContent>
              </Card>
              <Card elevation={3} style={{ marginTop: '0.8rem' }}>
                <CardContent style={{ height: "5.9rem" }}>
                  <Typography variant="h6" color="primary" className='Nasaliza'>
                    Total Policies
                  </Typography>
                  <Typography variant="h5">{dashboardData.policies}</Typography>
                </CardContent>
              </Card>
              <Grid container spacing={1} style={{ marginTop: '0.3rem' }}>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        New/Queued Policies
                      </Typography>
                      <Typography variant="h6">100</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        Issued Policies
                      </Typography>
                      <Typography variant="h6">550</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        Denied Policies
                      </Typography>
                      <Typography variant="h6">10</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        Expired Policies
                      </Typography>
                      <Typography variant="h6">40</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={11} md={2.5}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="primary" className='Nasaliza'>
                    Claim Amount
                  </Typography>
                  <Typography variant="h5">$15.13 M</Typography>
                </CardContent>
              </Card>
              <Card elevation={3} style={{ marginTop: '0.8rem' }}>
                <CardContent style={{ height: "5.9rem" }}>
                  <Typography variant="h6" color="primary" className='Nasaliza'>
                    Total Claims
                  </Typography>
                  <Typography variant="h5">{dashboardData.Total_claims}</Typography>
                </CardContent>
              </Card>
              <Grid container spacing={1} style={{ marginTop: '0.3rem' }}>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        Success Claims
                      </Typography>
                      <Typography variant="h6">{dashboardData.Success_and_Failure_Claims.success_claims}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        Failure Claims
                      </Typography>
                      <Typography variant="h6">{dashboardData.Success_and_Failure_Claims.failure_claims}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        New/Queued Claims
                      </Typography>
                      <Typography variant="h6">10</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={3}>
                    <CardContent style={{ height: "5.9rem" }}>
                      <Typography style={{ fontSize: "0.8rem" }} color="primary" className='Nasaliza'>
                        Pending Claims
                      </Typography>
                      <Typography variant="h6">20</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={11} md={6.5}>
              <Card elevation={3}>
                <CardContent>
                  <Grid container alignItems="center" spacing={1} style={{ display: "flex" }}>
                    <Grid item xs={12} md={3}></Grid>
                    <Grid item md={5.5}>
                      <Typography variant="h6" color="primary" className='Nasaliza'>
                        Premium and Claim Trends
                      </Typography>
                    </Grid>
                    <Grid item md={3.5} >
                      <FormControl sx={{ minWidth: 150, marginTop: "1rem" }}>
                        <InputLabel id="data-select-label">Select Data</InputLabel>
                        <Select
                          labelId="data-select-label"
                          id="data-select"
                          value={selectedData}
                          label="Select Data"
                          onChange={(e) => setSelectedData(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              border: '1px solid #ccc',
                            },
                            '& .MuiSelect-select': {
                              padding: '6px 2px',
                              fontSize: '1rem',
                            },
                          }}
                        >
                          <MenuItem value="year">Year</MenuItem>
                          <MenuItem value="month">Month</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Line
                    data={chartData}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => `$${value}` // Add $ to y-axis ticks
                          },
                        },
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => `$${context.parsed.y}` // Display with $ on hover
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={11} md={3.5} style={{ marginTop: '0.3rem' }}>
              <Card elevation={3} style={{ height: "520px" }}>
                <CardContent>
                  <Typography variant="h6" color="primary" className='Nasaliza' gutterBottom >
                    Total Claims By Channel
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Legend align="center" />
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={11} md={8} style={{ marginTop: isMobile ? '0px' : '0.3rem' }}>
              <Card elevation={3} style={{ height: "520px" }}>
                <Typography variant="h6" color="primary" gutterBottom className='Nasaliza' style={{ textAlign: 'center' }}>
                  Policies & Claims Trends
                </Typography>
                <Grid container direction="column" alignItems="center" spacing={2}>
                  <Grid item>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <label className='Nasaliza' style={{ margin: isMobile ? '5px 0' : '0 10px' }}>Select Year:</label>
                      <select
                        value={selectedYear || ''} // Provide an empty string if selectedYear is null
                        onChange={handleYearChange}
                        style={{ marginRight: isMobile ? '0' : '20px', width: '5rem', borderRadius: '0.6rem', height: '30px', marginBottom: isMobile ? '10px' : '0' }}
                      >
                        {/* Generate options from Premium_by_Year keys */}
                        {Object.keys(dashboardData.Premium_by_Year).map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <label className='Nasaliza' style={{ margin: isMobile ? '5px 0' : '0 10px' }}>Select Month:</label>
                      <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        style={{ borderRadius: '0.6rem', height: '30px', width: '7rem', marginBottom: isMobile ? '10px' : '0' }}
                      >
                        <option value="All">All</option>
                        {moment.months().map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Grid>
                  <Grid item style={{ width: '100%', height: "450px" }}>
                    <Plot
                       data={[
                        {
                          x: policiesClaimsTrendData.x, 
                          y: policiesClaimsTrendData.policies,
                          type: 'scatter',
                          mode: 'lines+markers', 
                          stackgroup: 'one',
                          name: 'Number of Policies',
                        },
                        {
                          x: policiesClaimsTrendData.x, 
                          y: policiesClaimsTrendData.claims,
                          type: 'scatter',
                          mode: 'lines+markers', 
                          stackgroup: 'one',
                          name: 'Number of Claims',
                        },
                      ]}
                      layout={{
                        xaxis: { showgrid: true, zeroline: false },
                        yaxis: { showline: false },
                        hovermode: 'closest',
                        plot_bgcolor: '#f5f5f5',
                        paper_bgcolor: '#ffffff',
                        font: { size: 10 },
                        autosize: true,
                        margin: { t: 20, l: 40, r: 20 },
                      }}
                      style={{ width: '100%', height: isMobile ? '300px' : '400px' }}
                      useResizeHandler
                      className='plotly-graph'
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={11} md={4} >
              <Card elevation={3} style={{ height: "400px", }}>
                <CardContent style={{ marginLeft: "-1.5rem" }}>
                  <Typography variant="h6" color="primary" className='Nasaliza' gutterBottom>
                    Total Claims by HO Category
                  </Typography>
                  <ResponsiveContainer width="105%" height={300}>
                    <BarChart
                      data={hoCategoryClaimsData} // Use the new state variable here
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      scale={{ x: 'point' }} // Use point scale for x-axis
                    >
                      <defs>
                        <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={<TotalpoliesclaimsbyHOCategoryCustomTooltip />} />
                      <Bar dataKey="claims" fill="url(#colorClaims)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={11} md={3.5}><Card elevation={3} style={{ height: "400px" }}>
              <CardContent>
                <Typography variant="h6" color="primary" className='Nasaliza' gutterBottom>
                  Claims by Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={StatusClaims}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value.toFixed(2)}%`}
                    >
                      {StatusClaims.map((entry, index) => (
                        <Cell
                          fontSize={'0.6rem'}
                          key={`cell-${index}`}
                          fill={ClaimsCOLORS[index % ClaimsCOLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card></Grid>
            <Grid item xs={11} md={4}><Card elevation={3} style={{ height: "400px" }}>
              <CardContent>
                <Typography variant="h6" color="primary" className='Nasaliza' gutterBottom>
                  Policies By Status
                </Typography>
                <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-1rem" }}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={dataofTypesofPolicies}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {dataofTypesofPolicies.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card></Grid>
            <Grid item xs={11} md={4}>
              <Card elevation={3} style={{ height: "400px" }}>
                <CardContent>
                  <Typography variant="h6" color="primary" className='Nasaliza' gutterBottom>
                    Total Policies per HO Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={hoCategoryPoliciesData} // Use the new state variable
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPolicies" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={<TotalpoliesclaimsbyHOCategoryCustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="policies"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorPolicies)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={11} md={7.5}>
              <Card elevation={3} style={{ height: "400px" }}>
                <CardContent>
                  <Typography variant="h6" color="primary" className='Nasaliza' gutterBottom>
                    Policy Premium vs Claim Amount by HO Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300} >
                    <BarChart
                      data={hoPremiumClaimData} // Use the new state variable
                    // margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        // label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<PpcaCustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="pp" fill="#8884d8" name="Policy Premium" />
                      <Bar dataKey="ca" fill="#82ca9d" name="Claim Amount" />
                      <Brush
                        dataKey="name"
                        height={30}
                        stroke="#8884d8"
                        onChange={handleBrushChange}
                        startIndex={brushRange[0]}
                        endIndex={brushRange[1]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Box>
      }
    </>
  );
};

export default IndividualCompanyMainDashboard;

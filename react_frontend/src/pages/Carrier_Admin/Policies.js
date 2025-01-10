import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CssBaseline,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Sector,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA0000",
  "#AA00FF",
];

const data = [
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

 
const Policies = () => {
   const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  const [chartData, setChartData] = useState({ 
    policyTypeData: [],
    policyYearData: [],
    PolicyPremiumAmount: [],
    totalPremium: 0,
    totalPolicies: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const company = JSON.parse(localStorage.getItem('carrier_admin_company'));
        const ic_id = localStorage.getItem('ic_id_for_dashboard')
         const formData = new FormData();
        formData.append('ic_id', ic_id || company.ic_id);
        const response = await axiosInstance.post('get_all_policy_details/', formData);
         localStorage.setItem("policies_dashboard_data", JSON.stringify(response.data));
        const dataFromLocalStorage = JSON.parse(localStorage.getItem("policies_dashboard_data"));

        // Create an object to store policy counts with H01-H08 as keys
        const policyTypeData = {};
        for (let i = 1; i <= 8; i++) {
          policyTypeData[`H0${i}`] = 0;
        }
        // Update counts based on API response (assuming dataFromLocalStorage.No_of_policies_by_HO has the data)
        Object.entries(dataFromLocalStorage.No_of_policies_by_HO).forEach(([name, Policies]) => {
          policyTypeData[name] = Policies;
        });
        // Convert to array for Recharts
        const chartDataArray = Object.entries(policyTypeData).map(
          ([name, Policies]) => ({ name, Policies })
        );

        // Create an object to store policy amounts with H01-H08 as keys
        const premiumData = {};
        for (let i = 1; i <= 8; i++) {
          premiumData[`H0${i}`] = 0;
        }
        // Update amounts based on API response
        Object.entries(dataFromLocalStorage.Premium_by_type).forEach(
          ([policyType, amount]) => {
            premiumData[policyType] = amount;
          }
        );
        // Convert to array for Recharts
        const premiumDataArray = Object.entries(premiumData).map(
          ([policyType, amount]) => ({ policyType, amount })
        );

        // Transform API response to match your chart data structure
        setChartData({
          policyTypeData: chartDataArray, // Update policyTypeData here
          policyYearData: Object.entries(dataFromLocalStorage.No_of_policies_by_year).map(([year, policies]) => ({ year: year.toString(), policies })),
          PolicyPremiumAmount: premiumDataArray,
          totalPremium: dataFromLocalStorage.Total_Premium,
          totalPolicies: dataFromLocalStorage.Total_policies,
        });
        setLoading(false);

      } catch (error) {
        setError('Failed to fetch Policies dashboard data');
        setLoading(false);
       }
    };

    fetchData();
  }, []);  

  // console.log(chartData);
 
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, border: "1px solid #ccc", backgroundColor: "#fff" }}>
          <Typography variant="body2">{`${payload[0].name} : $${payload[0].value}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
          },
        },
      },
    },
  });

  return (
    <>
      {loading ? (
        <div>loading.......</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) :
        <ThemeProvider theme={customTheme}>
          <CssBaseline />
          <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              className="Nasaliza"
            >
              Policy Dashboard
            </Typography>
            <Grid container spacing={3}>            
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Premium Amount
                    </Typography>
                    <Typography variant="h4">${chartData.totalPremium}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Total Policies
                    </Typography>
                    <Typography variant="h4">{chartData.totalPolicies}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  {[
                    "New/Quoted",
                    "Issued",
                    "Expired",
                    "Renewed",
                    "Denied",
                    "Cancelled",
                  ].map((status, index) => (
                    <Grid item xs={6} sm={4} key={status}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">
                            {status}
                          </Typography>
                          <Typography variant="h6">{data[index].value}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>              
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, height: "400px" }}>
                  <Typography variant="h6" gutterBottom className="Nasaliza">
                    Policies By Status
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, height: "400px" }}>
                  <Typography variant="h6" gutterBottom className="Nasaliza">
                    Policy Types
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.policyTypeData} barCategoryGap={8}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Policies"
                        fill="#8884d8"
                        barSize={30}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, height: "400px" }}>
                  <Typography variant="h6" gutterBottom className="Nasaliza">
                    No. of Policies by Year
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.policyYearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="policies"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, height: "400px" }}>
                  <Typography variant="h6" gutterBottom className="Nasaliza">
                    Policy's Premium Amount
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={chartData.PolicyPremiumAmount}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                      <YAxis dataKey="policyType" type="category" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      }
    </>
  );
};

export default Policies;

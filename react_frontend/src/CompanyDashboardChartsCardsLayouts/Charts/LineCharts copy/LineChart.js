import React from "react";
import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    const { lineChartData, lineChartOptions } = this.props;

    this.setState({
      chartData: lineChartData,
      chartOptions: lineChartOptions,
    });
  }

  render() {
    return (
      <ReactApexChart
        options={{
          ...this.state.chartOptions,
          legend: {
            show: true,
            position: "bottom",
            fontSize: "13px",
            fontFamily: "inherit",
            labels: {
              colors: ["#c8cfca"],
            },
          },
        }}
        series={this.state.chartData}
        type="area"
        width="100%"
        height="100%"
      />
    );
  } // <-- Added the missing closing curly brace here
}

LineChart.propTypes = {
  lineChartData: PropTypes.array.isRequired,
  lineChartOptions: PropTypes.object.isRequired,
};
export default LineChart;

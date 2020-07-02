import React, { Component } from "react";
import Chart from "chart.js";
let myRadarChart;

Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";

class RadarChart extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  buildChart = () => {
    let myRadarChart = new Array(20);
    const myChartRef = this.chartRef.current.getContext("2d");

    if (typeof myRadarChart[this.props.num] !== "undefined")
      myRadarChart[this.props.num].destroy();

    let labelsArray = [];
    let data1Array = [];
    let data2Array = [];
    this.props.criterias.map((el) => {
      if (el.category == this.props.category) {
        labelsArray.push(el.criteria);
      }
    });

    this.props.emp1Data.map((el) => {
      if (this.props.category == el.category) {
        data1Array.push(el.value);
      }
    });

    this.props.emp2Data.map((el) => {
      if (this.props.category == el.category) {
        data2Array.push(el.value);
      }
    });

    myRadarChart[this.props.num] = new Chart(myChartRef, {
      type: "radar",
      data: {
        labels: labelsArray,
        datasets: [
          {
            label: this.props.emp1Name,
            data: data1Array,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 12,
            pointBorderWidth: 2,
            pointBorderColor: "rgba(255, 99, 132, 1)",
          },
          {
            label: this.props.emp2Name,
            data: data2Array,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 3,
            // fill: false,
            pointStyle: "triangle",
            pointRadius: 10,
            pointBorderWidth: 2,
            pointBorderColor: "rgba(54, 162, 235, 1)",
            // lineTension: 1,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: this.props.category,
        },
        scale: {
          ticks: {
            beginAtZero: true,
          },
          angleLines: {
            color: "#214856",
          },
          gridLines: {
            color: "black",
          },
        },
        legend: {
          position: "bottom",
        },
        animation: {
          duration: 3000,
          easing: "easeInOutBounce",
        },
        layout: {
          padding: 0,
        },
      },
    });
  };

  render() {
    return (
      <div>
        <canvas
          id={this.props.idNo}
          aria-label="Hello ARIA World"
          role="img"
          ref={this.chartRef}
          width="400"
          height="300"
        />
      </div>
    );
  }
}

export default RadarChart;

// "rgba(54, 162, 235, 0.2)",
// "rgba(255, 206, 86, 0.2)",
// "rgba(75, 192, 192, 0.2)",
// "rgba(153, 102, 255, 0.2)",
// "rgba(255, 159, 64, 0.2)",

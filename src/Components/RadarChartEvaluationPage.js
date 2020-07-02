import React, { Component } from "react";
import Chart from "chart.js";

Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";

class RadarChartEvaluationPage extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  buildChart = () => {
    let labelsArray = [];
    let dataArray = [];
    this.props.data.map((el) => {
      if (el.category == this.props.category) {
        labelsArray.push(el.criteria);
        dataArray.push(el.value);
      }
    });

    let myRadarChart = new Array(20);

    let mychartRef = this.chartRef.current.getContext("2d");

    if (typeof myRadarChart[this.props.num] !== "undefined")
      myRadarChart[this.props.num].destroy();

    myRadarChart[this.props.num] = new Chart(mychartRef, {
      type: "radar",
      data: {
        labels: labelsArray,
        datasets: [
          {
            data: dataArray,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 12,
            pointBorderWidth: 2,
            pointBorderColor: "rgba(255, 99, 132, 1)",
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
            // stepSize: 10,
            min: 0,
            max: 100,
          },
          angleLines: {
            color: "#214856",
          },
          gridLines: {
            color: "black",
          },
        },
        legend: {
          display: false,
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
          width="600"
          height="300"
        />
      </div>
    );
  }
}

export default RadarChartEvaluationPage;

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axiosClient from "../../api/api";
ChartJS.register(ArcElement, Tooltip, Legend);
const ProjectPieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/projects/chart");
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {chartData ? (
        <>
          <h2>Project chart</h2>
          <Doughnut data={chartData} />
        </>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default ProjectPieChart;

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
        const token = localStorage.getItem("token");
        const response = await axiosClient.get(
          `/projects/chart?token=${token}`
        );
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
          <Doughnut data={chartData} />
        </>
      ) : (
        <p>No project</p>
      )}
    </div>
  );
};

export default ProjectPieChart;

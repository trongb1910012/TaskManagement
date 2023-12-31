import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axiosClient from "../../api/api";
ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/tasks/chart");
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
        <p>No task</p>
      )}
    </div>
  );
};

export default PieChart;

// src/components/AreaChart.tsx
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface AreaChartProps {
  options: ApexCharts.ApexOptions;
  series: ApexAxisChartSeries;
}

const LiveChart: React.FC = () => {
  const [options] = useState({
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  });

  const [series] = useState([
    {
      name: "series-1",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ]);

  return (
    <div>
      <h1>ApexCharts Example</h1>
      <Chart
        options={options}
        series={series}
        type="bar"
        width={500}
        height={320}
      />
    </div>
  );
};

export default LiveChart;

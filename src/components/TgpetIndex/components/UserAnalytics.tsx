"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Index = (
  { daily_data_chart, weekly_data_chart, monthly_data_chart }:
    {
      daily_data_chart: { dates: string[], categories: string[], series: { name: string, data: number[] }[] },
      weekly_data_chart: { dates: string[], categories: string[], series: { name: string, data: number[] }[] },
      monthly_data_chart: { dates: string[], categories: string[], series: { name: string, data: number[] }[] },
    }
) => {
  const [data_chart, setDataChart] = React.useState(daily_data_chart);

  useEffect(() => setDataChart(daily_data_chart), [daily_data_chart]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#80CAEE", "#3C50E0"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#80CAEE", "#3056D3"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: data_chart.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: data_chart.series.reduce((acc, curr) => {
        const max = Math.max(...curr.data);

        const value = max > acc ? max : acc;

        return value + (value / 100) * 40;
      }, 0),
    },
  };

  const series = data_chart.series;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Users</p>
              <p className="text-sm font-medium">{data_chart.dates[0]} - {data_chart.dates[data_chart.dates.length - 1]}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">New Users</p>
              <p className="text-sm font-medium">{data_chart.dates[0]} - {data_chart.dates[data_chart.dates.length - 1]}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-30 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button onClick={() => setDataChart(daily_data_chart)} className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${data_chart === daily_data_chart ? ' shadow-card bg-white dark:bg-boxdark' : ''}`}>
              Day
            </button>
            <button onClick={() => setDataChart(weekly_data_chart)} className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${data_chart === weekly_data_chart ? ' shadow-card bg-white dark:bg-boxdark' : ''}`}>
              Week
            </button>
            {/* <button onClick={() => setDataChart(monthly_data_chart)} className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${data_chart === monthly_data_chart ? ' shadow-card bg-white dark:bg-boxdark' : ''}`}>
              Month
            </button> */}
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

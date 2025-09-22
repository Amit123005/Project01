import React, { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const Barchart2 = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://163.125.101.206:5000/api/oee_chart')
      .then(response => response.json())
      .then(data => {
        // Check if data is an array with at least one item
        if (Array.isArray(data) && data.length > 0) {
          // Extract the first item from the array
          const item = data[0];
          // Format the data for the chart
          const formattedData = [{
            date: 'Today', // Using a static label
            Availability: parseFloat(item.Availability),
            Performance: parseFloat(item.Performance),
            'Quality Rate': parseFloat(item['Quality Rate']),
            OEE: parseFloat(item.OEE)
          }];
          setData(formattedData);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={['Availability', 'Performance', 'Quality Rate', 'OEE']}
      indexBy="date" // Use static label
      margin={{ top: 50, right: 130, bottom: 120, left: 60 }}
      groupMode="grouped"
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 30,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 40,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Date",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Value",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 3]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: isDashboard ? 13 : 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: isDashboard ? 8 : 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in date: " + e.indexValue;
      }}
      tooltip={({ id, value, color, indexValue }) => (
        <div
          style={{
            padding: '12px 16px',
            background: '#fff',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            borderRadius: "12px"
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: color,
              marginRight: 8,
            }}
          ></div>
          <strong>{id}</strong>: {value}
        </div>
      )}
    />
  );
};

export default Barchart2;

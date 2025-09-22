import { useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../theme";
import { useState, useEffect } from "react";

const Die_Zone_Trend = ({ dateRange, shift, area, isCustomLineColors = false, isDashboard = true, dieZoneFilter}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        const response = await fetch(`http://163.125.102.142:5000/api/ext1_dz_trend?start_date=${startDate}&end_date=${endDate}&shift=${shift}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const transformedData = transformData(result);
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dieZoneFilter,dateRange, shift, area]);

  const transformData = (data) => {
    // Ensure barrelZoneFilter is an array
    const barrelZones = Array.isArray(dieZoneFilter) ? dieZoneFilter : [dieZoneFilter];
  
    // Initialize transformedData array
    const transformedData = barrelZones.map((zone) => [
      { id: `${zone}_Set`, color: 'hsl(110, 70%, 50%)', data: [] },
      { id: `${zone}_Actual`, color: 'hsl(20, 70%, 50%)', data: [] }
    ]).flat();
  
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const dateString = item.hour ? `${item.date} ${item.hour}` : item.date;
        const date = new Date(dateString);
  
        // Log date parsing issues
        if (isNaN(date.getTime())) {
          console.error("Invalid date format", item, dateString);
          return;
        }
  
        // Populate data for each zone
        barrelZones.forEach((zone, index) => {
          const setValue = parseFloat(item[`${zone}_Set`]);
          const actualValue = parseFloat(item[`${zone}_Actual`]);
  
          if (!isNaN(setValue)) {
            transformedData[index * 2].data.push({ x: date, y: setValue });
          }
  
          if (!isNaN(actualValue)) {
            transformedData[index * 2 + 1].data.push({ x: date, y: actualValue });
          }
        });
      });
    } else {
      console.error("No data available", data);
    }
  
    return transformedData.every(series => series.data.length === 0) 
      ? [{ id: 'No data', color: 'hsl(0, 0%, 50%)', data: [] }] 
      : transformedData;
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0 || data[0].data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveLine
      data={data}
      theme={{
        background: 'white',
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: { text: { fill: colors.grey[100] } },
        tooltip: { container: { color: colors.primary[500] } },
      }}
      colors={isDashboard ? { datum: 'color' } : { scheme: 'nivo' }}
      margin={{ top: 10, right: 150, bottom: 50, left: 60 }}
      xScale={{ type: 'time', format: 'time', useUTC: false }}
      yScale={{ type: 'linear', min: '0', max: 'auto', stacked: false, reverse: false }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
    orient: 'bottom',
    tickSize: 0, // Hide ticks
    tickPadding: 5,
    tickRotation: 0,
    legend: 'Date',
    legendOffset: 36,
    legendPosition: 'middle',
    format: '%b %d', // Customize date format here
  }}
      axisLeft={{
        orient: 'left',
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Temperature',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={4}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={1}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'square',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: { itemBackground: 'rgba(0, 0, 0, .03)', itemOpacity: 1 },
            },
          ],
        },
      ]}
      tooltip={({ point }) => (
        <div
          style={{
            background: 'white',
            padding: '5px',
            border: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '5px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            color: 'black'
          }}
        >
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
            {point.data.xFormatted}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: point.serieColor,
                borderRadius: '3px',
                marginRight: '5px',
              }}  
            />
            {point.serieId}: {point.data.yFormatted}
          </div>
        </div>
      )}
    />
  );
};

export default Die_Zone_Trend;

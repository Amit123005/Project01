import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState, setdata } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import Availability from "../../components/availability";
import Quality_rate from "../../components/quality_rate";
import Performance from "../../components/performance";
import OEE from "../../components/oee";
import PMS_Table from "../../components/pms_table";
import OEE_Gauge from "../../components/oee_gauge";
import BarChart2 from "../../components/line2";
import Yield from "../../components/yield_per";
import Rejection from "../../components/rejection_per";
import First_timestamp from "../../components/first_timestamp";
import Downtimes from "../../components/downtimes";
import Prod_count from "../../components/prod_count";
import Line_rej from "../../components/line_rej";
import Startup from "../../components/startup";

const Dashboard2 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setdata] = useState([]);

  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/pms_table')
      .then(response => response.json())
      .then(data => {
        console.log('Original Data:', data);
        const transformedData = Object.keys(data).map(key => {
          return { name: key, ...data[key] };
        });
        console.log('Transformed Data:', transformedData);
        setdata(transformedData);
      })
      .catch(error => console.error('Error fetching card data:', error));
  }, []);

  const [data2, setdata2] = useState([]);

  useEffect(() => {
    fetch('http://163.125.102.142:5000/test')
      .then(response => response.json())
      .then(data => {
        console.log('Original Data:', data);
        // Transform the data
        const transformedData = Object.keys(data).map(key => {
          return { name: key, ...data[key] };
        });
        console.log('Transformed Data:', transformedData);
        setdata2(transformedData);
      })
      .catch(error => console.error('Error fetching card data:', error));
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Production Monitoring System" />

        <Box display="flex" justifyContent="center" alignItems="center" mr="0px">
                <img
                  alt="ppap logo"
                  width="50%"
                  height="auto"
                  src={`../../assets/ppaplogo.png`}
                  style={{ borderRadius: "0%" }}
                />
        </Box>
        
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="10px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 1"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Availability"
            subtitle={<Availability/>}
          />
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
        <Box display="flex" justifyContent="center" alignItems="center" mt={"20px"}>
          <Typography style={{ fontWeight: 'bold', fontSize:"20px", marginBottom:"10px", marginTop: "0px" }}> Current Values</Typography>
        </Box>
          <BarChart2/>
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Production"
            subtitle={<Prod_count/>}
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Line Rejection"
            subtitle={<Line_rej/>}
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Startup Scrap"
            subtitle={<Startup/>}
          />
        </Box>
        <Box
          gridColumn="span 1"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Performance"
            subtitle={<Performance/>}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Yield %"
            subtitle={<Yield/>}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Rejection %"
            subtitle={<Rejection/>}
          />
        </Box>
        
        <Box
          gridColumn="span 1"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Quality Rate"
            subtitle={<Quality_rate/>}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Plan Active Since"
            subtitle={<First_timestamp/>}
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="OEE"
            subtitle={<OEE/>}
          />
        </Box>
        <Box/>
        <Box
            gridColumn="span 6"
            gridRow="span 2"
            overflow="auto"
            backgroundColor={colors.primary[400]}
          >
            <Box backgroundColor={colors.primary[400]} display="flex" justifyContent="center" alignItems="center" mt={"20px"}>
              <Typography style={{ fontWeight: 'bold', fontSize:"20px"}}> Downtimes</Typography>
            </Box>
            <Downtimes/>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          overflow="auto"
          backgroundColor={colors.primary[400]}
        >
          <Box backgroundColor={colors.primary[400]} display="flex" justifyContent="center" alignItems="center" mt={"20px"}>
          <Typography style={{ fontWeight: 'bold', fontSize:"20px"}}> Current Values</Typography>
          </Box>
            <PMS_Table/>
          </Box>
      </Box>
    </Box>
  );
};

export default Dashboard2;

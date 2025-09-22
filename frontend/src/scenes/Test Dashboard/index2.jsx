import { Box, Button, Typography, useTheme, Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import StatBox from "../../components/StatBox";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import LineChart from "../../components/LineChart";
import Yield_Filter from "../../components/yield_filter";
import Downtime_filter from "../../components/downtime_filter";
import Rejection_Filter from "../../components/rejection_filter";
import Consumption_Filter from "../../components/consumption";
import Prod_count from "../../components/prod_count";
import Startup from "../../components/startup";
import Line_rej from "../../components/line_rej";
import First_timestamp from "../../components/first_timestamp";
import Total_rej from "../../components/total_rej";
import OEE_gauge from "../../components/oee_gauge";
import Availability_gauge from "../../components/availability";
import Quality_gauge from "../../components/quality_rate";
import Performance_gauge from "../../components/performance";
import Plan_ID from "../../components/plan_id";
import DowntimeIndicator from "../../components/downtime_indicator";
import PokaYokeStatusTable from "../../components/poka-yoke";

  const Dashboard4 = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setdata] = useState([]);
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
    const [shift, setShift] = useState(['A']);
    const [area, setArea] = useState('Line 8');

    useEffect(() => {
      fetch('http://163.125.102.142:5000/api/pms_table')
        .then(response => response.json())
        .then(data => {
          const transformedData = Object.keys(data).map(key => {
            return { name: key, ...data[key] };
          });
          setdata(transformedData);
        })
        .catch(error => console.error('Error fetching card data:', error));
    }, []);

    const handleShiftChange = (event) => {
      setShift(event.target.value);
    };
  
    const handleAreaChange = (event) => {
      setArea(event.target.value);
    };

    return (
      <Box
      sx={{
        backgroundColor: '#ebeffa',
        minHeight: "100vh",
        padding: "10px",
        backgroundImage: `url('../../assets/background-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      >
        <Box
              sx={{
                position: 'fixed',
                zIndex: 3000
              }}
            >
            <Box height="75%" m="20px 0 0 0" width="100%">
              <DowntimeIndicator />
            </Box>
            </Box>
      <Box m="20px 0 0 0">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap="10px">
          <Header title="Dashboard" subtitle="Production Monitoring System" />
        </Box>

          <Box display="flex" justifyContent="right" alignItems="center" mr="-40x" mt="-35px">
                <img
                  alt="ppap logo"
                  width="10%"
                  height="auto"
                  src={`../../assets/logo.jpg`}
                  style={{ borderRadius: "0%" }}
                />
        </Box>
        </Box>

        {/* DATE RANGE PICKER */}
      <Box mb="25px" display="flex" justifyContent="left" alignItems="center" gap="10px">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: 250, padding: 1 }}>
          <DateRangePicker
            startText="Start"
            endText="End"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            sx={{ height: "10px" }}
            TextFieldComponent={(props) => <TextField {...props} />}
          />
        </Box>
      </LocalizationProvider>

        {/* SHIFT DROPDOWN */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ ml: 2.5 }}>Shift</InputLabel>
          <Select
            multiple
            value={shift}
            onChange={handleShiftChange}
            label="shift"
            sx={{ height: "52px", ml:"20px", mr:"20px", border:"none"}}
          >
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
          </Select>
        </FormControl>

        {/* AREA DROPDOWN */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Area</InputLabel>
          <Select
            value={area}
            onChange={handleAreaChange}
            label="Area"
            sx={{ height: "52px" }}
          >
            <MenuItem value="Line 1">Line 1</MenuItem>
            <MenuItem value="Line 2">Line 2</MenuItem>
            <MenuItem value="Line 3">Line 3</MenuItem>
            <MenuItem value="Line 4">Line 4</MenuItem>
            <MenuItem value="Line 5">Line 5</MenuItem>
            <MenuItem value="Line 6">Line 6</MenuItem>
            <MenuItem value="Line 8">Line 8</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flex: 1, ml: 3 }}>
    <PokaYokeStatusTable />
  </Box>
      </Box>

      

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(6, 1fr)"
          gridAutoRows="80px"
          gap="10px"
          mb="10px"
        >
        <Box
          gridColumn="span 1"
          backgroundColor='#E0D6EE'
          boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
          borderRadius="10px"
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Plan ID"
            subtitle={<Plan_ID/>}
          />
          </Box>
          <Box
          gridColumn="span 1"
          backgroundColor='#E0E8F2'
          boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
          borderRadius="10px"
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Active Since"
            subtitle={<First_timestamp/>}
          />
          </Box>
          <Box
          gridColumn="span 1"
          backgroundColor='#E3EDE4'
          boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
          borderRadius="10px"
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Production Count (Nos.)"
            subtitle={<Prod_count/>}
          />
          </Box>
          <Box
          gridColumn="span 1"
          backgroundColor='#FEEDD9'
          boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
          borderRadius="10px"
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Total Rejection (Kg)"
            subtitle={<Total_rej/>}
          />
          </Box>
          <Box
          gridColumn="span 1"
          backgroundColor=' #FEDADA'
          boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
          borderRadius="10px"
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Startup Rejection (Kg)"
            subtitle={<Startup/>}
          />
          </Box>
          <Box
          gridColumn="span 1"
          backgroundColor='#f0bbc1'
          boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
          borderRadius="10px"
          height={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Line Rejection (Kg)"
            subtitle={<Line_rej/>}
          />
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="10px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 6"
            gridRow="span 3"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            mt="20px"
          >
          <Box display="flex" justifyContent="center" alignItems="center" >
              <Typography style={{ fontWeight: 'bold', fontSize:"20px", marginTop:"10px"}}>OEE Trend</Typography>
          </Box>
          <Box height="75%" m="20px 0 0 0" width="100%">
            <LineChart dateRange={dateRange} shift={shift} area={area}/>
          </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 3"
            alignItems="center"
            justifyContent="center"
            backgroundColor="white"
            borderRadius="10px"
            display="flex"
            flexDirection="column"
            mt="20px"
          >
            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
              <Typography style={{ fontWeight: 'bold', fontSize: "20px", marginTop: "10px" }}>
                OEE
              </Typography>
            </Box>
            <Box height="100%" m="20px 0 0 0" width="100%">
              <OEE_gauge />
            </Box>
          </Box>

          <Box
            gridColumn="span 2"
            gridRow="span 1"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            display="flex"
            mt="20px"
            mb="-10px"
          >
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
              <Typography style={{ fontWeight: 'bold', fontSize: "20px", marginTop: "10px" }}>
                Availability
              </Typography>
            </Box>
            <Box height="100%" m="20px 0 0 0" width="100%">
              <Availability_gauge />
            </Box>
          </Box>
          <Box
            gridColumn="span 2"
            gridRow="span 1"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            display="flex"
            mt="10px"
            mb="-8px"
          >
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
              <Typography style={{ fontWeight: 'bold', fontSize: "20px", marginTop: "10px" }}>
                Performance
              </Typography>
            </Box>
            <Box height="100%" m="20px 0 0 0" width="100%">
              <Performance_gauge />
            </Box>
          </Box>
          <Box
            gridColumn="span 2"
            gridRow="span 1"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            display="flex"
            mt="8px"
          >
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
              <Typography style={{ fontWeight: 'bold', fontSize: "20px", marginTop: "10px" }}>
                Quality Rate
              </Typography>
            </Box>
            <Box height="100%" m="20px 0 0 0" width="100%">
              <Quality_gauge />
            </Box>
          </Box>
          <Box
            gridColumn="span 6"
            gridRow="span 3"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            mt="20px"
            pl="10px"
            pb = "15px"
            pr="10px"
          >
          <Box height="100%" mb="20px"  width="100%" borderRadius="10px">
            <Consumption_Filter dateRange={dateRange} shift={shift} area={area}/>
          </Box>
          </Box>
          <Box
            gridColumn="span 6"
            gridRow="span 3"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            mt="20px"
            pl="10px"
            pb = "15px"
            pr="10px"
            pt = "20px"
          >
          <Box height="100%" width="100%" borderRadius="10px">
            <Yield_Filter dateRange={dateRange} shift={shift} area={area}/>
          </Box>
          </Box>
          <Box
            gridColumn="span 6"
            gridRow="span 3"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            mt="20px"
            pl="10px"
            pb = "15px"
            pr="10px"
          >
          <Box height="100%" mb="20px"  width="100%" borderRadius="10px">
            <Downtime_filter dateRange={dateRange} shift={shift} area={area}/>
          </Box>
          </Box>
          <Box
            gridColumn="span 6"
            gridRow="span 3"
            alignItems="center"
            justifyContent="center"
            backgroundColor= 'white'
            boxShadow= '0px 6px 12px rgba(0, 0, 0, 0.35)'
            borderRadius="10px"
            mt="20px"
            pb = "15px"
            pr="10px"
            pl="10px"
          >
          <Box height="100%"  width="100%" borderRadius="10px">
            <Rejection_Filter dateRange={dateRange} shift={shift} area={area}/>
          </Box>
          </Box>
        </Box> 
      </Box>
      </Box>
    );
  };

  export default Dashboard4;

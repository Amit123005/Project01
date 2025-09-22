import { Box, Button, IconButton, Typography, useTheme, useMediaQuery, MenuItem, Select, FormControl, InputLabel, TextField  } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState, setdata } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/header";
import BarChart from "../../components/barchart";
import StatBox from "../../components/StatBox";
import PartNameData from "../../components/partName";
import ModelData from "../../components/model";
import LineSpeedData from "../../components/lineSpeed";
import FactorData from "../../components/factor";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import Process_params from "../../components/process_params";
import Line_Speed_Trend from "../../components/line_speed_trend";

const DBDEF3 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [data, setdata] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState(['A']);
  const [area, setArea] = useState('Line 8');
  const navigate = useNavigate();


  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/common')
      .then(response => response.json())
      .then(data => {
        console.log('Original Data:', data);
        // Transform the data
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

  const handleShiftChange = (event) => {
    setShift(event.target.value);
    console.log()
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const handleExtruderClick = (extNumber) => {
    navigate(`/ext${extNumber}`);
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
      <Box m="20px 0 0 0">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={isSmallScreen ? "column" : "row"}>
        <Header title="DASHBOARD" subtitle="Live Process Quality Parameters Dashboard" />

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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="25px"
        flexDirection={isSmallScreen ? "column" : "row"}
      >
        {/* Filters on the left */}
        <Box display="flex" alignItems="center" gap="10px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: 250, padding: 1 }}>
              <DateRangePicker
                startText="Start"
                endText="End"
                value={dateRange}
                style={{ height: "10px" }}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} />
                    <TextField {...endProps} />
                  </>
                )}
              />
            </Box>
          </LocalizationProvider>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ ml: 2.5 }}>Shift</InputLabel>
            <Select
              multiple
              value={shift}
              onChange={handleShiftChange}
              label="shift"
              sx={{ height: "52px", ml: "20px", mr: "20px", border: "none" }}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </Select>
          </FormControl>

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
        </Box>

        {/* Buttons on the right */}
        <Box display="flex" gap="20px">
          {["Extruder 1", "Extruder 2", "Extruder 3", "Extruder 4"].map((label, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => navigate(`/ext${index + 1}`)}
              sx={{
                backgroundColor: colors.whitebg[200],
                color: colors.grey[100],
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                '&:hover': {
                  backgroundColor: colors.grey[600],
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.35)',
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Box>

    

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isSmallScreen ? "repeat(3, 1fr)" : isMediumScreen ? "repeat(9, 1fr)" : "repeat(12, 1fr)"}
        gridAutoRows={isSmallScreen ? "80px" : "140px"}
        gap="10px"
      >

        {/* ROW 1 */}
        <Box
          gridColumn={isSmallScreen ? "span 3" : "span 3"}
          gridRow={isSmallScreen ? "span 1" : "span 1"}
          backgroundColor={colors.whitebg[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
          height={"100%"}
        >
          <StatBox
            title="Part Name"
            subtitle={<PartNameData/>}
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 3"}
          gridRow={isSmallScreen ? "span 1" : "span 1"}
          backgroundColor={colors.whitebg[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
          height={"100%"}
        >
          <StatBox
            title="Model"
            subtitle={<ModelData/>}
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 3"}
          gridRow={isSmallScreen ? "span 1" : "span 1"}
          backgroundColor={colors.whitebg[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
          height={"100%"}
        >
          <StatBox
            title="Line Speed"
            subtitle={<LineSpeedData/>}
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 3"}
          gridRow={isSmallScreen ? "span 1" : "span 1"}
          backgroundColor={colors.whitebg[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
          height={"100%"}
        >
          <StatBox
            title="Factor"
            subtitle={<FactorData/>}
          />
        </Box>




        {/* ROW 2 */}
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 12"}
          gridRow={isSmallScreen ? "span 3" : "span 2"}
          backgroundColor={colors.whitebg[200]}
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
        >
          <Box
            mt="25px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color='{colors.grey[100]}'
                ml='20px'
              >
                Main Die Parameters
              </Typography>
            </Box>
          </Box>
          <Box height="70%" m="20px 0 0 0" width="100%">
            <BarChart dateRange={dateRange} shift={shift} area={area}/>
          </Box>
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 12"}
          gridRow={isSmallScreen ? "span 3" : "span 2"}
          backgroundColor={colors.whitebg[200]}
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
        >
          <Box
            mt="10px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
                ml='20px'
              >
                Puller Parameters
              </Typography>
            </Box>
          </Box>
          <Box height="70%" m=" 20px 0 0 0" width="100%">
            <Process_params dateRange={dateRange} shift={shift} area={area}/>
          </Box>
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 12"}
          gridRow={isSmallScreen ? "span 3" : "span 2"}
          backgroundColor={colors.whitebg[200]}
          boxShadow= '0px 4px 10px rgba(0, 0, 0, 0.25)'
          borderRadius="10px"
        >
          <Box
            mt="10px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
                ml='20px'
              >
                Line Speed Trend
              </Typography>
            </Box>
          </Box>
          <Box height="70%" m=" 20px 0 0 0" width="100%">
            <Line_Speed_Trend dateRange={dateRange} shift={shift} area={area}/>
          </Box>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default DBDEF3;

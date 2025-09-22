import { Box, Button, IconButton, Typography, useTheme, useMediaQuery, MenuItem, Select, FormControl, InputLabel, TextField  } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState, setdata } from "react";
import Header from "./header";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import Barrel_Zone_TrendE2 from "./barrel_zone_trendE2";
import Die_Zone_TrendE2 from "./die_zone_trendE2";
import Factor_TrendE2 from "./factor_trendE2";
import Main_Motor_TrendE2 from "./main_motor_trendE2";
import { useNavigate } from 'react-router-dom';

  const Extruder2 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [data, setdata] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState('A');
  const [area, setArea] = useState('Line 8');
  const [barrelzone, setbarrelzone] = useState('BZ1');
  const [diezone, setdiezone] = useState('DZ1');
  const navigate = useNavigate();
  

  const handleShiftChange = (event) => {
    setShift(event.target.value);
    console.log()
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const handlebarrelzoneChange = (event) => {
    setbarrelzone(event.target.value);
  };

  const handlediezoneChange = (event) => {
    setdiezone(event.target.value);
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
    <Box m="20px 0 0 80px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={isSmallScreen ? "column" : "row"}>
        <Header title="Extruder 2" subtitle="Process Quality Parameters Dashboard" />

        <Box display="flex" justifyContent="center" alignItems="center" mr={isSmallScreen ? "0%" : "0%"}>
                <img
                  alt="ppap logo"
                  width={isSmallScreen ? "80%" : "50%"}
                  height="auto"
                  src={`../../assets/ppaplogo.png`}
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
      <Box mb="25px" display="flex" justifyContent="left" alignItems="center" gap="10px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ width: 250, padding:1 }}>
            <DateRangePicker
              startText="Start"
              endText="End"
              value={dateRange}
              style={{height:"10px"}}
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

        {/* SHIFT DROPDOWN */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ ml: 2.5 }}>Shift</InputLabel>
          <Select
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

        {/* Barrel Zone DROPDOWN */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Barrel Zone</InputLabel>
          <Select
            value={barrelzone}
            onChange={handlebarrelzoneChange}
            label="Barrel Zone"
            sx={{ height: "52px" }}
          >
            <MenuItem value="BZ1">BZ1</MenuItem>
            <MenuItem value="BZ2">BZ2</MenuItem>
            <MenuItem value="BZ3">BZ3</MenuItem>
            <MenuItem value="BZ4">BZ4</MenuItem>
          </Select>
        </FormControl>

        {/* Die Zone DROPDOWN */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Die Zone</InputLabel>
          <Select
            value={diezone}
            onChange={handlediezoneChange}
            label="Die Zone"
            sx={{ height: "52px" }}
          >
            <MenuItem value="DZ1">DZ1</MenuItem>
            <MenuItem value="DZ2">DZ2</MenuItem>
            <MenuItem value="DZ3">DZ3</MenuItem>
          </Select>
        </FormControl>
        </Box>

        <Box display="flex" gap="20px">
          <Button
              variant="contained"
              onClick={() => navigate('/ext3')}
              sx={{
                backgroundColor:colors.whitebg[200],
                // ml:"35%",
                color: colors.grey[100],
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Shadow effect
                '&:hover': {
                  backgroundColor: colors.grey[600], // Lighter shade on hover
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.35)', // Larger shadow on hover
              },
              }}
            >
              Extruder 3
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/dbdef')}
              sx={{
                backgroundColor:colors.whitebg[200],
                color: colors.grey[100],
                // marginRight:"10px",
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Shadow effect
                '&:hover': {
                  backgroundColor: colors.grey[600], // Lighter shade on hover
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.35)',
              },
              }}
            >
              Main Dashboard
            </Button>
          </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isSmallScreen ? "repeat(3, 1fr)" : isMediumScreen ? "repeat(9, 1fr)" : "repeat(12, 1fr)"}
        gridAutoRows={isSmallScreen ? "80px" : "140px"}
        gap="10px"
      >

        {/* ROW 2 */}
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 12"}
          gridRow={isSmallScreen ? "span 3" : "span 2"}
          backgroundColor='white'
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Barrel Zone Temperature
              </Typography>
            </Box>
          </Box>
          <Box height="70%" m="20px 0 0 0" width="100%">
            <Barrel_Zone_TrendE2 dateRange={dateRange} shift={shift} area={area} barrelZoneFilter={barrelzone}/>
          </Box>
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 12"}
          gridRow={isSmallScreen ? "span 3" : "span 2"}
          backgroundColor='white'
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Die Zone Temperature
              </Typography>
            </Box>
          </Box>
          <Box height="70%" m="20px 0 0 0" width="100%">
            <Die_Zone_TrendE2 dateRange={dateRange} shift={shift} area={area} dieZoneFilter={diezone}/>
          </Box>
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 8" : "span 12"}
          gridRow={isSmallScreen ? "span 3" : "span 2"}
          backgroundColor='white'
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Main Motor Trend
              </Typography>
            </Box>
          </Box>
          <Box height="70%" m="20px 0 0 0" width="100%">
            <Main_Motor_TrendE2 dateRange={dateRange} shift={shift} area={area}/>
          </Box>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default Extruder2;

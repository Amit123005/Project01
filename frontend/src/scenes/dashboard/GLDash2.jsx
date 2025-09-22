import React, { useEffect, useState } from "react";
import {Typography,Paper,Box,TextField,MenuItem,useTheme, Card, CardContent} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import {PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,CartesianGrid} from "recharts";
import GLProd1 from "../../components/GLProd1";
import GLProd2 from "../../components/GLProd2";
import GLQual1 from "../../components/GLQual1";
import GLQual2 from "../../components/GLQual2";
import GLQual3 from "../../components/GLQual3";
import GLCost1 from "../../components/GLCost1";
import GLCost2 from "../../components/GLCost2";

import { tokens } from "../../theme";
import GLCost3 from "../../components/GLCost3";
import GLSafety1 from "../../components/GLSafety1";
import GLSafety2 from "../../components/GLSafety2";

export default function GLDash2() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
  const [line, setLine] = useState("");
  const [area, setArea] = useState("PP02");
  const [loading, setLoading] = useState(true);
  const [loadingSafety, setLoadingSafety] = useState(true);
  const [loadingIncident, setLoadingIncident] = useState(true);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [customer, setCustomer] = useState("All Customers");
  const [date, setDate] = useState("");

  const pieColors = ["#1976d2", "#ef5350", "#ffb300", "#66bb6a", "#ab47bc"];

  // ================= FETCH GL BOARD DATA ==================
  useEffect(() => {
    const fetchGLData = async () => {
      try {
        setLoading(true);
        let url = `http://163.125.102.142:5000/api/glboard?month=${month}`;
        if (line) url += `&line=${line}`;
        if (area) url += `&area=${area}`;

        const res = await axios.get(url);
        if (res.data && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.warn("GL Board API returned invalid data:", res.data);
          setData([]);
        }
      } catch (err) {
        console.error("Error Fetching GL Board Data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGLData();
  }, [month, line, area]);

  useEffect(() => {
    const fetchGLData2 = async () => {
      try {
        setLoading(true);
        let url = `http://163.125.102.142:5000/api/gl_safety2?month=${month}`;
        if (line) url += `&line=${line}`;
        if (area) url += `&area=${area}`;

        const res = await axios.get(url);
        if (res.data && Array.isArray(res.data)) {
          setSafetyData(res.data);
        } else {
          console.warn("GL Board API returned invalid data:", res.data);
          setSafetyData([]);
        }
      } catch (err) {
        console.error("Error Fetching GL Board Data:", err);
        setSafetyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGLData2();
  }, [month, line, area]);

  // useEffect(() => {
  //   const fetchSafetyData = async () => {
  //     try {
  //       setLoadingSafety(true);
  //       const res = await axios.get(
  //         `http://163.125.102.142:5000/api/gl_safety?month=${month}`
  //       );

  //       if (res.data && Array.isArray(res.data)) {
  //         const formatted = res.data.map((item) => ({
  //           name: item.category || "Unknown",
  //           value: item.count || 0,
  //         }));
  //         setSafetyData(formatted);
  //       } else {
  //         console.warn("Safety API returned invalid data:", res.data);
  //         setSafetyData([]);
  //       }
  //     } catch (err) {
  //       console.error("Error Fetching Safety Data:", err);
  //       setSafetyData([]);
  //     } finally {
  //       setLoadingSafety(false);
  //     }
  //   };

  //   fetchSafetyData();
  // }, [month]);

  // // ================= FETCH INCIDENT DATA ==================
  // useEffect(() => {
  //   const fetchIncidentData = async () => {
  //     try {
  //       setLoadingIncident(true);
  //       const res = await axios.get(
  //         `http://163.125.102.142:5000/api/gl_incident?month=${month}`
  //       );

  //       if (res.data && Array.isArray(res.data)) {
  //         const formatted = res.data.map((item) => ({
  //           name: item.incident_cat || "Unknown",
  //           value: item.count || 0,
  //         }));
  //         setIncidentData(formatted);
  //       } else {
  //         console.warn("Incident API returned invalid data:", res.data);
  //         setIncidentData([]);
  //       }
  //     } catch (err) {
  //       console.error("Error Fetching Incident Data:", err);
  //       setIncidentData([]);
  //     } finally {
  //       setLoadingIncident(false);
  //     }
  //   };

  //   fetchIncidentData();
  // }, [month]);

  // ==========================================================

  return (
  //   <Box
  //   sx={{
  //     transform: "scale(0.6)",   // 40% of original size
  //     transformOrigin: "top left", // keep scaling anchored to top-left
  //     width: "250%",              // compensate shrink so it doesn’t cut off
  //     height: "250%",
  //   }}
  // >
    <Paper sx={{ p: 2, borderRadius: 3, }}>
      {/* Header with Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#1976d2"
        color="white"
        p={1}
        borderRadius={1}
        mb={1}
      >
        
        <Box display="flex" gap={2} alignItems="center">
        <TextField
            size="small"
            value={area}
            label="Area"
            onChange={(e) => setArea(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width : 70,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputBase-root": {
                height: 20,   // 🔥 total height
                fontSize: 6, // shrink text size
              },
              "& .MuiInputBase-input": {
                padding: "4px 8px", // control inner padding
              },
              "& .MuiInputLabel-root": {
                fontSize: "10px",
                color: "green",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "10px",
                color : 'black'   // when label moves up
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",         // when focused
              },
            }}
            disabled
          />
          <TextField
            type="date"
            size="small"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width : 70,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputBase-root": {
                height: 20,   // 🔥 total height
                fontSize: 8, // shrink text size
              },
              "& .MuiInputBase-input": {
                padding: "4px 8px", // control inner padding
              },
              "& .MuiInputLabel-root": {
                fontSize: "10px",
                color: "green",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "10px",
                color : 'black'   // when label moves up
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",         // when focused
              },
            }}
            InputLabelProps={{ shrink: true }} // keeps label above field
          />
          <TextField
            type="month"
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width : 70,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputBase-root": {
                height: 20,   // 🔥 total height
                fontSize: 8, // shrink text size
              },
              "& .MuiInputBase-input": {
                padding: "4px 8px", // control inner padding
              },
              "& .MuiInputLabel-root": {
                fontSize: "10px",
                color: "green",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "10px",
                color : 'black'   // when label moves up
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",         // when focused
              },
            }}
          />
          <TextField
            select
            size="small"
            label="Line"
            value={line}
            onChange={(e) => setLine(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width : 70,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputBase-root": {
                height: 20,   // 🔥 total height
                fontSize: 8, // shrink text size
              },
              "& .MuiInputBase-input": {
                padding: "4px 8px", // control inner padding
              },
              "& .MuiInputLabel-root": {
                fontSize: "10px",
                color: "green",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "10px",
                color : 'black'   // when label moves up
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",         // when focused
              },
            }}
          >
            <MenuItem value="">All Lines</MenuItem>
            {[1, 2, 3, 4, 5, 6, 8].map((num) => (
              <MenuItem key={num} value={num}>
                Line {num}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            label="Customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width : 70,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputBase-root": {
                height: 20,   // 🔥 total height
                fontSize: 6, // shrink text size
              },
              "& .MuiInputBase-input": {
                padding: "4px 8px", // control inner padding
              },
              "& .MuiInputLabel-root": {
                fontSize: "10px",
                color: "green",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "10px",
                color : 'black'   // when label moves up
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",         // when focused
              },
            }}
          >
            <MenuItem value="All Customers">All Customers</MenuItem>
            {["MSIL","HCIL","TKML","TATA","MARKET","VW","GM","M&M"].map((cust) => (
              <MenuItem key={cust} value={cust}>
                {cust}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Typography variant="h3" fontWeight="bold" paddingRight= "300px">
          DIGI GENBA
        </Typography>
        <img 
          src="/assets/logo.jpg" 
          alt="Logo" 
          style={{ width: "50px", height: "30px" }} 
        />

        {/* Filters */}
        
      </Box>

      {/* Dashboard Content */}
      {loading ? (
        <Typography>Loading Dashboard.....</Typography>
      ) : data.length === 0 ? (
        <Typography color="text.secondary">
          No Data Found for the Selected Filters
        </Typography>
      ) : (
        <>
        <Box
          display="grid"
          gridTemplateColumns="repeat(16, 1fr)"
          gap="5px"
          gridAutoRows="30px"
          mb="5px"
        >
          <Card sx={{ gridColumn: "span 4", borderRadius: "8px", boxShadow: 3, backgroundColor:"#C1CCE6" }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center", // horizontal center
                alignItems: "center",     // vertical center
                height: "100%",           // make it fill the card height
              }}
            >
              <Typography variant="h6" sx={{fontWeight : "bold", alignContent:"center"}}>Safety</Typography>
            </CardContent>
          </Card>
          <Card sx={{ gridColumn: "span 4", borderRadius: "8px", boxShadow: 3, backgroundColor:"#C1CCE6" }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center", // horizontal center
                alignItems: "center",     // vertical center
                height: "100%",           // make it fill the card height
              }}
            >
              <Typography variant="h6" sx={{fontWeight : "bold", alignContent:"center"}}>Quality</Typography>
            </CardContent>
          </Card>
          <Card sx={{ gridColumn: "span 4", borderRadius: "8px", boxShadow: 3, backgroundColor:"#C1CCE6" }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center", // horizontal center
                alignItems: "center",     // vertical center
                height: "100%",           // make it fill the card height
              }}
            >
              <Typography variant="h6" sx={{fontWeight : "bold", alignContent:"center"}}>Productivity</Typography>
            </CardContent>
          </Card>
          <Card sx={{ gridColumn: "span 4", borderRadius: "8px", boxShadow: 3, backgroundColor:"#C1CCE6" }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center", // horizontal center
                alignItems: "center",     // vertical center
                height: "100%",           // make it fill the card height
              }}
            >
              <Typography variant="h6" sx={{fontWeight : "bold", alignContent:"center"}}>Cost</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns="repeat(16, 1fr)"
          gap="5px"
          gridAutoRows="160px"
        >
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLSafety1 chartData={safetyData} date={date}/>
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLQual1 chartData={data} date={date}/>
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLProd1 chartData={data} date={date}/>
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLCost1 chartData={data} customer={customer} date={date}/>
          </Box>
          <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLSafety2 chartData={safetyData} date={date}/>
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLQual2 chartData={data} date={date}/>
          </Box>
          <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLProd2 chartData={data} date={date}/>
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLCost2 chartData={data} date={date}/>
          </Box>
          
          
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLQual3 chartData={data} date={date}/>
          </Box>
          
          
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLCost3 chartData={data} date={date}/>
          </Box>
        </Box> 
        </>
      )}
    </Paper>
    // </Box>
  );
}

import React, { useEffect, useState } from "react";
import {Typography,Paper,Box,TextField,MenuItem,useTheme, Card, CardContent} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import {PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,CartesianGrid} from "recharts";
import { tokens } from "../../theme";
import FourMCard from "../../components/GL4MCard1";
import FourMPieChart from "../../components/GL4MPie";
import FourMLineChart from "../../components/GL4MBar2";
import FourMTable from "../../components/GLfourmTable";

export default function GL4MDash() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [line, setLine] = useState("8");
  const [area, setArea] = useState("PP02");
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));

  // ================= FETCH GL BOARD DATA ==================
  useEffect(() => {
    const fetchGLData = async () => {
      try {
        setLoading(true);
        let url = `http://163.125.102.142:5000/api/4mboard?month=${month}`;
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

  return (
    <Paper sx={{ p: 2, borderRadius: 3, }}>
      {/* Header with Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#1976d2"
        color="white"
        p={2}
        borderRadius={2}
        mb={3}
      >
        
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            type="month"
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputLabel-root.Mui-focused": { color: "black" },
            }}
          />
          <TextField
            size="small"
            value={area}
            label="Area"
            onChange={(e) => setArea(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
            }}
            disabled
          />
          <TextField
            select
            size="small"
            label="Line"
            value={line}
            onChange={(e) => setLine(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
            }}
          >
            <MenuItem value="">All Lines</MenuItem>
            {[1, 2, 3, 4, 5, 6, 8].map((num) => (
              <MenuItem key={num} value={num}>
                Line {num}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Typography variant="h1" fontWeight="bold" marginRight= "300px">
          4M Change Management
        </Typography>
        <img 
          src="/assets/logo.jpg" 
          alt="Logo" 
          style={{ width: "60px", height: "40px" }} 
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
          gridAutoRows="300px"
          mb="5px"
        >
          <Box gridColumn="span 2" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <FourMCard chartData={data}/>
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <FourMPieChart chartData={data}/>
          </Box>
          <Box gridColumn="span 10" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <FourMLineChart chartData={data}/>
          </Box>
          <Box gridColumn="span 16" gridRow="span 2" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px" marginTop="10px">
            <FourMTable chartData={data}/>
          </Box>
        </Box>
        </>
      )}
    </Paper>
  );
}

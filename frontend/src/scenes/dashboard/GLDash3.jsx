import React, { useEffect, useState } from "react";
import {Typography,Paper,Box,TextField,MenuItem,useTheme,} from "@mui/material";
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

export default function GLDash3() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
  const [line, setLine] = useState("8");
  const [area, setArea] = useState("PP02");
  const [loading, setLoading] = useState(true);
  const [loadingSafety, setLoadingSafety] = useState(true);
  const [loadingIncident, setLoadingIncident] = useState(true);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));

  const pieColors = ["#1976d2", "#ef5350", "#ffb300", "#66bb6a", "#ab47bc"];

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

  return (
    <Paper sx={{ p: 2, borderRadius: 3, ml: "80px" }}>
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
        <Typography variant="h5" fontWeight="bold">
          GL Board
        </Typography>

        {/* Filters */}
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
      </Box>

      {/* Dashboard Content */}
      {loading ? (
        <Typography>Loading Dashboard.....</Typography>
      ) : data.length === 0 ? (
        <Typography color="text.secondary">
          No Data Found for the Selected Filters
        </Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap="5px"
          gridAutoRows="250px"
        >
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLSafety1 chartData={safetyData} />
          </Box>
          <Box gridColumn="span 8" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLSafety2 chartData={safetyData} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLQual1 chartData={data} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLQual2 chartData={data} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLQual3 chartData={data} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLProd1 chartData={data} />
          </Box>
          <Box gridColumn="span 8" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLProd2 chartData={data} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLCost1 chartData={data} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLCost2 chartData={data} />
          </Box>
          <Box gridColumn="span 4" backgroundColor={colors.whitebg[200]} boxShadow="0px 4px 10px rgba(0,0,0,0.25)" borderRadius="10px">
            <GLCost3 chartData={data} />
          </Box>
        </Box> 
      )}
    </Paper>
  );
}

import React, { useEffect, useState } from "react";
import {
  Grid, Card, CardContent, Typography, Paper, Box,
  TextField, MenuItem
} from "@mui/material";
import GaugeChart from "react-gauge-chart";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { yearCalendarClasses } from "@mui/x-date-pickers";
 
export default function GLDash() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [line, setLine] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    let url = `http://163.125.102.142:5000/api/glboard?date=${date}`
    if (line) {
      url += `&line=${line}`
    }
    axios.get(url)
    .then((res) => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(`Error Fecthing Data : `, err);
      setLoading(false);
    }) 
  },[date, line])

  const latest = data.length > 0 ? data[0] : null;
  const today = latest ? dayjs(latest.date).format("YYYY-MM-DD") : null;
 
  return (
    <Paper sx={{ p: 2, borderRadius: 3, ml:"80px"}}>
      {/* Header with Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#1976d2"
        color="white"
        height="100%"
        p={2}
        borderRadius={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">GL Board</Typography>
 
        {/* Filters */}
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <TextField
            select
            size="small"
            value={line}
            onChange={(e) => setLine(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1, minWidth: 120 }}
            displayEmpty
          >
            <MenuItem value="">All Lines</MenuItem>
            {[1, 2, 3, 4, 5, 6, 8].map(num => (
              <MenuItem key={num} value={num}>Line {num}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      {loading ? (<Typography>Loading Dashboard.....</Typography>) : data.length ===0 ? (<Typography color="text.secondary">No Data Found for the Selected Filters</Typography>) : (
        <>
          <Typography variant="body1" mb={2}>
            Showing data for: {today} &nbsp;|&nbsp; Line- {latest.line}
          </Typography>
    
          {/* Safety & Action Plan */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Safety</Typography>
                  <Typography variant="h5">{latest.safety}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
          onClick={() => navigate("/ap")}
          style={{ cursor: "pointer" }}
        >
          <CardContent>
            <Typography variant="h6">Action Plan</Typography>
            <Typography variant="h5">{latest.safety_action_plan}</Typography>
          </CardContent>
        </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Cost (Energy)</Typography>
                  <Typography variant="h5">₹{latest.cost_energy}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Cost (Direct)</Typography>
                  <Typography variant="h5">₹{latest.cost_direct_material}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Abnormality Management</Typography>
                  <Typography variant="h5">{latest.abnormality_management}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
    
          {/* Gauges */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
              <Card>
                <CardContent align="center">
                  <Typography variant="subtitle1">Line Rejection</Typography>
                  <GaugeChart
                    id="line-rejection"
                    nrOfLevels={20}
                    percent={latest.line_rejection_percent / 100}
                    colors={["#00C853", "#FFEB3B", "#D50000"]}
                    arcWidth={0.3}
                    textColor="#000"
                    formatTextValue={() => `${latest.line_rejection_percent}%`}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent align="center">
                  <Typography variant="subtitle1">Startup Scrap</Typography>
                  <GaugeChart
                    id="startup-scrap"
                    nrOfLevels={20}
                    percent={latest.startup_scrap / 100}
                    colors={["#FF9800", "#FFEB3B", "#D50000"]}
                    arcWidth={0.3}
                    textColor="#000"
                    formatTextValue={() => `${latest.startup_scrap}%`}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent align="center">
                  <Typography variant="subtitle1">Overall Rejection</Typography>
                  <GaugeChart
                    id="overall-rejection"
                    nrOfLevels={20}
                    percent={latest.overall_rejection_percent / 100}
                    colors={["#FFEB3B", "#FF9800", "#D50000"]}
                    arcWidth={0.3}
                    textColor="#000"
                    formatTextValue={() => `${latest.overall_rejection_percent}%`}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent align="center">
                  <Typography variant="subtitle1">Productivity Efficiency</Typography>
                  <GaugeChart
                    id="productivity-efficiency"
                    nrOfLevels={20}
                    percent={latest.productivity_efficiency_percent / 100}
                    colors={["#D50000", "#FFEB3B", "#00C853"]}
                    arcWidth={0.3}
                    textColor="#000"
                    formatTextValue={() => `${latest.productivity_efficiency_percent}%`}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
}
 
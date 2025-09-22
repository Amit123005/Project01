import React, { useEffect, useState } from "react";
import {  Box,TextField,  MenuItem,Typography,Table,TableHead,TableRow,TableCell,TableBody,Paper,} from "@mui/material";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

export default function GLTable() {
  const [month, setMonth] = useState(""); 
  const [area, setArea] = useState(""); 
  const [line, setLine] = useState(""); 
  const [data, setData] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const incomingDate = params.get("date");
  const incomingMonth = params.get("month");
  const incomingArea = params.get("area");
  const incomingLine = params.get("line");

  // Fetch data with filters
  const fetchData = async () => {
    let url = "http://163.125.102.142:5000/api/gl_tab?";
    if (incomingDate) {
      url += `date=${incomingDate}&`
    }else {
      if (month) url += `month=${month}&`;
      if (area) url += `area=${encodeURIComponent(area)}&`;
      if (line) url += `line=${line}&`;
    }
    
    

    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching GL Board KPIs:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, area, line, incomingDate]);

  return (
    <Box sx={{ p: 2, ml: "80px" }}>
      {/* Filters */}
      {!incomingDate && (
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <TextField
            type="month"
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <TextField
            size="small"
            value={area}
            label="Plant"
            onChange={(e) => setArea(e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Line"
            value={line}
            onChange={(e) => setLine(e.target.value)}
          >
            <MenuItem value="">All Lines</MenuItem>
            {["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 8"].map(
              (num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              )
            )}
          </TextField>
        </Box>
      )}

      {/* Table */}
      <Paper sx={{ mt: 3, overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                "ID","Date","Plant","Line","Model","Part Name",
                "Line Rejection","Startup Rejection","FR(Target)","RR(Target)","FR(Actual)","RR(Actual)",
                "FR(Part Weight)","RR(Part Weight)","FR(Part Length)","RR(Part Length)","Change Over Time","Setup Time","Breakdown",
                "Duration","Run Time","Efficiency","Production Target","Production Actual","GPM",
                "Consumption","Line Rejection %","Overall Rejection %","Hand Gloves",
                "Created At","Indirect Cost","Corrogard",
                "Old Dhoti","Start Reading","End Reading"
              ].map((col) => (
                <TableCell key={col} sx={{ fontWeight: "bold" }}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={43} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date ? dayjs(row.date).format("YYYY-MM-DD") : "NA"}</TableCell>
                  <TableCell>{row.plant}</TableCell>
                  <TableCell>{row.line}</TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.part_name}</TableCell>
                  <TableCell>{row.line_rej}</TableCell>
                  <TableCell>{row.startup_rej}</TableCell>
                  <TableCell>{row.fr_target}</TableCell>
                  <TableCell>{row.rr_target}</TableCell>
                  <TableCell>{row.fr_act}</TableCell>
                  <TableCell>{row.rr_act}</TableCell>
                  <TableCell>{row.fr_wt}</TableCell>
                  <TableCell>{row.rr_wt}</TableCell>
                  <TableCell>{row.fr_len}</TableCell>
                  <TableCell>{row.rr_len}</TableCell>
                  <TableCell>{row.co_time}</TableCell>
                  <TableCell>{row.setup_time}</TableCell>
                  <TableCell>{row.dt_time}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.run_time}</TableCell>
                  <TableCell>{row.efficiency}</TableCell>
                  <TableCell>{row.prod_target}</TableCell>
                  <TableCell>{row.prod_act}</TableCell>
                  <TableCell>{row.gpm}</TableCell>
                  <TableCell>{row.consumption}</TableCell>
                  <TableCell>{row.line_rej_perc}</TableCell>
                  <TableCell>{row.overall_rej_perc}</TableCell>
                  <TableCell>{row.hand_gloves}</TableCell>
                  <TableCell>{row.created_at ? dayjs(row.created_at).format("YYYY-MM-DD HH:mm") : "NA"}</TableCell>
                  <TableCell>{row.indirect_cost}</TableCell>
                  <TableCell>{row.corrogard}</TableCell>
                  <TableCell>{row.old_dhoti}</TableCell>
                  <TableCell>{row.start_reading}</TableCell>
                  <TableCell>{row.end_reading}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

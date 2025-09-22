import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";

export default function GLPointsMgmt() {
  const [month, setMonth] = useState(""); 
  const [area, setArea] = useState(""); 
  const [line, setLine] = useState(""); 
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const incomingStatus = params.get("status");
  const incomingStatus2 = params.get("status2");
  const incomingDate = params.get("date");

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setStatus(row.status || "Open"); // Default to Open if empty
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSubmitStatus = async () => {
    if (!selectedRow) return;

    try {
      const res = await fetch(`http://163.125.102.142:5000/api/gl_points/${selectedRow.id}`, {
        method: "PUT", // Use PUT for update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchData(); // Refresh table
        handleClose();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // Fetch data with filters
  const fetchData = async () => {
    let url = "http://163.125.102.142:5000/api/gl_points?";
    if (month) url += `month=${month}&`;
    if (area) url += `area=${encodeURIComponent(area)}&`;
    if (line) url += `line=${line}&`;

    const res = await fetch(url);
    const json = await res.json();
    let filteredData = json;
    if (incomingStatus) {
      filteredData = json.filter((item) => item.category === incomingStatus);
    }
    if(incomingStatus2 && incomingStatus){
      filteredData = json.filter((item) => item.status===incomingStatus2 && item.category === incomingStatus )
    }

    setData(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, [month, area, line]);

  return (
    <Box sx={{ p: 2, ml: "80px" }}>
      {/* Filters */}
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
          label="Area"
          onChange={(e) => setArea(e.target.value)}
          disabled
        />
        <TextField
          select
          size="small"
          label="Line"
          value={line}
          onChange={(e) => setLine(e.target.value)}
        >
          <MenuItem value="">All Lines</MenuItem>
          {[1, 2, 3, 4, 5, 6, 8].map((num) => (
            <MenuItem key={num} value={num}>
              Line {num}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Plant</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Incident Category</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Responsibility</TableCell>
              <TableCell>Cause</TableCell>
              <TableCell>Counter Measure</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.plant}</TableCell>
                  <TableCell>{row.sub_area}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.incident_cat}</TableCell>
                  <TableCell>{row.detail}</TableCell>
                  <TableCell>{row.responsibility}</TableCell>
                  <TableCell>{row.cause}</TableCell>
                  <TableCell>{row.counter_measure}</TableCell>
                  <TableCell>{row.target_date}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal for status update */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            minWidth: 300,
          }}
        >
          <Typography variant="h6" mb={2}>
            Update Status
          </Typography>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmitStatus}
            sx={{ backgroundColor: "#154c79" }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

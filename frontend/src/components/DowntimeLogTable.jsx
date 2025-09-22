import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  CircularProgress, Typography, Box, IconButton, Tooltip, FormControl,
  InputLabel, Select, MenuItem, OutlinedInput, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Button
} from "@mui/material";
import { Download, Refresh, InfoOutlined, Save } from "@mui/icons-material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useLocation } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const DowntimeLogTable = () => {

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [downtimeData, setDowntimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [newDepartment, setNewDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState(null);

  useEffect(() => {
    fetch("http://163.125.102.142:5000/api/downtime_logs")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => b.id - a.id);
        setDowntimeData(sortedData);
        setFilteredData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching downtime data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = downtimeData;
    if (selectedMachines.length > 0) {
      filtered = filtered.filter((item) => selectedMachines.includes(item.machine_id));
    }
    if (selectedMonth) {
      filtered = filtered.filter((item) => dayjs(item.start_time).format("YYYY-MM") === selectedMonth);
    }
    setFilteredData(filtered);
  }, [selectedMachines, selectedMonth, downtimeData]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Downtime Logs");
    XLSX.writeFile(workbook, "Downtime_Log.xlsx");
  };

  const handleOpenDialog = (log) => {
    setLoadingRowId(log.id); // show spinner for this row
    setSelectedLog(log);
    setNewDepartment(log.department || "");
    setOpenDialog(true);
    setTimeout(() => setLoadingRowId(null), 500); // simulate loading time (optional)
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
  };

  const handleSaveReason = () => {
    if (!selectedLog) return;
  
    fetch("http://163.125.102.142:5000/api/downtime_update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedLog.id,
        department: newDepartment,
      }),
    })
      .then((response) => response.json())
      .then((updatedLog) => {
        setDowntimeData((prevData) =>
          prevData.map((log) =>
            log.id === selectedLog.id ? { ...log, department: newDepartment } : log
          )
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating reason:", error));
  };
  

  return (
    <Box height = "100%" sx={{ marginLeft: "80px", p: 3, background:"#ebeffa"}}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "#0B3D91" }}>
        Downtime Log Table
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel>Line</InputLabel>
            <Select 
              multiple
              value={selectedMachines}
              onChange={(e) => setSelectedMachines(e.target.value)}
              input={<OutlinedInput label="Line" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {[...new Set(downtimeData.map((item) => item.area))].map((id) => (
                <MenuItem key={id} value={id}>{id}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(downtimeData.map((item) => dayjs(item.start_time).format("YYYY-MM")))].map((month) => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => window.location.reload()} size="small">
              <Refresh color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download as Excel">
            <IconButton onClick={handleDownload} size="small">
              <Download color="success" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#3399AE" }}>
              <TableRow>
                {["Downtime ID", "Area", "Plan ID", "Start Time", "End Time","Status", "Department", "Reason", "Duration (Mins.)", "Edit"].map((header) => (
                  <TableCell key={header} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
  {filteredData.length > 0 ? (
    filteredData.map((row) => {
      const isHighlight = !row.department; // Highlight if department is empty

      return (
        <TableRow
          key={row.id}
          sx={{
            backgroundColor: isHighlight ? "#fff7b2" : "inherit", // Light yellow for highlight
          }}
        >
          <TableCell align="center">{row.id}</TableCell>
          <TableCell align="center">{row.area}</TableCell>
          <TableCell align="center">{row.plan_id}</TableCell>
          <TableCell align="center">
            {dayjs.utc(row.start_time).format("YYYY-MM-DD HH:mm")}
          </TableCell>
          <TableCell align="center">
            {dayjs.utc(row.end_time).format("YYYY-MM-DD HH:mm")}
          </TableCell>
          <TableCell align="center">{row.status}</TableCell>
          <TableCell align="center">{row.department}</TableCell>
          <TableCell align="center">{row.reason}</TableCell>
          <TableCell align="center" sx={{ fontWeight: "bold", color: "darkred" }}>
            {(row.duration).toFixed(2)}
          </TableCell>
          <TableCell align="center">
            <Tooltip title="Update Reason">
            <IconButton onClick={() => handleOpenDialog(row)} size="small">
  {loadingRowId === row.id ? (
    <CircularProgress size={20} color="info" />
  ) : (
    <AssignmentTurnedInIcon color="primary" />
  )}
</IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={8} align="center">
        <Typography color="gray">No downtime records found.</Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Reason Dialog */}
      <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  PaperProps={{
    sx: {
      width: 300, // you can adjust width and height here
      height: 250,
    },
  }}
>
  <DialogTitle>
  <Typography fontWeight="bold">Please Select Department</Typography>
</DialogTitle>
  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
    <FormControl fullWidth>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Department
      </Typography>
      <Select
        value={newDepartment}
        onChange={(e) => setNewDepartment(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>Select Department</MenuItem>
        <MenuItem value="Production">Production</MenuItem>
        <MenuItem value="Maintenance">Maintenance</MenuItem>
        <MenuItem value="PPC">PPC</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Quality">Quality</MenuItem>
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={handleSaveReason}
      startIcon={<Save />}
      variant="contained"
      color="primary"
      disabled={!newDepartment}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default DowntimeLogTable;

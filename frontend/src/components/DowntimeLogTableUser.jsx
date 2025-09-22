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
import { useAuth } from "../context/AuthProvider";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

const DowntimeLogTableUser = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [downtimeData, setDowntimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [newReason, setNewReason] = useState("");
  const { department } = useAuth();
 
  const departmentReasons = {
    Production: ["SETUP", "CHANGE OVER", "DOWNTIME", "PRD05", "PRD06", "PRD07", "PRD08", "PRD09", "PRD10"],
    Maintenance: ["POWER CUT", "MACHINE BREAKDOWN", "MTN03", "MTN04", "MTN05", "MTN06", "MTN07", "MTN08", "MTN09", "MTN10"],
    PPC: ["NO PLAN", "MATERIAL SHORTAGE", "PPC03", "PPC04", "PPC05", "PPC06", "PPC07", "PPC08", "PPC09", "PPC10"],
    Admin: ["MANPOWER SHORTAGE", "AD02", "AD03", "AD04", "AD05", "AD06", "AD07", "AD08", "AD09", "AD10"],
    Quality: ["AS PER CUSTOMER STANDARD PART NOT OK", "QC02", "QC03", "QC04", "QC05", "QC06", "QC07", "QC08", "QC09", "QC10"],
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://163.125.102.142:5000/api/get_breakdown", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: department,
          }),
        });
        const data = await response.json();
        console.log("Response:", data);
        console.log("Current department:", department);
        setDowntimeData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [department]);
 
  useEffect(() => {
    let filtered = downtimeData;
    if (selectedMachines.length > 0) {
      filtered = filtered.filter((item) => selectedMachines.includes(item.machine_id));
    }
    if (selectedMonth) {
      filtered = filtered.filter((item) => dayjs(item.start_time).format("YYYY-MM") === selectedMonth);
    }
 
    // Sort the filtered data by start_time in descending order (latest first)
    filtered = filtered.sort((a, b) => dayjs(b.start_time).unix() - dayjs(a.start_time).unix());
 
    setFilteredData(filtered);
  }, [selectedMachines, selectedMonth, downtimeData]);
 
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Downtime Logs");
    XLSX.writeFile(workbook, "Downtime_Log.xlsx");
  };
 
  const handleOpenDialog = (log) => {
    setSelectedLog(log);
    setNewReason(log.reason || "");
    setOpenDialog(true);
  };
 
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
    setNewReason("");
  };
 
  const handleSaveReason = () => {
    if (!selectedLog) return;
 
    fetch("http://163.125.102.142:5000/api/downtime_reason", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedLog.id,
        reason: newReason,
      }),
    })
      .then((response) => response.json())
      .then((updatedLog) => {
        setDowntimeData((prevData) =>
          prevData.map((log) =>
            log.id === selectedLog.id ? { ...log, reason: newReason} : log
          )
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating reason:", error));
  };
 
 
  return (
    <Box sx={{ marginLeft: "80px", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "#0B3D91" }}>
        Downtime Log Table
      </Typography>
 
      {/* Filters */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel>Machines</InputLabel>
            <Select
              multiple
              value={selectedMachines}
              onChange={(e) => setSelectedMachines(e.target.value)}
              input={<OutlinedInput label="Machines" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {[...new Set(downtimeData.map((item) => item.machine_id))].map((id) => (
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
                {["Downtime ID", "Machine Name", "Mould ID", "Start Time", "End Time","Status", "Department", "Reason", "Duration (mins)", "Edit"].map((header) => (
                  <TableCell key={header} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => {
                // Get the current time
                const currentTime = dayjs.utc();
 
                // Calculate the duration between the current time and the 'start_time'
                const dept_time = dayjs.utc(row.dept_time);
                const timeDiffInMinutes = currentTime.diff(dept_time, 'minute');
 
                // Check if the duration is less than 30 minutes
                const isIconEnabled = true;
                {/* const isIconEnabled = timeDiffInMinutes < 30; */}
 
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: !row.reason ? "#FFF9C4" : "inherit", // Light yellow if reason is blank
                    }}
                  >
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.machine_id}</TableCell>
                    <TableCell align="center">{row.mould_id}</TableCell>
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
                      {(row.duration ).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Update Reason">
                        <IconButton
                          onClick={() => handleOpenDialog(row)}
                          size="small"
                          disabled={!isIconEnabled}
                        >
                          <ModeEditOutlineIcon color={isIconEnabled ? 'primary' : 'disabled'} />
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
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{
    sx: {
      width: 300, // you can adjust width and height here
      height: 250,
    },
  }}
>
      <DialogTitle>
  <Typography fontWeight="bold">Please Select Reason </Typography>
</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
 
          <FormControl fullWidth>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Select Reason
                  </Typography>
            <Select
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              // input={<OutlinedInput label="Reason" />}
            >
              {(departmentReasons[department] || []).map((reasonCode) => (
                <MenuItem key={reasonCode} value={reasonCode}>
                  {reasonCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveReason}
            startIcon={<Save />}
            variant="contained"
            color="primary"
            disabled={!newReason}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
 
export default DowntimeLogTableUser;
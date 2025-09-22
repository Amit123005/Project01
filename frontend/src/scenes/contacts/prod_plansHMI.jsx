import { Box, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography } from "@mui/material";
import { useState, useEffect, react } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import { LocalizationProvider, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const Prod_plansHMI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState('A');
  const [area, setArea] = useState('Line 8');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState('');
  const [model, setmodel] = useState('');
  const [partna, setpartna] = useState('');
  const [date, setdate] = useState(null);
  const [time, settime] = useState(null);
  const [model2, setmodel2] = useState('');
  const [partna2, setpartna2] = useState('');
  const [partno, setpartno] = useState('');
  const [target_qty, settarget_qty] = useState('');
  const [plan_qty, setplan_qty] = useState('');
  const [operator_name, setoperator_name] = useState('');
  const [supervisor_name, setsupervisor_name] = useState('');
  const [status2, setstatus2] = useState('');
  const [Modelnew, setModelnew] = useState('');
  const [Partnanew, setPartnanew] = useState('');


  const handleSubmit = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/update_plan2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: selectedId,
          status: status,
          target: target,
          model: model,
          partna: partna,
          modelnew:model,
          partnanew: partna
        }),
      });

      if (response.ok) {
        handleClose();
        console.log("Plan updated successfully");
      } else {
        console.error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = (id, model2, partna2) => {
    setOpen(true);
    setSelectedId(id);
    setModelnew(model2); 
    setPartnanew(partna2);
  };
  const handleOpen2 = (id) => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
  
        const response = await fetch(`http://163.125.102.142:5000/api/prod_plans_HMI?start_date=${startDate}&end_date=${endDate}`);
        const result = await response.json();
  
        const transformedData = result.map((item, index) => ({
          id: index,
          Date: item.Date,
          Time: item.Time,
          'Plan ID': item['Plan ID'],
          'Part Name': item['Part Name'],
          'Part Number': item['Part Number'],
          'Target Quantity': item['Target Quantity'],
          'Plan Quantity': item['Plan Quantity'],
          Model: item.Model,
          Status: item.Status,
          Shift: item.Shift
        }));
  
        setData(transformedData);
        console.log(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [dateRange, shift, area]);

  const handleShiftChange = (event) => {
    setShift(event.target.value);
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const columns = [
    { field: "Date", headerName: "Date", headerAlign: "left", align: "left", flex: 0.7 },
    { field: "Time", headerName: "Time", headerAlign: "left", align: "left", flex: 0.7 },
    { field: "Plan ID", headerName: "Plan ID", flex: 0.5 },
    { field: "Part Name", headerName: "Part Name", flex: 0.7 },
    { field: "Part Number", headerName: "Part Number", flex: 0.7 },
    { field: "Target Quantity", headerName: "Target Quantity", flex: 0.7 },
    { field: "Plan Quantity", headerName: "Plan Quantity", flex: 0.7 },
    { field: "Model", headerName: "Model", flex: 0.5 },
    { field: "Status", headerName: "Status", flex: 0.7 },
    { field: "Shift", headerName: "Shift", flex: 0.7 }
  ];

  return (
    <Box m="20px">
      <Header title="Production Planning" />
      
      <Box mb="25px" display="flex" justifyContent="left" alignItems="center" gap="10px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ width: 250, padding: 1 }}>
            <DateRangePicker
              startText="Start"
              endText="End"
              value={dateRange}
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

        {/* <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ ml: 2.5 }}>Shift</InputLabel>
          <Select
            value={shift}
            onChange={handleShiftChange}
            label="Shift"
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
        </FormControl> */}

        {/* <Box ml="20px">
          <Button variant="contained" color="secondary" onClick={(params2) => handleOpen2()} sx={{ ml: 75 }}>
            Add New Plan
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadCSV} sx={{ ml: 2 }}>
            Download CSV
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadExcel} sx={{ ml: 2 }}>
            Download Excel
          </Button>
        </Box> */}
      </Box>

      <Box m="40px 0 0 0" height="75vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          sortModel={[
            {
              field: 'Plan ID', // Replace 'Plan ID' with the exact key used in your data object for Plan ID
              sort: 'desc',    // Sort in descending order
            },
          ]}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => handleOpen(params.row['Plan ID'], params.row['Model'], params.row['Part Name'])}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Form for Plan ID: {selectedId}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Status</Typography>
          <Select
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Model</Typography>
          <Select
            label="Model"
            fullWidth
            value={model}
            onChange={(e) => setmodel(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="800L">800L</MenuItem>
            <MenuItem value="613T">613T</MenuItem>
            <MenuItem value="YJC">YJC</MenuItem>
            <MenuItem value="YCA">YCA</MenuItem>
            <MenuItem value="YHB">YHB</MenuItem>
            <MenuItem value="Y1K">Y1K</MenuItem>
            <MenuItem value="2TG">2TG</MenuItem>
            <MenuItem value="YAD">YAD</MenuItem>
            <MenuItem value="YL1">YL1</MenuItem>
            <MenuItem value="X445">X445</MenuItem>
            <MenuItem value="YL8">YL8</MenuItem>
            <MenuItem value="I10">I10</MenuItem>
            <MenuItem value="BOLERO">BOLERO</MenuItem>
            <MenuItem value="YE3">YE3</MenuItem>
            <MenuItem value="YL7">YL7</MenuItem>
            <MenuItem value="YP8">YP8</MenuItem>
            <MenuItem value="2WF">2WF</MenuItem>
            <MenuItem value="2CT">2CT</MenuItem>
            <MenuItem value="ALTO">ALTO</MenuItem>
            <MenuItem value="SCORPIO">SCORPIO</MenuItem>
            <MenuItem value="YOM">YOM</MenuItem>
            <MenuItem value="ZS11">ZS11</MenuItem>
            <MenuItem value="YWD">YWD</MenuItem>
            <MenuItem value="31XA">31XA</MenuItem>
            <MenuItem value="Curvv">Curvv</MenuItem>
            
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Part Name</Typography>
          <Select
            label="Part Name"
            fullWidth
            value={partna}
            onChange={(e) => setpartna(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="W/S Inner FR">W/S Inner FR</MenuItem>
            <MenuItem value="W/S Inner RR">W/S Inner RR</MenuItem>
            <MenuItem value="W/S Outer FR">W/S Outer FR</MenuItem>
            <MenuItem value="W/S Outer RR">W/S Outer RR</MenuItem>
            <MenuItem value="Insert FR">Insert FR</MenuItem>
            <MenuItem value="Insert RR">Insert RR</MenuItem>
            <MenuItem value="GRC FR">GRC FR</MenuItem>
            <MenuItem value="GRC RR">GRC RR</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Target</Typography>
          <TextField
            label="Target"
            fullWidth
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            sx={{ mt: 2 }}
          />
          {/* Add more form fields as needed */}
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Prod_plansHMI;

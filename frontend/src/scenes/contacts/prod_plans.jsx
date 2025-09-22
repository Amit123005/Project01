import { Box,Grid, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect, react, useRef } from "react";
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

const Prod_plans = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  // const [shift, setShift] = useState(['A']);
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
  const [status2, setstatus2] = useState('Inactive');
  const [man, setman] = useState('');
  const [machine, setmachine] = useState('');
  const [material, setmaterial] = useState('');
  const [material2, setmaterial2] = useState('');
  const [material3, setmaterial3] = useState('');
  const [material4, setmaterial4] = useState('');
  const [Modelnew, setModelnew] = useState('');
  const [Partnanew, setPartnanew] = useState('');
  const [openDel, setOpenDel] = useState(false);
  const [plan_id_del, setplan_id_del] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [file, setFile] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});
  const fileInputRef = useRef(null);
  

  const getCurrentShift = () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 6 && hours < 14) return ["A"];   // 06:00 – 14:00
  if (hours >= 14 && hours < 22) return ["B"];  // 14:00 – 22:00
  return ["C"];                                 // 22:00 – 06:00
};
const [shift, setShift] = useState(getCurrentShift());

useEffect(() => {
  const interval = setInterval(() => {
    setShift(getCurrentShift());
  }, 5 * 60 * 1000); // check every 5 minutes

  return () => clearInterval(interval); // cleanup on unmount
}, []);


  const handleSubmit = async () => {
  const updatedFields = {};

  if (status !== initialFormData.status) updatedFields.status = status;
  if (model !== initialFormData.model) updatedFields.model = model;
  if (partna !== initialFormData.partna) updatedFields.partna = partna;
  if (target !== initialFormData.target) updatedFields.target = target;
  if (man !== initialFormData.man) updatedFields.man = man;
  if (machine !== initialFormData.machine) updatedFields.machine = machine;
  if (material !== initialFormData.material) updatedFields.material = material;
  if (material2 !== initialFormData.material2) updatedFields.material2 = material2;
  if (material3 !== initialFormData.material3) updatedFields.material3 = material3;
  if (material4 !== initialFormData.material4) updatedFields.material4 = material4;
  updatedFields.modelnew = model;
  updatedFields.partnanew = partna;
  updatedFields.linenew = machine;

  if (Object.keys(updatedFields).length === 0) {
    setAlertMessage("No changes detected.");
    setAlertType("info");
    return;
  }

  updatedFields.plan_id = selectedId;

  try {
    const response = await fetch('http://163.125.102.142:5000/api/update_plan2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });

    if (response.ok) {
      handleClose();
      setAlertMessage("Plan updated successfully!");
      setAlertType("success");
      window.location.reload();
    } else {
      console.error("Failed to update plan");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


  const handleSubmitDel = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this plan?");
  if (!confirmDelete) {
    return; // stop if user cancels
  }
    try {
      const response = await fetch('http://163.125.102.142:5000/api/delete_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: plan_id_del,
        }),
      });

      if (response.ok) {
        handleCloseDel();
        setAlertMessage("Plan deleted successfully!");
        setAlertType("success");
        window.location.reload();
      } else {
        console.error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadFile(selectedFile); // call upload as soon as file is selected
    }
  };
   
  const uploadFile = async (selectedFile) => {
    if (!selectedFile) return alert("No file selected");
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const res = await axios.post('http://163.125.102.142:5000/api/bulk_plan', formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleSubmit2 = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/add_plan2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          time: time,
          model: model2,
          partna: partna2,
          partno: partno,
          target_qty: target_qty,
          plan_qty: plan_qty,
          operator_name: operator_name,
          supervisor_name: supervisor_name,
          status: status2,
          force: false // initially false
        }),
      });
  
      if (response.status === 200) {
        handleClose2();
        setAlertMessage("Plan added successfully!");
        setAlertType("success");
        window.location.reload();
      } else if (response.status === 409) {
        const confirmReplace = window.confirm("An active plan already exists. Do you want to mark it as completed and continue?");
        if (confirmReplace) {
          // Send again with force=true
          const forcedResponse = await fetch('http://163.125.102.142:5000/api/add_plan2', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              date: date,
              time: time,
              model: model2,
              partna: partna2,
              partno: partno,
              target_qty: target_qty,
              plan_qty: plan_qty,
              operator_name: operator_name,
              supervisor_name: supervisor_name,
              status: status2,
              force: true
              
            }),
          });
  
          if (forcedResponse.ok) {
            handleClose2();
            setAlertMessage("Previous active plan marked as completed. New plan added successfully!");
            setAlertType("success");
            window.location.true();
          } else {
            console.error("Failed to add plan after confirmation.");
          }
        }
      } else {
        console.error("Failed to add plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = (id, modelVal, partnaVal) => {
  setOpen(true);
  setSelectedId(id);
  setModelnew(modelVal);
  setPartnanew(partnaVal);

  // Assuming these values are fetched from your data table
  const selectedRow = data.find(item => item['Plan ID'] === id);
  if (selectedRow) {
    const formValues = {
      status: selectedRow.Status || '',
      model: selectedRow.Model || '',
      partna: selectedRow['Part Name'] || '',
      target: selectedRow['Target Quantity'] || '',
      man: selectedRow.operator || '',
      machine: selectedRow.line || '',
      material: selectedRow.ext1 || '',
      material2: selectedRow.ext2 || '',
      material3: selectedRow.ext3 || '',
      material4: selectedRow.ext4 || '',
    };

    // Set state with pre-filled data
    setInitialFormData(formValues);
    setStatus(formValues.status);
    setmodel(formValues.model);
    setpartna(formValues.partna);
    setTarget(formValues.target);
    setman(formValues.man);
    setmachine(formValues.machine);
    setmaterial(formValues.material);
    setmaterial2(formValues.material2);
    setmaterial3(formValues.material3);
    setmaterial4(formValues.material4);
  }
};
  const handleOpen2 = (id) => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleOpenDel = () => setOpenDel(true);
  const handleCloseDel = () => setOpenDel(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
  
        const response = await fetch(`http://163.125.102.142:5000/api/prod_plans?start_date=${startDate}&end_date=${endDate}&shift=${shift}&area=${area}`);
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
          operator: item.operator_name,
          ext1: item.ext1,
          ext2: item.ext2,
          ext3: item.ext3,
          ext4: item.ext4,
          line: item.line,
          'Type 1': item['Type 1'],
          'Downtime 1 Duration': item['Downtime 1 Duration'],
          'Type 2': item['Type 2'],
          'Downtime 2 Duration': item['Downtime 2 Duration'],
          'Type 3': item['Type 3'],
          'Downtime 3 Duration': item['Downtime 3 Duration'],
          'Type 4': item['Type 4'],
          'Downtime 4 Duration': item['Downtime 4 Duration'],
          'Type 5': item['Type 5'],
          'Downtime 5 Duration': item['Downtime 5 Duration']
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
    { field: "Date", headerName: "Date", headerAlign: "left", align: "left", flex: 1 },
    { field: "Time", headerName: "Time", headerAlign: "left", align: "left", flex: 1 },
    { field: "Plan ID", headerName: "Plan ID", flex: 1 },
    { field: "Model", headerName: "Model", flex: 1 },
    { field: "Part Name", headerName: "Part Name", flex: 1 },
    { field: "Part Number", headerName: "Part Number", flex: 1 },
    { field: "line", headerName: "Line", flex: 1 },
    { field: "operator", headerName: "Operator Name", flex: 1 },
    { field: "Target Quantity", headerName: "Target Quantity", flex: 1 },
    { field: "Plan Quantity", headerName: "Plan Quantity", flex: 1 },
    { field: "ext1", headerName: "Material 1", flex: 1 },
    { field: "ext2", headerName: "Material 2", flex: 1 },
    { field: "ext3", headerName: "Material 3", flex: 1 },
    { field: "ext4", headerName: "Material 4", flex: 1 },
    { field: "Status", headerName: "Status", flex: 1 }
  ];

  const downloadCSV = () => {
    const columnOrder = [
      "Date", "Time", "Plan ID", "Part Name", "Part Number",
      "Target Quantity", "Plan Quantity", "Model"
    ];
  
    const orderedData = data.map(row =>
      columnOrder.reduce((acc, col) => {
        acc[col] = row[col] || ''; // Default to empty string if value is undefined
        return acc;
      }, {})
    );
  
    const csv = Papa.unparse(orderedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.csv';
    link.click();
  };
  
  

  const downloadExcel = () => {
    const columnOrder = [
      "Date", "Time", "Plan ID", "Part Name", "Part Number",
      "Target Quantity", "Plan Quantity", "Model"
    ];
  
    const orderedData = data.map(row =>
      columnOrder.reduce((acc, col) => {
        acc[col] = row[col] || ''; // Default to empty string if value is undefined
        return acc;
      }, {})
    );
  
    const ws = XLSX.utils.json_to_sheet(orderedData, { header: columnOrder });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
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
    <Header title="Report" subtitle="Production Report" />

   

    <Box display="flex" justifyContent="space-between" alignItems="center">
      {/* Filters Section */}
      <Box display="flex" alignItems="center" gap="10px">
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

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ ml: 2.5 }}>Shift</InputLabel>
          <Select
            multiple
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
        </FormControl>
      </Box>

      <Box sx={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px" }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          onClick={() => fileInputRef.current.click()}
          sx={{ padding: "10px 2rem", backgroundColor:'#64BDD1' }}
        >
          Bulk Upload
        </Button>
      </Box>

    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" backgroundColor="#64BDD1" padding="10px 20px">
      <Typography
        variant="h2"
        align="center"
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: '25px',
          flexGrow: 1,
          textAlign: "center"
        }}
      >
        Production Plans Table
      </Typography>

      <Box display="flex" alignItems="center" >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen2}
          sx={{
            minWidth: "40px",     // Optional: better button size
            color: 'white',
            backgroundColor: '#64BDD1',
            boxShadow: 'none',     // Removes shadow
            borderRadius: 0,       // Removes border radius
            '&:hover': {
              backgroundColor: '#5ab1c4',  // Optional: subtle hover effect
              boxShadow: 'none'            // No shadow on hover
            }
          }}
        />

        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={handleOpenDel}
          sx={{
            minWidth: "40px",     // Optional: better button size
            color: 'white',
            backgroundColor: '#64BDD1',
            boxShadow: 'none',     // Removes shadow
            borderRadius: 0,       // Removes border radius
            '&:hover': {
              backgroundColor: '#5ab1c4',  // Optional: subtle hover effect
              boxShadow: 'none'            // No shadow on hover
            }
          }}
        />

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadExcel}
          sx={{
            minWidth: "40px",     // Optional: better button size
            color: 'white',
            backgroundColor: '#64BDD1',
            boxShadow: 'none',     // Removes shadow
            borderRadius: 0,       // Removes border radius
            '&:hover': {
              backgroundColor: '#5ab1c4',  // Optional: subtle hover effect
              boxShadow: 'none'            // No shadow on hover
            }
          }}
        />
      </Box>
    </Box>

          

      <Box m="0px 0 0 0" borderRadius="10px" height="65vh" overflow="auto" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: 'black' },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: 'white' },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: '#64BDD1' },
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
          onRowClick={(params, event) => {
            if(params.row.Status === "Completed") {
              event.defaultMuiPrevented = true;
              return;
            }
            handleOpen(params.row['Plan ID'], params.row['Model'], params.row['Part Name']);
          }}
        />
        <Snackbar 
          open={!!alertMessage} 
          autoHideDuration={10000} 
          onClose={() => setAlertMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
          <Alert severity={alertType} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </Snackbar>
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
          width: 700,
          height:"85%",
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius:'10px',
          overflowY: 'auto', 
          overflowX: 'auto',
          
        }}>
          <Typography id="modal-title" variant="h6" component="h2" fontWeight="bold" fontSize={20}>
  Form for Plan ID: {selectedId}
</Typography>

<Grid container spacing={2} sx={{ mt: 2 }}>
  {/* Status */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Status</Typography>
    <Select
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
  </Grid>

  {/* Model */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Model</Typography>
    <Select
      fullWidth
      value={model}
      onChange={(e) => setmodel(e.target.value)}
      sx={{ mt: 2 }}
    >
      <MenuItem value="800L">800L</MenuItem>
      <MenuItem value="613T">613T</MenuItem>
      <MenuItem value="YJC">YJC</MenuItem>
      <MenuItem value="YCA">YCA</MenuItem>
      {/* ...other models */}
    </Select>
  </Grid>

  {/* Part Name */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Part Name</Typography>
    <Select
      fullWidth
      value={partna}
      onChange={(e) => setpartna(e.target.value)}
      sx={{ mt: 2 }}
    >
      <MenuItem value="W/S Inner FR">W/S Inner FR</MenuItem>
      <MenuItem value="W/S Inner RR">W/S Inner RR</MenuItem>
      {/* ...other parts */}
    </Select>
  </Grid>

  {/* Target */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Target</Typography>
    <TextField
      fullWidth
      value={target}
      onChange={(e) => setTarget(e.target.value)}
      sx={{ mt: 2 }}
    />
  </Grid>

  {/* Operator Name */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Operator Name</Typography>
    <TextField
      fullWidth
      value={man}
      onChange={(e) => setman(e.target.value)}
      sx={{ mt: 2 }}
    />
  </Grid>

  {/* Line */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Line</Typography>
    <Select
      fullWidth
      value={machine}
      onChange={(e) => setmachine(e.target.value)}
      sx={{ mt: 2 }}
    >
      <MenuItem value="Line 1">Line 1</MenuItem>
      <MenuItem value="Line 2">Line 2</MenuItem>
      {/* ...other lines */}
    </Select>
  </Grid>

  {/* Extruder 1 */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Extruder 1 Material</Typography>
    <TextField
      fullWidth
      value={material}
      onChange={(e) => setmaterial(e.target.value)}
      sx={{ mt: 2 }}
    />
  </Grid>

  {/* Extruder 2 */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Extruder 2 Material</Typography>
    <TextField
      fullWidth
      value={material2}
      onChange={(e) => setmaterial2(e.target.value)}
      sx={{ mt: 2 }}
    />
  </Grid>

  {/* Extruder 3 */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Extruder 3 Material</Typography>
    <TextField
      fullWidth
      value={material3}
      onChange={(e) => setmaterial3(e.target.value)}
      sx={{ mt: 2 }}
    />
  </Grid>

  {/* Extruder 4 */}
  <Grid item xs={12} sm={6}>
    <Typography variant="body1" sx={{ mb: -1 }}>Extruder 4 Material</Typography>
    <TextField
      fullWidth
      value={material4}
      onChange={(e) => setmaterial4(e.target.value)}
      sx={{ mt: 2 }}
    />
  </Grid>

  {/* Submit Button */}
  <Grid item xs={12}>
    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 3 }}>
      Submit
    </Button>
  </Grid>
</Grid>
</Box>
</Modal>


      <Modal
        open={open2}
        onClose={handleClose2}
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
          border: '0px solid #000',
          boxShadow: 24,
          height:'80%',
          p: 4,
          borderRadius:'10px',
          overflowY: 'auto', 
          overflowX: 'auto',
          scrollbarColor: '#000 #ffffff', 
          '&::-webkit-scrollbar': {
            width: '5px', 
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#000', 
            borderRadius: '10px', 
          },
        }}>
          <Typography id="modal-title" variant="h6" component="h2" fontWeight={"bold"} fontSize={20}>
            Add New Plan
          </Typography>

          
          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="body1" sx={{ mt: 2, mb:0}}>Date</Typography>
              <DesktopDatePicker
                value={date}
                onChange={(newValue) => setdate(newValue)}
                renderInput={(params) => <TextField  sx={{ mb: 2 }} {...params} />}
              />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="body1" sx={{ mt: 2, mb:0}}>Time</Typography>
              <MobileTimePicker
                value={time}
                onChange={(newValue) => settime(newValue)}
                renderInput={(params) => <TextField sx={{ mb: 2 }} {...params} />}
              />
          </LocalizationProvider>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Model</Typography>
          <Select
            fullWidth
            value={model2}
            onChange={(e) => setmodel2(e.target.value)}
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
            fullWidth
            value={partna2}
            onChange={(e) => setpartna2(e.target.value)}
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
            <MenuItem value="PIANO">PIANO</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Part Number</Typography>
          <TextField
            fullWidth
            value={partno}
            onChange={(e) => setpartno(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Target Quantity</Typography>
          <TextField
            fullWidth
            value={target_qty}
            onChange={(e) => settarget_qty(e.target.value)}
            sx={{ mt: 2 }}
            type="number"
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Planned Quantity</Typography>
          <TextField
            fullWidth
            value={plan_qty}
            onChange={(e) => setplan_qty(e.target.value)}
            sx={{ mt: 2 }}
            type="number"
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Supervisor Name</Typography>
          <Select
            fullWidth
            value={supervisor_name}
            onChange={(e) => setsupervisor_name(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Neeraj">Neeraj</MenuItem>
            <MenuItem value="Narendra">Narendra</MenuItem>
          </Select>
          {/* <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Operator Name</Typography>
          <Select
            fullWidth
            value={operator_name}
            onChange={(e) => setoperator_name(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Dinesh">Dinesh</MenuItem>
            <MenuItem value="Kaptan">Kaptan</MenuItem>
            <MenuItem value="Brahma">Brahma</MenuItem>
          </Select> */}
          {/* <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Status</Typography>
          <Select
            fullWidth
            value={status2}
            onChange={(e) => setstatus2(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select> */}
          <Button onClick={handleSubmit2} variant="contained" color="primary" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>
      <Modal open={openDel} onClose={handleCloseDel} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box p={3} bgcolor="white" borderRadius={2} width="400px" mx="auto" mt="100px">
        <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Please Enter Plan ID :</Typography>
          <TextField
            fullWidth
            type = "number"
            value={plan_id_del}
            onChange={(e) => setplan_id_del(e.target.value)}
            sx={{ mt: 2 }}
          />
        <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={handleSubmitDel} type="submit" variant="contained" color="primary">
          Confirm
        </Button>
        </Box>
        </Box>
      </Modal>
    </Box>
    </Box>
  );
};

export default Prod_plans;

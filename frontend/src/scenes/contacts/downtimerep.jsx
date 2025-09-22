import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Button,  Modal, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import { LocalizationProvider, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const Downtimerep = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState(['A']);
  const [area, setArea] = useState('Line 8');
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [category1, setcategory1] = useState('');
  const [reason1, setreason1] = useState('');
  const [category2, setcategory2] = useState('');
  const [reason2, setreason2] = useState('');
  const [category3, setcategory3] = useState('');
  const [reason3, setreason3] = useState('');
  const [category4, setcategory4] = useState('');
  const [reason4, setreason4] = useState('');
  const [category5, setcategory5] = useState('');
  const [reason5, setreason5] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/downtimerep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: selectedId,
          category1: category1,
          reason1: reason1,
          category2: category2,
          reason2: reason2,
          category3: category3,
          reason3: reason3,
          category4: category4,
          reason4: reason4,
          category5: category5,
          reason5: reason5
        }),
      });

      if (response.ok) {
        // Optionally, refresh the data after successful update
        handleClose();
        setAlertMessage("Downtime Updated successfully!");
        setAlertType("success");
      } else {
        console.error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
          'Plan ID': item['Plan ID'],
          'Type 1': item['Type 1'],
          'Downtime 1 Duration': item['Downtime 1 Duration'],
          'Reason 1': item['Reason 1'],
          'Type 2': item['Type 2'],
          'Downtime 2 Duration': item['Downtime 2 Duration'],
          'Reason 2': item['Reason 2'],
          'Type 3': item['Type 3'],
          'Downtime 3 Duration': item['Downtime 3 Duration'],
          'Reason 3': item['Reason 3'],
          'Type 4': item['Type 4'],
          'Downtime 4 Duration': item['Downtime 4 Duration'],
          'Reason 4': item['Reason 4'],
          'Type 5': item['Type 5'],
          'Downtime 5 Duration': item['Downtime 5 Duration'],
          'Reason 5': item['Reason 5'],
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
    { field: "Plan ID", headerName: "Plan ID", flex: 0.5 },
    { field: "Type 1", headerName: "Category", flex: 0.7 },
    { field: "Downtime 1 Duration", headerName: "Downtime 1", flex: 0.7 },
    { field: "Reason 1", headerName: "Reason", flex: 0.7 },
    { field: "Type 2", headerName: "Category", flex: 0.7 },
    { field: "Downtime 2 Duration", headerName: "Downtime 2", flex: 0.7 },
    { field: "Reason 2", headerName: "Reason", flex: 0.7 },
    { field: "Type 3", headerName: "Category", flex: 0.7 },
    { field: "Downtime 3 Duration", headerName: "Downtime 3", flex: 0.7 },
    { field: "Reason 3", headerName: "Reason", flex: 0.7 },
    { field: "Type 4", headerName: "Category", flex: 0.7 },
    { field: "Downtime 4 Duration", headerName: "Downtime 4", flex: 0.7 },
    { field: "Reason 4", headerName: "Reason", flex: 0.7 },
    { field: "Type 5", headerName: "Category", flex: 0.7 },
    { field: "Downtime 5 Duration", headerName: "Downtime 5", flex: 0.7 },
    { field: "Reason 5", headerName: "Reason", flex: 0.7 }
  ];

  const downloadCSV = () => {
    const columnOrder = [
      "Date", "Plan ID",
      "Type 1", "Downtime 1 Duration", "Reason",
      "Type 2", "Downtime 2 Duration", "Reason",
      "Type 3", "Downtime 3 Duration", "Reason",
      "Type 4", "Downtime 4 Duration", "Reason",
      "Type 5", "Downtime 5 Duration", "Reason"
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
     "Date", "Plan ID",
      "Type 1", "Downtime 1 Duration", "Reason",
      "Type 2", "Downtime 2 Duration", "Reason",
      "Type 3", "Downtime 3 Duration", "Reason",
      "Type 4", "Downtime 4 Duration", "Reason",
      "Type 5", "Downtime 5 Duration", "Reason"
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

  if (data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Ensure it takes up the full height of the parent
        fontSize: '1rem',
        color: colors.grey[500],
      }}>
        No Data Available
      </div>
    );
  }
  

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
      
      <Box mb="0px" display="flex" justifyContent="left" alignItems="center" gap="10px">
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

        <Box ml="20px">
          <Button variant="contained" color="secondary" onClick={downloadCSV} sx={{ ml: 95 }}>
            Download CSV
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadExcel} sx={{ ml: 2 }}>
            Download Excel
          </Button>
        </Box>
      </Box>

      <Typography
          variant="h2" // Sets large text size
          align="center" // Centers the text
          sx={{
            color: "white",
            padding:'15px',
            backgroundColor:'#64BDD1',
            fontWeight: "bold",  
            fontsize: '25px'
              }}
          >
              Downtime Table
          </Typography>

      <Box m="0px 0 0 0" height="65vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
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
          onRowClick={(params) => handleOpen(params.row['Plan ID'])}
        />
        <Snackbar open={!!alertMessage} autoHideDuration={10000} onClose={() => setAlertMessage("")}>
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
          width: 400,
          bgcolor: 'background.paper',
          border: '0px solid #000',
          boxShadow: 24,
          height:'80%',
          p: 4,
          borderRadius:'10px',
          overflowY: 'auto', // Enable vertical scrollbar
          overflowX: 'auto',
          scrollbarColor: '#000 #ffffff', // Optional: Set scrollbar color
          '&::-webkit-scrollbar': {
            width: '5px', // Width of the scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#000', // Color of the scrollbar thumb
            borderRadius: '10px', // Roundness of the scrollbar thumb
          },
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Form for Plan ID: {selectedId}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Category 1</Typography>
          <Select
            label="Category 1"
            fullWidth
            value={category1}
            onChange={(e) => setcategory1(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Change Over">Change Over</MenuItem>
            <MenuItem value="Setup">Setup</MenuItem>
            <MenuItem value="Downtime">Downtime</MenuItem>
            <MenuItem value="Breakdown">Breakdown</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Reason 1</Typography>
          <TextField
            fullWidth
            value={reason1}
            onChange={(e) => setreason1(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Category 2</Typography>
          <Select
            label="Status"
            fullWidth
            value={category2}
            onChange={(e) => setcategory2(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Change Over">Change Over</MenuItem>
            <MenuItem value="Setup">Setup</MenuItem>
            <MenuItem value="Downtime">Downtime</MenuItem>
            <MenuItem value="Breakdown">Breakdown</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Reason 2</Typography>
          <TextField
            fullWidth
            value={reason2}
            onChange={(e) => setreason2(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Category 3</Typography>
          <Select
            label="Status"
            fullWidth
            value={category3}
            onChange={(e) => setcategory3(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Change Over">Change Over</MenuItem>
            <MenuItem value="Setup">Setup</MenuItem>
            <MenuItem value="Downtime">Downtime</MenuItem>
            <MenuItem value="Breakdown">Breakdown</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Reason 3</Typography>
          <TextField
            fullWidth
            value={reason3}
            onChange={(e) => setreason3(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Category 4</Typography>
          <Select
            label="Status"
            fullWidth
            value={category4}
            onChange={(e) => setcategory4(e.target.value)}
            sx={{ mt: 2 }}
          >
           <MenuItem value="Change Over">Change Over</MenuItem>
            <MenuItem value="Setup">Setup</MenuItem>
            <MenuItem value="Downtime">Downtime</MenuItem>
            <MenuItem value="Breakdown">Breakdown</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Reason 4</Typography>
          <TextField
            fullWidth
            value={reason4}
            onChange={(e) => setreason4(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Category 5</Typography>
          <Select
            label="Status"
            fullWidth
            value={category5}
            onChange={(e) => setcategory5(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Change Over">Change Over</MenuItem>
            <MenuItem value="Setup">Setup</MenuItem>
            <MenuItem value="Downtime">Downtime</MenuItem>
            <MenuItem value="Breakdown">Breakdown</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Reason 5</Typography>
          <TextField
            fullWidth
            value={reason5}
            onChange={(e) => setreason5(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
    </Box>
  );
};

export default Downtimerep;

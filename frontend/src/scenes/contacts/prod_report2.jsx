import { Box, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography , Snackbar, Alert} from "@mui/material";
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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { saveAs } from 'file-saver';

const Prod_report2 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState(['A']);
  const [area, setArea] = useState('Line 8');
  const [open, setOpen] = useState(false);
  const [gl_name, setgl_name] = useState('Saurabh Vishwakarma');
  const [supervisor_name, setsupervisor_name] = useState('Neeraj');
  const [operator_name, setoperator_name] = useState('Dinesh');
  const [line, setline] = useState('8');
  const [date, setdate] = useState(null);
  const [shift2, setshift2] = useState('A');
  const [selectedId, setSelectedId] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [startup_rej, setstartup_rej] = useState('');
  const [line_rej, setline_rej] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/spr_report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          gl_name: gl_name,
          shift2: shift2,
          line: line,
          operator_name: operator_name,
          supervisor_name: supervisor_name
        }),
      });
      console.log(response);

      if (response.ok) {
        const blob = await response.blob();
        console.log(blob);
        saveAs(blob, `spr.xlsx`);
        handleClose();
      } else {
        console.error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit2 = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/update_rej', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: selectedId,
          startup_rej: startup_rej,
          line_rej: line_rej
        }),
      });

      if (response.ok) {
        handleClose2();
        setAlertMessage("Rejection Updated successfully!");
        setAlertType("success");
      } else {
        console.error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = (id) => {
    setOpen(true);
  };
  const handleOpen2 = (id) => {
    setOpen2(true);
    setSelectedId(id);
  }
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        const response = await fetch(`http://163.125.102.142:5000/api/prod_report?start_date=${startDate}&end_date=${endDate}&shift=${shift}&area=${area}`);
        const result = await response.json();

        const transformedData = result.map((item, index) => ({
          id: index,
          Date: item.Date,
          'Shift': item['Shift'],
          'Plan ID': item['Plan ID'],
          'Part Name': item['Part Name'],
          Model: item.Model,
          Availability: item.Availability,
          Performance: item.Performance,
          'Quality Rate': item['Quality Rate'],
          OEE: item.OEE,
          'Startup Rejection': item['Startup Rejection'],
          'Line Rejection': item['Line Rejection'],
          Consumption: item.Consumption,
          'Downtime Duration': item['Downtime Duration'],
          'Change Over Duration': item['Change Over Duration'],
          'Setup Duration': item['Setup Duration'],
          'Breakdown Duration': item['Breakdown Duration'],
          'Production Duration': item['Production Duration']
        }));

        setData(transformedData);
        // console.log(transformedData);
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
    { field: "Date", headerName: "Date", headerAlign: "left", align: "left" },
    { field: "Shift", headerName: "Shift", headerAlign: "left", align: "left" },
    { field: "Plan ID", headerName: "Plan ID", flex: 0.5 },
    { field: "Part Name", headerName: "Part Name", flex: 0.7 },
    { field: "Model", headerName: "Model", flex: 0.5 },
    { field: "Availability", headerName: "Availability", flex: 0.5 },
    { field: "Performance", headerName: "Performance", flex: 0.5 },
    { field: "Quality Rate", headerName: "Quality Rate", flex: 0.5 },
    { field: "OEE", headerName: "OEE", flex: 0.5 },
    { field: "Startup Rejection", headerName: "Line Rejection", flex: 0.7 },
    { field: "Line Rejection", headerName: "Startup Rejection", flex: 0.5 },
    { field: "Consumption", headerName: "Consumption", flex: 0.5 },
    { field: "Downtime Duration", headerName: "Downtime (Total)", flex: 0.5 },
    { field: "Change Over Duration", headerName: "Change Over (Total)", flex: 0.7 },
    { field: "Setup Duration", headerName: "Setup (Total)", flex: 0.5 },
    { field: "Breakdown Duration", headerName: "Breakdown (Total)", flex: 0.5 },
    { field: "Production Duration", headerName: "Production Duration", flex: 1 }
];

  const downloadCSV = () => {
    const columnOrder = [
      "Date", "Plan ID", "Part Name", "Model", "Availability",
      "Performance", "Quality Rate", "OEE", "Startup Rejection",
      "Line Rejection", "Consumption", "Downtime",
      "Change Over", "Setup", "Breakdown", "Production Duration"
    ];

    const orderedData = data.map(row =>
      columnOrder.reduce((acc, col) => {
        acc[col] = row[col];
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
      "Date", "Plan ID", "Part Name", "Model", "Availability",
      "Performance", "Quality Rate", "OEE", "Startup Rejection",
      "Line Rejection", "Consumption", "Downtime",
      "Change Over", "Setup", "Breakdown", "Production Duration"
    ];

    const orderedData = data.map(row =>
      columnOrder.reduce((acc, col) => {
        acc[col] = row[col];
        return acc;
      }, {})
    );

    const ws = XLSX.utils.json_to_sheet(orderedData, { header: columnOrder });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  const downloadSPR = () => {
    const columnOrder = [
      "Date", "Plan ID", "Part Name", "Model", "Availability",
      "Performance", "Quality Rate", "OEE", "Startup Rejection",
      "Line Rejection", "Consumption", "Downtime",
      "Change Over", "Setup", "Breakdown", "Production Duration"
    ];

    const orderedData = data.map(row =>
      columnOrder.reduce((acc, col) => {
        acc[col] = row[col];
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
    <Box>
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
          <Button variant="contained" color="secondary" onClick={() => handleOpen()} sx={{ ml: 75 }}>
            SPR Report
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadCSV} sx={{ ml: 2 }}>
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
              Production Report Table
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
          onRowClick={(params) => handleOpen2(params.row['Plan ID'])}
        />
        <Snackbar open={!!alertMessage} autoHideDuration={10000} onClose={() => setAlertMessage("")}>
          <Alert severity={alertType} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
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
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Form for Plan ID: {selectedId}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Startup Rejection</Typography>
          <TextField
            fullWidth
            value={startup_rej}
            onChange={(e) => setstartup_rej(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Line Rejection</Typography>
          <TextField
            fullWidth
            value={line_rej}
            onChange={(e) => setline_rej(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={handleSubmit2} variant="contained" color="primary" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>
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
            Download SPR Report
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
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Shift</Typography>
          <Select
            fullWidth
            value={shift2}
            onChange={(e) => setshift2(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Line</Typography>
          <Select
            fullWidth
            value={line}
            onChange={(e) => setline(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="6">6</MenuItem>
            <MenuItem value="8">8</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Group Leader</Typography>
          <Select
            fullWidth
            value={gl_name}
            onChange={(e) => setgl_name(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Saurabh Vishwakarma">Saurabh Vishwakarma</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Supervisor Name</Typography>
          <Select
            fullWidth
            value={supervisor_name}
            onChange={(e) => setsupervisor_name(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Srichand">Srichand</MenuItem>
            <MenuItem value="Neeraj">Neeraj</MenuItem>
            <MenuItem value="Narendra">Narendra</MenuItem>
          </Select>
          <Typography variant="body1" sx={{ mt: 2, mb:-2 }}>Operator Name</Typography>
          <Select
            fullWidth
            value={operator_name}
            onChange={(e) => setoperator_name(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Dinesh">Dinesh</MenuItem>
            <MenuItem value="Kaptan">Kaptan</MenuItem>
            <MenuItem value="Brahma">Brahma</MenuItem>
          </Select>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
    </Box>
    </Box>
  );
};

export default Prod_report2;

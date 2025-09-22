import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import { LocalizationProvider, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import * as XLSX from 'xlsx'; // Import XLSX library for Excel file creation
import Papa from 'papaparse'; // Import PapaParse library for CSV file creation

const Prod_report = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState('A');
  const [area, setArea] = useState('Line 8');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        const response = await fetch(`http://163.125.102.142:5000/api/prod_report?start_date=${startDate}&end_date=${endDate}&shift=${shift}&area=${area}`);
        const result = await response.json();

        const transformedData = result.map((item, index) => ({
          id: index, // Use index or a unique field if available
          ...item
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
    {
      field: "Date",
      headerName: "Date",
      headerAlign: "left",
      align: "left" 
    },
    { field: "Plan ID", headerName: "Plan ID", flex: 0.5 },
    { field: "Part Name", headerName: "Part Name", flex: 1 },
    { field: "Model", headerName: "Model", flex: 1 },
    { field: "Availability", headerName: "Availability", flex: 1 },
    { field: "Performance", headerName: "Performance", flex: 1 },
    { field: "Quality Rate", headerName: "Quality Rate", flex: 1 },
    { field: "OEE", headerName: "OEE", flex: 1 },
    { field: "Startup Rejection", headerName: "Startup Rejection", flex: 1 },
    { field: "Line Rejection", headerName: "Line Rejection", flex: 1 },
    { field: "Consumption", headerName: "Consumption", flex: 1 }
  ];

  const downloadCSV = () => {
    // Define the columns you want in the order they appear in the table
    const columnOrder = [
      "Date",
      "Plan ID",
      "Part Name",
      "Model",
      "Availability",
      "Performance",
      "Quality Rate",
      "OEE",
      "Startup Rejection",
      "Line Rejection",
      "Consumption"
    ];
  
    // Map data to match the column order
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
    // Define the columns you want in the order they appear in the table
    const columnOrder = [
      "Date",
      "Plan ID",
      "Part Name",
      "Model",
      "Availability",
      "Performance",
      "Quality Rate",
      "OEE",
      "Startup Rejection",
      "Line Rejection",
      "Consumption"
    ];
  
    // Map data to match the column order
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
    <Box m="20px">
      <Header title="Report" subtitle="Production Report" />
      
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

        {/* SHIFT DROPDOWN */}
        <FormControl sx={{ minWidth: 120 }}>
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

        {/* AREA DROPDOWN */}
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

        {/* DOWNLOAD BUTTONS */}
        <Box ml="20px">
          <Button variant="contained" color="secondary" onClick={downloadCSV} sx={{ ml: 95 }}>
            Download CSV
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadExcel} sx={{ ml: 2 }}>
            Download Excel
          </Button>
        </Box>
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
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Prod_report;

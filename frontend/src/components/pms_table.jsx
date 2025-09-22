import { Box, Typography, useTheme } from "@mui/material";
import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tokens } from '../theme';

const PMS_Table = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
  
    useEffect(() => {
      fetch('http://163.125.102.142:5000/api/pms_table')
        .then(response => response.json())
        .then(data => {
          console.log('Original Data:', data);
          // Transform the data
          const transformedData = data.map(item => ({
            plan_id: item.plan_id,
            part_name: item.part_name,
            model: item.model,
            startup_rej: item.startup_rej,
            line_rej: item.line_rej,
            part_length: item.part_length,
            part_wt: item.part_wt
          }));
          console.log('Transformed Data:', transformedData);
          setData(transformedData);
        })
        .catch(error => console.error('Error fetching card data:', error));
    }, []);
  
    const tableCellStyle = {
        textAlign:'center'
      };   

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} >
          <TableHead sx={{backgroundColor:colors.primary[400]}}>
            <TableRow borderBottom={`0px solid ${colors.primary[500]}`}>
              <TableCell style={tableCellStyle}>Plan ID</TableCell>
              <TableCell style={tableCellStyle}>Part Name</TableCell>
              <TableCell style={tableCellStyle}>Model</TableCell>
              <TableCell style={tableCellStyle}>Part Length</TableCell>
              <TableCell style={tableCellStyle}>Part Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow sx={{backgroundColor:colors.primary[400]}} key={row.plan_id}>
                <TableCell component="th" scope="row" style={tableCellStyle}>
                  {row.plan_id}
                </TableCell>
                <TableCell style={tableCellStyle}>{row.part_name}</TableCell>
                <TableCell style={tableCellStyle}>{row.model}</TableCell>
                <TableCell style={tableCellStyle}>{row.part_length}</TableCell>
                <TableCell style={tableCellStyle}>{row.part_wt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  export default PMS_Table;
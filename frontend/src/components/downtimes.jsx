import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';

function Downtimes() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [downtimes, setDowntimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/downtime');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDowntimes(data.abc || {}); // Default to empty object if data.abc is undefined
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const tableCellStyle = {
    textAlign: 'center'
  };

  return (
    <TableContainer sx={{backgroundColor:colors.primary[400]}} component={Paper}>
      <Table sx={{ minWidth: 650, backgroundColor:colors.primary[400] }}>
        <TableHead sx={{backgroundColor:colors.primary[400]}}>
          <TableRow sx={{backgroundColor:colors.primary[400]}} borderBottom={`0px solid ${colors.primary[500]}`}>
            <TableCell variant="h5" fontWeight="600" style={tableCellStyle}>Downtime</TableCell>
            <TableCell variant="h5" fontWeight="600" style={tableCellStyle}>Downtime Type</TableCell>
            <TableCell variant="h5" fontWeight="600" style={tableCellStyle}>Start</TableCell>
            <TableCell variant="h5" fontWeight="600" style={tableCellStyle}>Stop</TableCell>
            <TableCell variant="h5" fontWeight="600" style={tableCellStyle}>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{backgroundColor:colors.primary[400]}}>
          {Object.keys(downtimes).map((key, index) => (
            <TableRow sx={{backgroundColor:colors.primary[400]}} key={index}>
              <TableCell component="th" scope="row" style={tableCellStyle}>
                {key}
              </TableCell>
              <TableCell style={tableCellStyle}>
            {downtimes[key].type || 'N/A'}  {/* Display downtime type */}
          </TableCell>
              <TableCell style={tableCellStyle}>
                {downtimes[key].start ? new Date(downtimes[key].start).toLocaleString() : 'N/A'}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {downtimes[key].stop ? new Date(downtimes[key].stop).toLocaleString() : 'N/A'}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {downtimes[key].duration || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Downtimes;

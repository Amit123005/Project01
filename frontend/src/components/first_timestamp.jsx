import { useTheme } from "@mui/material/styles";
import { Card, CardContent, Typography, Grid, Box, Paper } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import ProgressCircle from "./ProgressCircle";

const First_timestamp = ({ isDashboard = false, title, subtitle, icon, progress, increase  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
  fetch('http://163.125.102.142:5000/api/first_timestamp_card')
    .then(response => response.json())
    .then(data => {
      if (data) {
        setData(data);
      } else {
        setData([]); // fallback if null or unexpected format
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setData([]); // fallback on error
    });
}, []);

  if (data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Ensure it takes up the full height of the parent
        fontSize: '0.8rem',
        color: colors.grey[500],
      }}>
        No Active Plan
      </div>
    );
  }

  return (
    <Grid>
          <Box display="flex" alignItems="center" >
              <Typography variant="h6" component="div" >
                {data}
              </Typography>
          </Box>
    </Grid>
  );
};

export default First_timestamp;
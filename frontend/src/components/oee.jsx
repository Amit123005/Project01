import { useTheme } from "@mui/material/styles";
import { Typography, Grid, Box, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import ProgressCircle from "./ProgressCircle";

const OEE = ({ isDashboard = false, title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/oee')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Grid>
        <Box display="flex" alignItems="center">
              <Typography variant="h5" component="div" >
                {data.oee}
              </Typography>
        </Box>
    </Grid>
  );
};

export default OEE;
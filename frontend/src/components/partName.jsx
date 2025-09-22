import { useTheme } from "@mui/material/styles";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";

const PartNameData = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/partname')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Grid>
      {data.map((item) => (
              <Typography variant="h5" component="div">
                {item.part_name}
              </Typography>
      ))}
    </Grid>
  );
};

export default PartNameData;
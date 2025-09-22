import React, { useState, useEffect } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";

const DataList = ({ dateRange, shift }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = dateRange[0].format("YYYY-MM-DD");
        const endDate = dateRange[1].format("YYYY-MM-DD");
        const response = await fetch(
          `http://163.125.102.142:5000/api/test_chart?start_date=${startDate}&end_date=${endDate}&shift=${shift}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dateRange, shift]);

  if (error)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: colors.redAccent[500],
        }}
      >
        Error: {error}
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Ensures the component takes full height
      }}
    >
      <TableContainer
        component={Box}
        sx={{
          flex: 1, // Ensures it fills the remaining space
          overflowY: "auto", // Enables scrolling for long lists
          backgroundColor: 'white',
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: colors.primary[100], // Track color
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#000", // Thumb color
            borderRadius: "10px",
          },
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">S.No</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Model</TableCell>
              <TableCell align="center">Part</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  {item.Date ? new Date(item.Date).toLocaleString() : "N/A"}
                </TableCell>
                <TableCell align="center">{item.Model || "N/A"}</TableCell>
                <TableCell align="center">{item["Part Name"] || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataList;

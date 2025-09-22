// src/components/FourMTable.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

export default function FourMTable({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return <Typography color="text.secondary">No chartData available</Typography>;
  }

  // Define columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("YYYY-MM-DD") : "NA",
    },
    { field: "shift", headerName: "Shift", width: 100, flex : 1},
    { field: "plant", headerName: "Plant", width: 100, flex : 1 },
    { field: "area", headerName: "Area", width: 150, flex : 1 },
    { field: "sub_area", headerName: "Line / Sub Area", width: 150, flex : 1 },
    { field: "category", headerName: "Category", width: 120, flex : 1 },
    { field: "detail", headerName: "Detail", width: 250, flex : 1 },
    { field: "bd_reason", headerName: "Breakdown Reason", width: 250, flex : 1 },
    { field: "bd_time", headerName: "Breakdown Time", width: 250, flex : 1 },
    { field: "action_taken", headerName: "Action Taken", width: 200, flex : 1 },
    { field: "total_qty", headerName: "Total Qty", width: 120, flex : 1 },
    { field: "retro_total", headerName: "Retro Total", width: 120, flex : 1 },
    { field: "retro_ok", headerName: "Retro OK", width: 120, flex : 1 },
    { field: "retro_ng", headerName: "Retro NG", width: 120, flex : 1 },
    { field: "suspected_total", headerName: "Suspected Total", width: 120 , flex : 1},
    { field: "suspected_ok", headerName: "Suspected OK", width: 120, flex : 1 },
    { field: "suspected_ng", headerName: "Suspected NG", width: 120, flex : 1 },
  ];

  // Map chartData with unique id if not present
  const rows = chartData.map((item, index) => ({
    id: item.id || index + 1,
    ...item,
  }));

  return (
    <Box sx={{ height: 500, width: "100%", mt: 0 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        autoHeight
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "14px",
          },
        }}
      />
    </Box>
  );
}

import { Box, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import dayjs from "dayjs";

const FourMChange = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const access = localStorage.getItem('accessLevel')
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch(`http://163.125.102.142:5000/api/four_m_table`);
        const result = await response.json();
        const transformedData = result.map((item) => ({
          id: item.id,
          part_id: item.part_id,
          partna: item.partna,
          model: item.model,
          change_type: item.change_type,
          old_value: item.old_value,
          new_value: item.new_value,
          changed_by: item.changed_by,
          changed_on: item.changed_on,
          approval_status: item.approval_status,
          approved_on: item.approved_on,
          remarks: item.remarks,
          approval_status_f: item.approval_status_f,
          approved_on_f: item.approved_on_f,
          change_desc: item.change_desc,
          action: item.action,
          type_of_change: item.type_of_change,
          abnormal_situation: item.abnormal_situation,
          setup_approval: item.setup_approval,
          retroactive_inspection: item.retroactive_inspection,
          suspected_lot: item.suspected_lot,
        }));

        setData(transformedData);
        // console.log(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (row) => {
  try {
    const response = await fetch(`http://163.125.102.142:5000/api/approve_4m`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: row.id,
        part_id: row.part_id,
        old_value: row.old_value,
        new_value: row.new_value,
        change_type: row.change_type,
        access : access
      })
    });
    if (response.ok) {
      setAlertMessage('Change Approved Successfully');
      setAlertType('success');

      // Optional: refresh data
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, approval_status: 'Approved', approved_on: new Date().toISOString() }
            : item
        )
      );
    } else {
      setAlertMessage('Approval failed');
      setAlertType('error');
    }
  } catch (error) {
    console.error('Error approving change:', error);
    setAlertMessage('Error approving change');
    setAlertType('error');
  }
};

  const handleReject = async (row) => {
  try {
    const response = await fetch(`http://163.125.102.142:5000/api/reject_4m`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: row.id,
      })
    });
    if (response.ok) {
      setAlertMessage('Change Approved Successfully');
      setAlertType('success');

      // Optional: refresh data
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, approval_status: 'Approved', approved_on: new Date().toISOString() }
            : item
        )
      );
    } else {
      setAlertMessage('Approval failed');
      setAlertType('error');
    }
  } catch (error) {
    console.error('Error approving change:', error);
    setAlertMessage('Error approving change');
    setAlertType('error');
  }
};

const handleClick = () => {
  console.log(access)
}

  const baseColumns = [
  { field: "id", headerName: "S No", flex: 0.5 },
  { field: "part_id", headerName: "Part ID", flex: 0.5 },
  { field: "partna", headerName: "Part Name", flex: 1 },
  { field: "model", headerName: "Model", flex: 0.5 },
  { field: "change_desc", headerName: "Change Description", flex: 1 },
  { field: "action", headerName: "Action", flex: 1 },
  { field: "type_of_change", headerName: "Change Type", flex: 1 },
  { field: "abnormal_situation", headerName: "Abnormal Situation", flex: 1 },
  { field: "setup_approval", headerName: "Setup Approval", flex: 1 },
  { field: "retroactive_inspection", headerName: "Retroactive Inspection", flex: 1 },
  { field: "suspected_lot", headerName: "Suspected Lot", flex: 1 },
  { field: "old_value", headerName: "Old Value", flex: 1 },
  { field: "new_value", headerName: "New Value", flex: 1 },
  { field: "changed_by", headerName: "Change By", flex: 1 },
  { field: "approval_status", headerName: "Approval Status", flex: 1 },
  { field: "approved_on", headerName: "Approved On", flex: 1 },
  { field: "remarks", headerName: "Remarks", flex: 1 },
  // { field: "approval_status_f", headerName: "Final Approval", flex: 1 },
  // { field: "approved_on_f", headerName: "Final Action On", flex: 1 },
];

const actionsColumn = {
  field: "actions",
  headerName: "Action",
  flex: 1.5,
  renderCell: (params) => {
    const isdisabled = !params.row.approval_status && (access === "Admin" || access === "Super_admin");
    return (
      <Box gap="2px">
        <Button
          sx={{ mr: "5px" }}
          variant="contained"
          color="success"
          size="small"
          disabled={!isdisabled}
          onClick={() => handleApprove(params.row, "Approve")}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={!isdisabled}
          onClick={() => handleReject(params.row, "Reject")}
        >
          Reject
        </Button>
      </Box>
    );
  },
};

// Final columns used in DataGrid
const columns = [...baseColumns];

if (access === "Admin") {
  columns.push(actionsColumn);
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
    <Box>
    <Box m="20px 0 0 80px">
      <Header title="4M Change Sheet"  />

      <Box m="0px 0 0 0" height="80vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1976d2",
              color: "white",
            }
          },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: 'white' },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          sortModel={[
            {
              field: 'id',
              sort: 'desc',
            },
          ]}
          components={{ Toolbar: GridToolbar }}
          // onRowClick={(params) => handleOpen3(params.row['id'])}
        />
        <Snackbar open={!!alertMessage} autoHideDuration={10000} onClose={() => setAlertMessage("")}>
          <Alert severity={alertType} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
    </Box>
    
    </Box>
  );
};

export default FourMChange;

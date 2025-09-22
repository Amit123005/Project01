import { Box, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from "@mui/material";
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
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Plan_ID from "../../components/plan_id";

const DigitalTwin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userid, setuserid] = useState("");
  const [name, setName] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [department, setdepartment] = useState("");
  const [access, setaccess] = useState("");
  const [partID, setpartID] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://163.125.102.142:5000/api/digital_twin`);
        const result = await response.json();

        const transformedData = result.map((item) => ({
          id: item.id,
          name: item.name,
          username: item.username,
          password: item.password,
          email: item.email,
          department: item.department,
          access: item.access
        }));

        setData(transformedData);
        // console.log(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/crud_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          button: 'Add',
          name,
          username,
          password,
          email,
          department,
          access
        }),
      });
  
      if (response.ok) {
        handleClose(); // Close modal
        setAlertMessage('User Added Successfully');
        setAlertType('Success');
      } else {
        console.error('Failed to Add User');
      }
    } catch (error) {
      console.error('Error is:', error);
    }
  };  

  const handleOpen2 = () => {
    setOpen2(true)
  }
  const handleClose2 = () => {
    setOpen2(false)
  }
  const handleSubmit2 = async () => {
    if (!confirmOpen){
      setConfirmOpen(true);
    }else{
        try{
          const response = await fetch('http://163.125.102.142:5000/api/crud_user',{
            method:'POST',
            headers : {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'button': 'Delete',
              'user_id':userid
            })
          })
          if (response.ok){
            handleClose2();
            setAlertMessage("User Deleted Successfully")
            setAlertType("Success")
            setConfirmOpen(false);
            setOpen2(false); // Close modal if needed
            setpartID('');
          }else{
            console.error("Failed to Delete User")
          }
        }catch (error){
          console.error("Error is : ". error)
        }
  }
  }

  const handleOpen3 = (id) => {
    setuserid(id);
    setOpen3(true)
  }
  const handleClose3 = () => {
    setOpen3(false)
  }
  const handleSubmit3 = async () => {
    try {
      const response = await fetch('http://163.125.102.142:5000/api/crud_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          button: 'Update',
          user_id :userid,
          name,
          username,
          password,
          email,
          department,
          access
        }),
      });
  
      if (response.ok) {
        handleClose3();
        setAlertMessage("User Updated Successfully");
        setAlertType("success");
      } else {
        console.error("Failed to update User");
      }
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "User ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "username", headerName: "User Name", flex: 1 },
    { field: "password", headerName: "Password", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "access", headerName: "Access", flex: 1 }
  ];

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
      <Header title="Digital Twin" />

      <Box mb="10px" gap="10px">
        <Button onClick={handleOpen} sx={{ padding: "8px 1rem", backgroundColor:'#B9B9CC', borderRadius:"0px" }}>{<AddBoxIcon/>} Add</Button>
        <Button onClick={handleOpen2} sx={{ padding: "8px 1rem", backgroundColor:'#B9B9CC', borderRadius:"0px" }}>{<DeleteIcon/>} Delete</Button>
        {/* <Button onClick={handleOpen3} sx={{ padding: "4px 0rem", backgroundColor:'#64BDD1', borderRadius:"0px" }}>{<DownloadIcon/>}</Button> */}
      </Box>

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
              field: 'Plan ID',
              sort: 'desc',
            },
          ]}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => handleOpen3(params.row['id'])}
        />
        <Snackbar open={!!alertMessage} autoHideDuration={10000} onClose={() => setAlertMessage("")}>
          <Alert severity={alertType} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>


      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50vh",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Add New User
          </Typography>
          
          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Username" fullWidth value={username} onChange={(e) => setusername(e.target.value)} />
          <TextField label="Password" fullWidth value={password} onChange={(e) => setpassword(e.target.value)} />
          <TextField label="Email" fullWidth value={email} onChange={(e) => setemail(e.target.value)} />
          <TextField label="Department" fullWidth value={department} onChange={(e) => setdepartment(e.target.value)} />
          <TextField label="Access" fullWidth value={access} onChange={(e) => setaccess(e.target.value)} />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              alignSelf: "center",
              mt: 2,
              width: "50%",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: 3,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#125aa1",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>


      <Modal open = {open2} onClose={handleClose2}>
        <Box sx={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",width: 400,bgcolor: "background.paper",boxShadow: 24,borderRadius: 2, p: 4,display: "flex",flexDirection: "column",gap: 2}} 
      >
          <Typography variant="h4" align="center">
            Delete User
          </Typography>
          <Typography variant="h6" mt="10px">
            Please Enter the User ID : 
          </Typography>
          <TextField 
            label="User ID"
            fullWidth
            type="Number"
            value={userid}
            onChange={ (e) => setuserid(e.target.value)}
          />
          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit2}
            sx={{
              alignSelf: "center",
              mt: 2,
              width: "50%",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: 3,
              '&:hover': {
                backgroundColor: 'cyan', // darker shade of red
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete User ID: <strong>{partID}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit2} color="error" variant="contained">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={open3} onClose={handleClose3}>
       <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50vh",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            Update User Details
          </Typography>

          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Username" fullWidth value={username} onChange={(e) => setusername(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Password" fullWidth value={password} onChange={(e) => setpassword(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Email" fullWidth value={email} onChange={(e) => setemail(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Department" fullWidth value={department} onChange={(e) => setdepartment(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Access" fullWidth value={access} onChange={(e) => setaccess(e.target.value)} sx={{ mb: 2 }} />

          <Button color="info" variant="contained" fullWidth onClick={handleSubmit3}>
            Submit
          </Button>
        </Box>
      </Modal>

      
    </Box>
    </Box>
    
    </Box>
  );
};

export default DigitalTwin;

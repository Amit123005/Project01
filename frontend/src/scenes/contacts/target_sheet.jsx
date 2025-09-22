import { Box, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HubIcon from '@mui/icons-material/Hub';

const TargetSheet = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [shift, setShift] = useState(['A']);
  const [area, setArea] = useState('Line 8');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [part_name, setPartName] = useState("");
  const [model, setModel] = useState("");
  const [partID, setpartID] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [changeover_time, setChangeoverTime] = useState('');
  const [startup_time, setStartupTime] = useState('');
  const [startup_rej, setStartupRej] = useState('');
  const [line_rej, setLineRej] = useState('');
  const [part_weight, setPartWeight] = useState('');
  const [standard_line_speed, setStandardLineSpeed] = useState('');
  const [part_length, setPartLength] = useState('');
  const [productivity, setProductivity] = useState('');
  const [target_ideal, setTargetIdeal] = useState('');
  const [target_w_st, setTargetWST] = useState('');
  const [target_w_co, setTargetWCO] = useState('');
  const [rejection_rate, setRejectionRate] = useState('');
  const [cycle_time, setCycleTime] = useState('');
  const [plant, setplant] = useState('');
  const [line, setline] = useState('');
  const [ext1, setext1] = useState('');
  const [ext2, setext2] = useState('');
  const [ext3, setext3] = useState('');
  const [ext4, setext4] = useState('');
  const [initialFormData, setInitialFormData] = useState({});
  const [ext1Materials, setExt1Materials] = useState([]);
  const [ext2Materials, setExt2Materials] = useState([]);
  const [ext3Materials, setExt3Materials] = useState([]);
  const [ext4Materials, setExt4Materials] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        const response = await fetch(`http://163.125.102.142:5000/api/target_sheet`);
        const result = await response.json();

        const transformedData = result.map((item) => ({
          id: item.part_id,
          part_id: item.part_id,
          partna: item.partna,
          model: item.model,
          customer: item.customer,
          changeover_time: item.changeover_time,
          startup_time: item.startup_time,
          startup_rej: item.startup_rej,
          line_rej: item.line_rej,
          part_weight: item.part_weight,
          standard_line_speed: item.standard_line_speed,
          part_length: item.part_length,
          productivity: item.productivity,
          target_ideal: item.target_ideal,
          target_w_st: item.target_w_st,
          target_w_co: item.target_w_co,
          rejection_rate: item.rejection_rate,
          cycle_time: item.cycle_time,
          line: item.line,
          ext1: item.ext1,
          ext2: item.ext2,
          ext3: item.ext3,
          ext4: item.ext4,
          plant: item.plant,
          metal: item.metal,
          ex_mat: item.ex_mat,
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
      const response = await fetch('http://163.125.102.142:5000/api/add_part', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          button: 'Add',
          part_name,
          model,
          customer,
          changeover_time,
          startup_time,
          startup_rej,
          line_rej,
          part_weight,
          standard_line_speed,
          part_length,
          productivity,
          target_ideal,
          target_w_st,
          target_w_co,
          rejection_rate,
          cycle_time,
        }),
      });
  
      if (response.ok) {
        handleClose(); // Close modal
        setAlertMessage('Part Added Successfully');
        setAlertType('Success');
      } else {
        console.error('Failed to Add Part');
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
          const response = await fetch('http://163.125.102.142:5000/api/add_part',{
            method:'POST',
            headers : {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'button': 'Delete',
              'part_id':partID
            })
          })
          if (response.ok){
            handleClose2();
            setAlertMessage("Part Deleted Successfully")
            setAlertType("Success")
            setConfirmOpen(false);
            setOpen2(false); // Close modal if needed
            setpartID('');
          }else{
            console.error("Failed to Delete Part")
          }
        }catch (error){
          console.error("Error is : ". error)
        }
  }
  }

  const handleOpen3 = (id) => {
    const selectedRow = data.find((row) => row.id === id);
    setSelectedId(id);
    if (selectedRow) {
      setInitialFormData(selectedRow);
      setPartName(selectedRow.partna || "");
      setModel(selectedRow.model || "");
      setCustomer(selectedRow.customer || "");
      setChangeoverTime(selectedRow.changeover_time || "");
      setStartupTime(selectedRow.startup_time || "");
      setStartupRej(selectedRow.startup_rej || "");
      setLineRej(selectedRow.line_rej || "");
      setPartWeight(selectedRow.part_weight || "");
      setStandardLineSpeed(selectedRow.standard_line_speed || "");
      setPartLength(selectedRow.part_length || "");
      setProductivity(selectedRow.productivity || "");
      setTargetIdeal(selectedRow.target_ideal || "");
      setTargetWST(selectedRow.target_w_st || "");
      setTargetWCO(selectedRow.target_w_co || "");
      setRejectionRate(selectedRow.rejection_rate || "");
      setCycleTime(selectedRow.cycle_time || "");
      setplant(selectedRow.plant || "");
      setline(selectedRow.line || "");
      setExt1Materials((selectedRow.ext1 || "").replaceAll('"', "").split(',').map(s => s.trim()));
      setExt2Materials((selectedRow.ext2 || "").replaceAll('"', "").split(',').map(s => s.trim()));
      setExt3Materials((selectedRow.ext3 || "").replaceAll('"', "").split(',').map(s => s.trim()));
      setExt4Materials((selectedRow.ext4 || "").replaceAll('"', "").split(',').map(s => s.trim()));
    }
    setOpen3(true);
    
  };
  const handleClose3 = () => {
    setOpen3(false)
  }
  const handleSubmit3 = async () => {
  const updatedFields = {};

  // Compare basic text/number fields
  if (part_name !== initialFormData.partna) updatedFields.partna = part_name;
  if (model !== initialFormData.model) updatedFields.model = model;
  if (customer !== initialFormData.customer) updatedFields.customer = customer;
  if (changeover_time !== initialFormData.changeover_time) updatedFields.changeover_time = changeover_time;
  if (startup_time !== initialFormData.startup_time) updatedFields.startup_time = startup_time;
  if (startup_rej !== initialFormData.startup_rej) updatedFields.startup_rej = startup_rej;
  if (line_rej !== initialFormData.line_rej) updatedFields.line_rej = line_rej;
  if (part_weight !== initialFormData.part_weight) updatedFields.part_weight = part_weight;
  if (standard_line_speed !== initialFormData.standard_line_speed) updatedFields.standard_line_speed = standard_line_speed;
  if (part_length !== initialFormData.part_length) updatedFields.part_length = part_length;
  if (productivity !== initialFormData.productivity) updatedFields.productivity = productivity;
  if (target_ideal !== initialFormData.target_ideal) updatedFields.target_ideal = target_ideal;
  if (target_w_st !== initialFormData.target_w_st) updatedFields.target_w_st = target_w_st;
  if (target_w_co !== initialFormData.target_w_co) updatedFields.target_w_co = target_w_co;
  if (rejection_rate !== initialFormData.rejection_rate) updatedFields.rejection_rate = rejection_rate;
  if (cycle_time !== initialFormData.cycle_time) updatedFields.cycle_time = cycle_time;
  if (plant !== initialFormData.plant) updatedFields.plant = plant;
  if (line !== initialFormData.line) {updatedFields.line = line; updatedFields.line_old = initialFormData.line};
  updatedFields.modelnew = model || initialFormData.model;
  updatedFields.partnanew = part_name || initialFormData.partna;
  updatedFields.linenew = line || initialFormData.line;
  const name = localStorage.getItem("name");

  // Clean ext values from backend (remove quotes and whitespace)
  const cleanedInitialExt = (val) => (val || "").replaceAll('"', '').split(',').map(s => s.trim()).join(',');
  const newExt1 = ext1Materials.join(',');
  const newExt2 = ext2Materials.join(',');
  const newExt3 = ext3Materials.join(',');
  const newExt4 = ext4Materials.join(',');
  const oldExt1 = cleanedInitialExt(initialFormData.ext1);
  const oldExt2 = cleanedInitialExt(initialFormData.ext2);
  const oldExt3 = cleanedInitialExt(initialFormData.ext3);
  const oldExt4 = cleanedInitialExt(initialFormData.ext4);

  if (newExt1 !== oldExt1) {updatedFields.ext1 = newExt1; updatedFields.old_ext1 = oldExt1};
  if (newExt2 !== oldExt2) {updatedFields.ext2 = newExt2; updatedFields.old_ext2 = oldExt2};
  if (newExt3 !== oldExt3) {updatedFields.ext3 = newExt3; updatedFields.old_ext3 = oldExt3};
  if (newExt4 !== oldExt4) {updatedFields.ext4 = newExt4; updatedFields.old_ext4 = oldExt4};
  if (name) updatedFields.username = name;
  // if (newExt2 !== cleanedInitialExt(initialFormData.ext2)) updatedFields.ext2 = newExt2;
  // if (newExt3 !== cleanedInitialExt(initialFormData.ext3)) updatedFields.ext3 = newExt3;
  // if (newExt4 !== cleanedInitialExt(initialFormData.ext4)) updatedFields.ext4 = newExt4;

  // If nothing changed, show info and return
  if (Object.keys(updatedFields).length === 0) {
    setAlertMessage("No changes detected.");
    setAlertType("info");
    return;
  }

  // Append required fields for WHERE clause
  updatedFields.part_id = selectedId;

  try {
    const response = await fetch('http://163.125.102.142:5000/api/add_part', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        button: 'Update',
        ...updatedFields,
      }),
    });

    if (response.ok) {
      handleClose3();
      setAlertMessage("Target Sheet Updated Successfully");
      setAlertType("success");
    } else {
      setAlertMessage("Failed to update Target Sheet");
      setAlertType("error");
    }
  } catch (error) {
    console.error("Update error:", error);
    setAlertMessage("Server error during update");
    setAlertType("error");
  }
};

const handleOpen4 = (id) => {
    const selectedRow = data.find((row) => row.id === id);
    setSelectedId(id);
    if (selectedRow) {
      setInitialFormData(selectedRow);

      setline(selectedRow.line || "");
      setPartName(selectedRow.partna || "");
      setModel(selectedRow.model || "");
    }
    setOpen4(true);
  };
  const handleClose4 = () => {
    setOpen4(false)
  }
  const handleSubmit4 = async () => {
  const updatedFields = {};

  updatedFields.modelnew = model;
  updatedFields.partnanew = part_name;
  updatedFields.linenew = line;
  const name = localStorage.getItem("name");

  if(line !== initialFormData.line) {updatedFields.line = line; updatedFields.line_old = initialFormData.line};
  if (name) updatedFields.username = name;
  
  if (Object.keys(updatedFields).length === 0) {
    setAlertMessage("No changes detected.");
    setAlertType("info");
    return;
  }
  // Append required fields for WHERE clause
  updatedFields.part_id = selectedId;
  try {
    const response = await fetch('http://163.125.102.142:5000/api/add_part', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        button: 'Update',
        ...updatedFields,
      }),
    });
    if (response.ok) {
      handleClose4();
      setAlertMessage("Target Sheet Updated Successfully");
      setAlertType("success");
    } else {
      setAlertMessage("Failed to update Target Sheet");
      setAlertType("error");
    }
  } catch (error) {
    console.error("Update error:", error);
    setAlertMessage("Server error during update");
    setAlertType("error");
  }
};

const handleOpen5 = (id) => {
    const selectedRow = data.find((row) => row.id === id);
    setSelectedId(id);
    if (selectedRow) {
      setInitialFormData(selectedRow); // store original

      setExt1Materials((selectedRow.ext1 || "").replaceAll('"', "").split(',').map(s => s.trim()));
      setExt2Materials((selectedRow.ext2 || "").replaceAll('"', "").split(',').map(s => s.trim()));
      setExt3Materials((selectedRow.ext3 || "").replaceAll('"', "").split(',').map(s => s.trim()));
      setExt4Materials((selectedRow.ext4 || "").replaceAll('"', "").split(',').map(s => s.trim()));
    }
    setOpen5(true);
  };
  const handleClose5 = () => {
    setOpen5(false)
  }
  const handleSubmit5 = async () => {
  const updatedFields = {};
  
  updatedFields.modelnew = model;
  updatedFields.partnanew = part_name;
  updatedFields.linenew = line;
  const name = localStorage.getItem("name");

  // Clean ext values from backend (remove quotes and whitespace)
  const cleanedInitialExt = (val) => (val || "").replaceAll('"', '').split(',').map(s => s.trim()).join(',');
  const newExt1 = ext1Materials.join(',');
  const newExt2 = ext2Materials.join(',');
  const newExt3 = ext3Materials.join(',');
  const newExt4 = ext4Materials.join(',');
  const oldExt1 = cleanedInitialExt(initialFormData.ext1);
  const oldExt2 = cleanedInitialExt(initialFormData.ext2);
  const oldExt3 = cleanedInitialExt(initialFormData.ext3);
  const oldExt4 = cleanedInitialExt(initialFormData.ext4);

  if (newExt1 !== oldExt1) {updatedFields.ext1 = newExt1; updatedFields.old_ext1 = oldExt1};
  if (newExt2 !== oldExt2) {updatedFields.ext2 = newExt2; updatedFields.old_ext2 = oldExt2};
  if (newExt3 !== oldExt3) {updatedFields.ext3 = newExt3; updatedFields.old_ext3 = oldExt3};
  if (newExt4 !== oldExt4) {updatedFields.ext4 = newExt4; updatedFields.old_ext4 = oldExt4};
  if (name) updatedFields.username = name;
  
  if (Object.keys(updatedFields).length === 0) {
    setAlertMessage("No changes detected.");
    setAlertType("info");
    return;
  }
  // Append required fields for WHERE clause
  updatedFields.part_id = selectedId;
  try {
    const response = await fetch('http://163.125.102.142:5000/api/add_part', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        button: 'Update',
        ...updatedFields,
      }),
    });
    if (response.ok) {
      handleClose5();
      setAlertMessage("Target Sheet Updated Successfully");
      setAlertType("success");
    } else {
      setAlertMessage("Failed to update Target Sheet");
      setAlertType("error");
    }
  } catch (error) {
    console.error("Update error:", error);
    setAlertMessage("Server error during update");
    setAlertType("error");
  }
};

  const columns = [
    { field: "part_id", headerName: "Part ID", flex: 1 },
    { field: "partna", headerName: "Part Name", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
    { field: "customer", headerName: "Customer", flex: 1},
    { field: "plant", headerName: "Plant", flex: 1},
    { field: "line", headerName: "Line", flex: 1 },
    { field: "changeover_time", headerName: "Changeover Time (min)", flex: 1 },
    { field: "startup_time", headerName: "Startup Time (min)", flex: 1 },
    { field: "startup_rej", headerName: "Startup Rejection (%)", flex: 1 },
    { field: "line_rej", headerName: "Line Rejection (%)", flex: 1 },
    { field: "part_weight", headerName: "Part Weight (g)", flex: 1 },
    { field: "standard_line_speed", headerName: "Std. Line Speed", flex: 1 },
    { field: "part_length", headerName: "Part Length (mm)", flex: 1 },
    { field: "productivity", headerName: "Productivity", flex: 1 },
    { field: "target_ideal", headerName: "Target Ideal", flex: 1 },
    { field: "target_w_st", headerName: "Target With ST", flex: 1 },
    { field: "target_w_co", headerName: "Target With CO", flex: 1 },
    { field: "rejection_rate", headerName: "Rejection Rate (%)", flex: 1 },
    { field: "cycle_time", headerName: "Cycle Time (sec)", flex: 1 },
    { field: "ext1", headerName: "Extruder 1 Material", flex: 1 },
    { field: "ext2", headerName: "Extruder 2 Material", flex: 1 },
    { field: "ext3", headerName: "Extruder 3 Material", flex: 1 },
    { field: "ext4", headerName: "Extruder 4 Material", flex: 1 },
    { field: "metal", headerName: "Wire/Strip", flex: 1 },
    {field: "ex_mat", headerName: "Ëxtra Material", flex: 1},
    {
      field : 'actions', 
      headerName : '4M Change', 
      flex :2,
      renderCell : (params) => {
        const machineClick = (event) =>{
          event.stopPropagation();
          handleOpen5(params.row['id']);
        };
        const materialClick = (event) => {
          event.stopPropagation();
          handleOpen4(params.row['id'])
        }
        return(
          <Box>
            <Button sx={{mr:'5px', backgroundColor:'#154c79'}} variant='contained' color="info" size="small" onClick={machineClick}>
              <HubIcon />
            </Button>
            <Button sx={{backgroundColor:'#154c79'}} variant='contained' color="info" size="small" onClick={materialClick}>
              <PrecisionManufacturingIcon />
            </Button>
          </Box>
        )}
    }
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
      <Header title="Target Sheet"  />

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
            Add New Part
          </Typography>
          
          <TextField label="Part Name" fullWidth value={part_name} onChange={(e) => setPartName(e.target.value)} />
          <TextField label="Model" fullWidth value={model} onChange={(e) => setModel(e.target.value)} />
          <TextField label="Customer" fullWidth value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <TextField label="Changeover Time (min)" type="number" fullWidth value={changeover_time} onChange={(e) => setChangeoverTime(e.target.value)} />
          <TextField label="Startup Time (min)" type="number" fullWidth value={startup_time} onChange={(e) => setStartupTime(e.target.value)} />
          <TextField label="Startup Rejection (%)" type="number" fullWidth value={startup_rej} onChange={(e) => setStartupRej(e.target.value)} />
          <TextField label="Line Rejection (%)" type="number" fullWidth value={line_rej} onChange={(e) => setLineRej(e.target.value)} />
          <TextField label="Part Weight (g)" type="number" fullWidth value={part_weight} onChange={(e) => setPartWeight(e.target.value)} />
          <TextField label="Standard Line Speed (m/min)" type="number" fullWidth value={standard_line_speed} onChange={(e) => setStandardLineSpeed(e.target.value)} />
          <TextField label="Part Length (mm)" type="number" fullWidth value={part_length} onChange={(e) => setPartLength(e.target.value)} />
          <TextField label="Productivity" type="number" fullWidth value={productivity} onChange={(e) => setProductivity(e.target.value)} />
          <TextField label="Target Ideal" type="number" fullWidth value={target_ideal} onChange={(e) => setTargetIdeal(e.target.value)} />
          <TextField label="Target With Setup Time" type="number" fullWidth value={target_w_st} onChange={(e) => setTargetWST(e.target.value)} />
          <TextField label="Target With Changeover" type="number" fullWidth value={target_w_co} onChange={(e) => setTargetWCO(e.target.value)} />
          <TextField label="Rejection Rate (%)" type="number" fullWidth value={rejection_rate} onChange={(e) => setRejectionRate(e.target.value)} />
          <TextField label="Cycle Time (sec)" type="number" fullWidth value={cycle_time} onChange={(e) => setCycleTime(e.target.value)} />

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
            Delete Part
          </Typography>
          <Typography variant="h6" mt="10px">
            Please Enter the Part ID : 
          </Typography>
          <TextField 
            label="Part ID"
            fullWidth
            type="Number"
            value={partID}
            onChange={ (e) => setpartID(e.target.value)}
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
            Are you sure you want to delete Part ID: <strong>{partID}</strong>?
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
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2 }}>
            Update Part
          </Typography>

          <TextField fullWidth label="Part Name" value={part_name} onChange={(e) => setPartName(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Model" value={model} onChange={(e) => setModel(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Customer" value={customer} onChange={(e) => setCustomer(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Plant" value={plant} onChange={(e) => setplant(e.target.value)} sx={{ mb: 2 }} />
          {/* <TextField fullWidth label="Line" value={line} onChange={(e) => setline(e.target.value)} sx={{ mb: 2 }} /> */}
          <TextField fullWidth label="Changeover Time" type="number" value={changeover_time} onChange={(e) => setChangeoverTime(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Startup Time" type="number" value={startup_time} onChange={(e) => setStartupTime(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Startup Rejection (%)" type="number" value={startup_rej} onChange={(e) => setStartupRej(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Line Rejection (%)" type="number" value={line_rej} onChange={(e) => setLineRej(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Part Weight (g)" type="number" value={part_weight} onChange={(e) => setPartWeight(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Std. Line Speed" type="number" value={standard_line_speed} onChange={(e) => setStandardLineSpeed(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Part Length (mm)" type="number" value={part_length} onChange={(e) => setPartLength(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Productivity" type="number" value={productivity} onChange={(e) => setProductivity(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Target Ideal" type="number" value={target_ideal} onChange={(e) => setTargetIdeal(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Target with ST" type="number" value={target_w_st} onChange={(e) => setTargetWST(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Target with CO" type="number" value={target_w_co} onChange={(e) => setTargetWCO(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Rejection Rate" type="number" value={rejection_rate} onChange={(e) => setRejectionRate(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Cycle Time (s)" type="number" value={cycle_time} onChange={(e) => setCycleTime(e.target.value)} sx={{ mb: 2 }} />
          {/* <TextField fullWidth label="Extruder 1 Material" value={ext1} onChange={(e) => setext1(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Extruder 2 Material" value={ext2} onChange={(e) => setext2(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Extruder 3 Material" value={ext3} onChange={(e) => setext3(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Extruder 4 Material" value={ext4} onChange={(e) => setext4(e.target.value)} sx={{ mb: 2 }} /> */}
          {/* <Typography variant="h6">Extruder 1</Typography>
            {ext1Materials.map((mat, i) => (
              <TextField
                key={`ext1-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext1Materials];
                  newList[i] = e.target.value;
                  setExt1Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt1Materials([...ext1Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt1Materials(ext1Materials.slice(0, -1))}
                disabled={ext1Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

            <Typography variant="h6">Extruder 2</Typography>
            {ext2Materials.map((mat, i) => (
              <TextField
                key={`ext2-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext2Materials];
                  newList[i] = e.target.value;
                  setExt2Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt2Materials([...ext2Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt2Materials(ext2Materials.slice(0, -1))}
                disabled={ext2Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

            <Typography variant="h6">Extruder 3</Typography>
            {ext3Materials.map((mat, i) => (
              <TextField
                key={`ext3-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext3Materials];
                  newList[i] = e.target.value;
                  setExt3Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt3Materials([...ext3Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt3Materials(ext3Materials.slice(0, -1))}
                disabled={ext3Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

            <Typography variant="h6">Extruder 4</Typography>
            {ext4Materials.map((mat, i) => (
              <TextField
                key={`ext4-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext4Materials];
                  newList[i] = e.target.value;
                  setExt4Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt4Materials([...ext4Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt4Materials(ext4Materials.slice(0, -1))}
                disabled={ext4Materials.length === 0}
              >
                Remove
              </Button>
            </Box> */}

          <Button color="info" variant="contained" fullWidth onClick={handleSubmit3}>
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={open5} onClose={handleClose5}>
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
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2 }}>
            4M Change - Material Update
          </Typography>

          <Typography variant="h6">Extruder 1</Typography>
            {ext1Materials.map((mat, i) => (
              <TextField
                key={`ext1-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext1Materials];
                  newList[i] = e.target.value;
                  setExt1Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt1Materials([...ext1Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt1Materials(ext1Materials.slice(0, -1))}
                disabled={ext1Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

            {/* Repeat for Extruder 2 */}
            <Typography variant="h6">Extruder 2</Typography>
            {ext2Materials.map((mat, i) => (
              <TextField
                key={`ext2-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext2Materials];
                  newList[i] = e.target.value;
                  setExt2Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt2Materials([...ext2Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt2Materials(ext2Materials.slice(0, -1))}
                disabled={ext2Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

            {/* Repeat for Extruder 3 */}
            <Typography variant="h6">Extruder 3</Typography>
            {ext3Materials.map((mat, i) => (
              <TextField
                key={`ext3-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext3Materials];
                  newList[i] = e.target.value;
                  setExt3Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt3Materials([...ext3Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt3Materials(ext3Materials.slice(0, -1))}
                disabled={ext3Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

            {/* Repeat for Extruder 4 */}
            <Typography variant="h6">Extruder 4</Typography>
            {ext4Materials.map((mat, i) => (
              <TextField
                key={`ext4-${i}`}
                fullWidth
                label={`Material ${i + 1}`}
                value={mat}
                onChange={(e) => {
                  const newList = [...ext4Materials];
                  newList[i] = e.target.value;
                  setExt4Materials(newList);
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" onClick={() => setExt4Materials([...ext4Materials, ""])}>Add</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setExt4Materials(ext4Materials.slice(0, -1))}
                disabled={ext4Materials.length === 0}
              >
                Remove
              </Button>
            </Box>

          <Button color="info" variant="contained" fullWidth onClick={handleSubmit5}>
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={open4} onClose={handleClose4}>
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
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2 }}>
            4M Change - Machine Update
          </Typography>

          <Select fullWidth label="Line" value={line} onChange={(e) => setline(e.target.value)} sx={{ mb: 2 }} >
            <MenuItem value='Line 1'>Line 1</MenuItem>
            <MenuItem value='Line 2'>Line 2</MenuItem>
            <MenuItem value='Line 3'>Line 3</MenuItem>
            <MenuItem value='Line 4'>Line 4</MenuItem>
            <MenuItem value='Line 5'>Line 5</MenuItem>
            <MenuItem value='Line 6'>Line 6</MenuItem>
            <MenuItem value='Line 8'>Line 8</MenuItem>
          </Select>

          <Button color="info" variant="contained" fullWidth onClick={handleSubmit4}>
            Submit
          </Button>
        </Box>
      </Modal>

      
    </Box>
    </Box>
    
    </Box>
  );
};

export default TargetSheet;

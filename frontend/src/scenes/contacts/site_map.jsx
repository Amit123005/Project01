import { Box, FormControl, InputLabel, Input, MenuItem, Select, Button,  Modal, TextField, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import dayjs from "dayjs";
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from 'axios';

const SiteMap = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [part_name, setPartName] = useState("");
  const [site, setsite] = useState("");
  const [plant, setplant] = useState("");
  const [department, setdepartment] = useState("");
  const [area, setarea] = useState("");
  const [subarea, setsubarea] = useState("");
  const [machine, setmachine] = useState("");
  const [man, setman] = useState("");
  const [model, setModel] = useState("");
  const [line, setline] = useState('');
  const [initialFormData, setInitialFormData] = useState({});
  const [ext1Materials, setExt1Materials] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [id, setid] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [options, setOptions] = useState({});
  const [selectedChange, setSelectedChange] = useState("");
  const [currentData, setCurrentData] = useState({});
  const [selectedAction, setselectedAction] = useState("");
  const [selectedtype, setselectedtype] = useState("");
  const [selectedretro, setselectedretro] = useState("");

  useEffect(() => {
    axios.get('http://163.125.102.142:5000/api/change_options')
      .then(res => setOptions(res.data));
  }, []);

  const handleChangeDesc = (e) => {
    const desc = e.target.value;
    setSelectedChange(desc);
    setCurrentData(options[desc]);
  };

  const isSubmitDisabled =
  !selectedChange ||
  (Array.isArray(currentData?.type_of_change) && !selectedtype) ||
  (Array.isArray(currentData?.action) && !selectedAction) ||
  (Array.isArray(currentData?.retroactive_inspection) && !selectedretro) ||
  ext1Materials.length === 0 || ext1Materials.some((mat) => mat.trim() === "");

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch(`http://163.125.102.142:5000/api/site_map`);
        const result = await response.json();

        const transformedData = result.map((item) => ({
          id: item.id,
          site: item.site,
          plant: item.plant,
          department: item.department,
          area: item.area,
          sub_area: item.sub_area,
          machine: item.machine,
          man: item.man,
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
      const response = await fetch('http://163.125.102.142:5000/api/add_site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          button: 'Add',
          site,
          plant,
          department, 
          area,
          subarea,
          machine,
          man
        }),
      });
  
      if (response.ok) {
        handleClose(); // Close modal
        setAlertMessage('Site Added Successfully');
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
          const response = await fetch('http://163.125.102.142:5000/api/add_site',{
            method:'POST',
            headers : {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'button': 'Delete',
              'part_id':id
            })
          })
          if (response.ok){
            handleClose2();
            setAlertMessage("Part Deleted Successfully")
            setAlertType("Success")
            setConfirmOpen(false);
            setOpen2(false); // Close modal if needed
            setid('');
          }else{
            console.error("Failed to Delete Part")
          }
        }catch (error){
          console.error("Error is : ". error)
        }
  }
  }

const handleOpen5 = (id) => {
    const selectedRow = data.find((row) => row.id === id);
    setSelectedId(id);
    if (selectedRow) {
      setInitialFormData(selectedRow); 

      setExt1Materials((selectedRow.man || "").replaceAll('"', "").split(',').map(s => s.trim()));
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
  const oldExt1 = cleanedInitialExt(initialFormData.man);

  if (newExt1 !== oldExt1) {updatedFields.man = newExt1; updatedFields.man_old = oldExt1};
  if (name) updatedFields.username = name;
  if(selectedChange) {
    updatedFields.change_desc = selectedChange;
    updatedFields.type_of_change = selectedtype || currentData.type_of_change;
    updatedFields.action = selectedAction;
    updatedFields.abnormal_situation = currentData.abnormal_situation;
    updatedFields.setup_approval = currentData.setup_approval;
    updatedFields.retroactive_inspection = selectedretro || currentData.retroactive_inspection;
    updatedFields.suspected_lot = currentData.suspected_lot;
  }
  
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
    { field: "id", headerName: "Site ID", flex: 1 },
    { field: "site", headerName: "Site", flex: 1 },
    { field: "plant", headerName: "Plant", flex: 1},
    { field: "department", headerName: "Department", flex: 1 },
    { field: "area", headerName: "Area", flex: 1 },
    { field: "sub_area", headerName: "Sub Area", flex: 1 },
    { field: "machine", headerName: "Machine", flex: 1 },
    { field: "man", headerName: "Man", flex: 1 },
    {
      field : 'actions', 
      headerName : '4M Change', 
      flex :1,
      renderCell : (params) => {
        const manClick = (event) =>{
          event.stopPropagation();
          handleOpen5(params.row['id']);
        };

        return(
          <Box>
            <Button sx={{backgroundColor:'#154c79'}} variant='contained' color="info" size="small" onClick={manClick}>
              <PersonIcon />
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
      <Header title="Site Mapping Sheet"  />
    
      <Box mb="10px" gap="10px">
        <Button onClick={handleOpen} sx={{ padding: "8px 1rem", backgroundColor:'#B9B9CC', borderRadius:"0px" }}>{<AddBoxIcon/>} Add</Button>
        <Button onClick={handleOpen2} sx={{ padding: "8px 1rem", backgroundColor:'#B9B9CC', borderRadius:"0px" }}>{<DeleteIcon/>} Delete</Button>
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
                  Add Site
                </Typography>
                <Typography sx={{mb:'-10px'}}>Site</Typography>
                <Select label="Site" fullWidth value={site} onChange={(e) => setsite(e.target.value)} >
                  <MenuItem value='PPAP'>PPAP</MenuItem>
                </Select>
                <Typography sx={{mb:'-10px'}}>Plant</Typography>
                <Select label="Plant" fullWidth value={plant} onChange={(e) => setplant(e.target.value)} >
                  <MenuItem value='PP02'>PP02</MenuItem>
                  <MenuItem value='PP03'>PP03</MenuItem>
                  <MenuItem value='PP04'>PP04</MenuItem>
                  <MenuItem value='PP05'>PP05</MenuItem>
                  <MenuItem value='PP06'>PP06</MenuItem>
                  <MenuItem value='PP07'>PP07</MenuItem>
                  <MenuItem value='PP08'>PP08</MenuItem>
                </Select>
                <Typography sx={{mb:'-10px'}}>Department</Typography>
                <Select label="Department" fullWidth value={department} onChange={(e) => setdepartment(e.target.value)} >
                  <MenuItem value='Production'>Production</MenuItem>
                  <MenuItem value='Quality'>Quality</MenuItem>
                  <MenuItem value='PPC'>PPC</MenuItem>
                  <MenuItem value='Safety'>Safety</MenuItem>
                  <MenuItem value='Maintenance'>Maintenance</MenuItem>
                </Select>
                <Typography sx={{mb:'-10px'}}>Area</Typography>
                <Select label="Area" fullWidth value={area} onChange={(e) => setarea(e.target.value)} >
                  <MenuItem value='Assembly'>Assembly</MenuItem>
                  <MenuItem value='Extrusion'>Extrusion</MenuItem>
                  <MenuItem value='Maintenance'>Maintenance</MenuItem>
                  <MenuItem value='Safety'>Safety</MenuItem>
                  <MenuItem value='PPC'>PPC</MenuItem>
                  <MenuItem value='Quality'>Quality</MenuItem>
                </Select>
                <Typography sx={{mb:'-10px'}}>Sub Area</Typography>
                <Select label="Sub Area" fullWidth value={subarea} onChange={(e) => setsubarea(e.target.value)} >
                  <MenuItem value='Line 1'>Line 1</MenuItem>
                  <MenuItem value='Line 2'>Line 2</MenuItem>
                  <MenuItem value='Line 3'>Line 3</MenuItem>
                  <MenuItem value='Line 4'>Line 4</MenuItem>
                  <MenuItem value='Line 5'>Line 5</MenuItem>
                  <MenuItem value='Line 6'>Line 6</MenuItem>
                  <MenuItem value='Line 8'>Line 8</MenuItem>
                </Select>
                <Typography sx={{mb:'-10px'}}>Machine</Typography>
                <Select label="Sub Area" fullWidth value={machine} onChange={(e) => setmachine(e.target.value)} >
                  <MenuItem value='Line 1'>Line 1</MenuItem>
                  <MenuItem value='Line 2'>Line 2</MenuItem>
                  <MenuItem value='Line 3'>Line 3</MenuItem>
                  <MenuItem value='Line 4'>Line 4</MenuItem>
                  <MenuItem value='Line 5'>Line 5</MenuItem>
                  <MenuItem value='Line 6'>Line 6</MenuItem>
                  <MenuItem value='Line 8'>Line 8</MenuItem>
                </Select>
                <Typography sx={{mb:'-10px'}}>Man</Typography>
                <TextField fullWidth value={man} onChange={(e) => setman(e.target.value)}/>
                
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
                  Delete Site
                </Typography>
                <Typography variant="h6" mt="10px">
                  Please Enter the Part ID : 
                </Typography>
                <TextField 
                  label="Part ID"
                  fullWidth
                  type="Number"
                  value={id}
                  onChange={ (e) => setid(e.target.value)}
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
                  Are you sure you want to delete Part ID: <strong>{id}</strong>?
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
            4M Change - Man Update
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Change Description</InputLabel>
            <Select
              value={selectedChange}
              onChange={(e) => {
                const selected = e.target.value;
                setSelectedChange(selected);
                setCurrentData(options[selected]);
              }}
            >
              {Object.keys(options).map((key) => (
                <MenuItem key={key} value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Other Cascading Dropdowns */}
          {selectedChange && (
            <>
            {currentData?.type_of_change && (
              Array.isArray(currentData.type_of_change) ? (
                <FormControl>
                  <InputLabel>Type of Change</InputLabel>
                  <Select
                    value={selectedtype}
                    onChange={(e) => setselectedtype(e.target.value)}>
                      {currentData.type_of_change.map((opt,i) => (
                        <MenuItem key={i} value={opt}>{opt}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                fullWidth
                label="Type of Change"
                value={currentData.type_of_change}
                disabled
                 />
              )
            )}
              <FormControl fullWidth>
                <InputLabel>Action</InputLabel>
                <Select
                  value={selectedAction}
                  onChange={(e) => setselectedAction(e.target.value)}
                  >
                  {currentData?.action?.map((act, index) => (
                    <MenuItem key={index} value={act}>{act}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Abnormal Situation"
                value={currentData?.abnormal_situation || ""}
                fullWidth
                disabled
              />
              <TextField
                label="Setup Approval"
                value={currentData?.setup_approval || ""}
                fullWidth
                disabled
              />
              {currentData?.retroactive_inspection && (
                Array.isArray(currentData.retroactive_inspection) ? (
                  <FormControl fullWidth>
                    <InputLabel>Retroactive Inspection</InputLabel>
                    <Select
                      value={selectedretro}
                      onChange={(e) => setselectedretro(e.target.value)}
                    >
                      {currentData.retroactive_inspection.map((opt, i) => (
                        <MenuItem key={i} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label="Retroactive Inspection"
                    value={currentData.retroactive_inspection}
                    disabled
                  />
                )
              )}
              <TextField
                label="Suspected Lot"
                value={currentData?.suspected_lot || ""}
                fullWidth
                disabled
              />
            </>
          )}

          {/* <Typography variant="h6">Man</Typography> */}
            {ext1Materials.map((mat, i) => (
              <TextField
                key={`ext1-${i}`}
                fullWidth
                label={`Operator ${i + 1}`}
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

          <Button color="info" variant="contained" disabled={isSubmitDisabled} fullWidth onClick={handleSubmit5}>
            Submit
          </Button>
        </Box>
      </Modal>

      
    </Box>
    </Box>
    
    </Box>
  );
};

export default SiteMap;

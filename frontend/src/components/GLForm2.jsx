import react from "react";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Menu, MenuItem, Grid, Typography } from "@mui/material";
import axios from "axios";

function GLForm2() {
  
  // ---------------------  Way 1 of Initialising the Form Variable  ---------------------
  // const [FormData, setformData] = useState({
  //   "date" : "",
  //   "shift" : "",
  //   "model" : "",
  //   "part_name" : "",
  //   "fr_target" : "",
  //   "rr_target" : "",
  //   "fr_act" : "",
  //   "rr_act" : "",
  //   "startup_rej" : "",
  //   "line_rej" : "",
  //   "fr_wt" : "",
  //   "rr_wt" : "",
  //   "co_time" : "",
  //   "setup_time" : "",
  //   "dt_time" : "",
  //   "fr_len" : "",
  //   "rr_len" : "",
  //   "duration" : ""
  // })


  // ---------------------  Way 2 of Initialising the Form Variable  ---------------------
  const fields = [
    "date", "line", "model", "part_name", "customer", "fr_target", "rr_target", "fr_act", "rr_act", "startup_rej", "line_rej",
    "fr_wt", "rr_wt", "co_time", "setup_time", "dt_time", "fr_len", "rr_len", "duration", "indirect_cost", "old_dhoti", "hand_gloves", "corrogard", "start_reading", "end_reading"
  ];
  const initialData= fields.reduce((acc, field) => {
    acc[field] = "";
    return acc;
  }, {})
  const [FormData, setformData] = useState(initialData)

  const handleChange = (e) => {
    setformData({
      ...FormData,
      [e.target.name] : e.target.value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const url = 'http://163.125.102.142:5000/api/gl_form2'
      const payload = {
        ...FormData,
        plant : "PP02"
      }
      const response = await axios.post(url, payload)
      if (response.data) {
        alert("Data Submitted Successfully");
        setformData(initialData)
      }
    }catch (err){
      console.log(`Error is: `, err);
      alert("Something went wrong while submitting.");
    }
  }

  return (
    <Box width="40%" ml="90px" mt="30px" component="form" display="grid" gap="1" onSubmit={handleSubmit} sx={{gridTemplateColumns:"repeat(4,1fr)" ,gap:'5px', mx:"auto"}}>
      <Typography sx={{gridColumn:"span 4", mb:"30px", mx:"auto", fontSize:"1.5rem", fontWeight:"bold"}}>GL Board Entry Form</Typography>
      <TextField type="date" name="date" label="Date" value={FormData.date} onChange={handleChange} InputLabelProps={{shrink : true}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Line" name="line" inputProps={{min:0}} value="8" onChange={handleChange} sx={{gridColumn:"span 2", mb:"10px"}} required disabled>
      {[1,2,3,4,5,6,7,8].map((num) => <MenuItem key={num} value={num}>{num}</MenuItem>)}</TextField>
      <TextField  label="Model" name="model" value={FormData.model} onChange={handleChange} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField select label="Part Name" name="part_name" value={FormData.part_name} onChange={handleChange} sx={{gridColumn:"span 2", mb:"10px"}} required >
        {["W/S OUTER","W/S INNER","MWS","MROOF","SPOILER","LIP","GRC","SLIDE RAIL"].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField select label="Customer" name="customer" value={FormData.customer} onChange={handleChange} sx={{gridColumn:"span 2", mb:"10px"}} required >
        {["MSIL","HCIL","TKML","TATA","MARKET","VW","GM","M&M","MG"].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField  label="FR Part Target(Nos)" name="fr_target" type="number" value={FormData.fr_target} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="RR Part Target(Nos)" name="rr_target" type="number" value={FormData.rr_target} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="FR Part Actual(Nos)" name="fr_act" type="number" value={FormData.fr_act} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="RR Part Actual(Nos)" name="rr_act" type="number" value={FormData.rr_act} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Startup Rejection(Kg)" type="number" name="startup_rej" value={FormData.startup_rej} inputProps={{ min:0,step:'any'}} onChange={handleChange} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Line Rejection(Kg)" name="line_rej" type="number" value={FormData.line_rej} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="FR Part Weight(g)" name="fr_wt" type="number" value={FormData.fr_wt} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="RR Part Weight(g)" name="rr_wt" type="number" value={FormData.rr_wt} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Change Over Time(Min)" name="co_time" type="number" value={FormData.co_time} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Setup time(Min)" name="setup_time" type="number" value={FormData.setup_time} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Downtime(Min)" name="dt_time" type="number" value={FormData.dt_time} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="FR Part Length(mm)" name="fr_len" type="number" value={FormData.fr_len} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="RR Part Length(mm)" name="rr_len" type="number" value={FormData.rr_len} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Duration(Min)" name="duration" type="number" value={FormData.duration} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      {/* <TextField  label="Indirect Cost" name="indirect_cost" type="number" value={FormData.indirect_cost} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/> */}
      <TextField  label="Old Dhoti" name="old_dhoti" type="number" value={FormData.old_dhoti} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Hand Gloves" name="hand_gloves" type="number" value={FormData.hand_gloves} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Corrogard" name="corrogard" type="number" value={FormData.corrogard} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="Start Reading(Energy)" name="start_reading" type="number" value={FormData.start_reading} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <TextField  label="End Reading(Energy)" name="end_reading" type="number" value={FormData.end_reading} onChange={handleChange} inputProps={{ min:0,step:'any'}} sx={{gridColumn:"span 2", mb:"10px"}} required/>
      <Button type="submit" variant="contained" sx={{backgroundColor:"#154c79", gridColumn:"span 4", height:"50px", fontWeight:"bold"}}>Submit</Button>
    </Box>
  );
}
 
export default GLForm2;
import react from "react";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Menu, MenuItem, Grid, Typography } from "@mui/material";
import axios from "axios";

function GLQualForm() {
  // ---------------------  Way 2 of Initialising the Form Variable  ---------------------
  const fields = ["date", "line", "problem", "action", "target_date", "responsibility"];
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
      const url = 'http://163.125.102.142:5000/api/gl_qual_form'
      const payload = {
        ...FormData,
        plant : "PP02"
      }
      const response = await axios.post(url, payload)
      if (response.data) {
        alert("Data Submitted Successfully");
        // setformData(initialData)
      }
    }catch (err){
      console.log(`Error is: `, err);
      alert("Something went wrong while submitting.");
    }
  }

  return (
    <Box width="30%" ml="90px" mt="30px" component="form" display="grid" gap="1" onSubmit={handleSubmit} sx={{gridTemplateColumns:"repeat(4,1fr)" ,gap:'5px', mx:"auto"}}>
      <Typography sx={{gridColumn:"span 4", mb:"30px", mx:"auto", fontSize:"1.5rem", fontWeight:"bold"}}>Quality Action Plan Form</Typography>
      <TextField type="date" name="date" label="Date" value={FormData.date} onChange={handleChange} InputLabelProps={{shrink : true}} sx={{gridColumn:"span 4", mb:"20px"}} required/>
      <TextField  label="Line" name="line" select inputProps={{min:0}} value={FormData.line} onChange={handleChange} sx={{gridColumn:"span 4", mb:"20px"}} required>
      {[1,2,3,4,5,6,8].map((num) => <MenuItem key={num} value={num}>{num}</MenuItem>)}</TextField>
      <TextField  label="Problem" name="problem" value={FormData.problem} onChange={handleChange} sx={{gridColumn:"span 4", mb:"20px"}} required/>
      <TextField  label="Action Taken" name="action" value={FormData.action} onChange={handleChange} sx={{gridColumn:"span 4", mb:"20px"}} required/>
      <TextField type="date" name="target_date" label="Target Date" value={FormData.target_date} onChange={handleChange} InputLabelProps={{shrink : true}} sx={{gridColumn:"span 4", mb:"20px"}} required/>
      <TextField  label="Responsibility" name="responsibility" value={FormData.responsibility} onChange={handleChange} sx={{gridColumn:"span 4", mb:"20px"}} required/>
      <Button type="submit" variant="contained" sx={{backgroundColor:"#154c79", gridColumn:"span 4", height:"50px", fontWeight:"bold"}}>Submit</Button>
    </Box>
  );
}
 
export default GLQualForm;
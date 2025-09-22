// src/components/FourMChangeForm.jsx
import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Grid, Typography } from "@mui/material";
import axios from "axios";

function GL4MForm() {
  // all fields from your table
  const fields = [
    "date", "shift", "plant", "area", "sub_area",
    "category", "detail", "bd_reason", "bd_time",
    "total_qty", "action_taken", "retro_total", "retro_ok", "retro_ng",
    "suspected_total", "suspected_ok", "suspected_ng"
  ];

  const initialData = fields.reduce((acc, field) => {
    acc[field] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://163.125.102.142:5000/api/four_m_add"; // backend API
      const payload = {
        ...formData,
        plant: "PP02"
      }
      const response = await axios.post(url, payload);
      if (response.data) {
        alert("Data Submitted Successfully");
        setFormData(initialData);
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Something went wrong while submitting.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="grid"
      gap={2}
      sx={{ gridTemplateColumns: "repeat(2,1fr)", maxWidth: 800, mx: "auto", mt: 4 }}
    >
      <Typography sx={{ gridColumn: "span 2", fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
        4M Change Form
      </Typography>

      <TextField type="date" name="date" label="Date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={{ gridColumn: "span 1" }} />
      
      <TextField name="shift" label="Shift" select value={formData.shift} onChange={handleChange} required>
        {["A", "B", "C"].map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>

      <TextField name="area" label="Area" value={formData.area} onChange={handleChange} />

      <TextField name="sub_area" label="Sub Area" value={formData.sub_area} onChange={handleChange} />

      <TextField name="category" label="Category" select value={formData.category} onChange={handleChange} required>
        {["Man", "Machine", "Material", "Method"].map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>

      <TextField name="detail" label="Detail" value={formData.detail} onChange={handleChange} multiline rows={3} sx={{ gridColumn: "span 2" }} />

      <TextField name="bd_reason" label="Breakdown Reason" value={formData.bd_reason} onChange={handleChange} sx={{ gridColumn: "span 2" }} />
      <TextField type="number" name="bd_time" label="Breakdown Time (hrs)" value={formData.bd_time} onChange={handleChange} />

      <TextField type="number" name="total_qty" label="Total Qty" value={formData.total_qty} onChange={handleChange} />

      <TextField name="action_taken" label="Action Taken" value={formData.action_taken} onChange={handleChange} multiline rows={3} sx={{ gridColumn: "span 2" }} />

      <TextField type="number" name="retro_total" label="Retro Total" value={formData.retro_total} onChange={handleChange} />
      <TextField type="number" name="retro_ok" label="Retro OK" value={formData.retro_ok} onChange={handleChange} />
      <TextField type="number" name="retro_ng" label="Retro NG" value={formData.retro_ng} onChange={handleChange} />

      <TextField type="number" name="suspected_total" label="Suspected Total" value={formData.suspected_total} onChange={handleChange} />
      <TextField type="number" name="suspected_ok" label="Suspected OK" value={formData.suspected_ok} onChange={handleChange} />
      <TextField type="number" name="suspected_ng" label="Suspected NG" value={formData.suspected_ng} onChange={handleChange} />

      <Button type="submit" variant="contained" sx={{ backgroundColor: "#154c79", gridColumn: "span 2", height: "50px", fontWeight: "bold" }}>
        Submit
      </Button>
    </Box>
  );
}

export default GL4MForm;

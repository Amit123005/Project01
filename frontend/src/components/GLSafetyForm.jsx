import React, { useState } from "react";
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";

function GLSafetyForm() {
  const categoriesData = ["date","category","detail","area","sub_area","cause","counter_measure"];
  const categoriesData2 = ["date","area","sub_area","detail","responsibility","target_date"];

  const initialData1 = categoriesData.reduce((acc, item) => { acc[item] = ""; return acc; }, {});
  const initialData2 = categoriesData2.reduce((acc, item) => { acc[item] = ""; return acc; }, {});

  const [formType, setFormType] = useState("Accident");
  const [formData, setFormData] = useState(initialData1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormType(type);
    setFormData(type === "Accident" ? initialData1 : initialData2);
    setErrors({});
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const url = "http://163.125.102.142:5000/api/glsaform";
    try {
      const response = await axios.post(url, { formType, ...formData });
      if (response.status === 200) {
        alert("Added Successfully");
        setFormData(formType === "Accident" ? initialData1 : initialData2);
        setErrors({});
      } else {
        alert("Failed for Some Reason");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting the form");
    } finally {
      setSubmitting(false);
    }
  }

  const currentFields = formType === "Accident" ? categoriesData : categoriesData2;

  const categoryOptions = ["Incident", "Near Miss", "Minor Accident", "Major Accident"];

  return (
    <Box
      width={{ xs: "90%", sm: "60%", md: "40%" }}
      mx="auto" mt="30px"
      component="form"
      display="grid"
      gap="10px"
      onSubmit={handleSubmit}
      sx={{ gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: '15px' }}
    >
      <Typography sx={{ gridColumn: "span 2", textAlign: "center", fontSize: "1.6rem", fontWeight: "bold", mb:2 }}>
        Safety Form
      </Typography>

      {/* Form Type Selector */}
      <FormControl sx={{ gridColumn: "span 2" }}>
        <InputLabel>Form Type</InputLabel>
        <Select value={formType} onChange={handleTypeChange} label="Form Type">
          <MenuItem value="Accident">Accident Occured</MenuItem>
          <MenuItem value="Safety">Safety Point Identified</MenuItem>
        </Select>
      </FormControl>

      {currentFields.map((field) => {
        if (field === "category") {
          return (
            <FormControl key={field} sx={{ gridColumn: "span 2" }} error={!!errors[field]}>
              <InputLabel>Category *</InputLabel>
              <Select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                label="Category"
              >
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
              {errors[field] && <Typography color="error" variant="caption">{errors[field]}</Typography>}
            </FormControl>
          )
        } else {
          return (
            <TextField
              key={field}
              type={field === "date" || field === "target_date" ? "date" : "text"}
              label={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) + " *"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              error={!!errors[field]}
              helperText={errors[field] || ""}
              InputLabelProps={field === "date" || field === "target_date" ? { shrink: true } : {}}
              sx={{ gridColumn: "span 2" }}
              required
            />
          )
        }
      })}

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ gridColumn: "span 2", height: "50px", fontWeight: "bold", backgroundColor: formType === "Accident" ? "#d32f2f" : "#1976d2" }}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  );
}

export default GLSafetyForm;

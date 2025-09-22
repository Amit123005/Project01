import React, { useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
 
export default function GLForm() {
  const [form, setForm] = useState({
    date: "",
    shift: "",
    safety: "",
    safetyActionPlan: "",
    lineRejectionActual: "",
    totalMaterialConsumption: "",
    startupScrap: "",
    productivityTarget: "",
    partProduction: "",
    changeoverTime: "",
    setupTime: "",
    breakdownTime: "",
    abnormalityManagement: "",
    costEnergy: "",
    costDirectMaterial: "",
    oldDhoti: "",
    handGloves: "",
    coroguard: ""
  });
 
  // Auto-calculated fields
  const lineRejectionPercent =
    form.lineRejectionActual && form.totalMaterialConsumption
      ? (
          (Number(form.lineRejectionActual) /
            Number(form.totalMaterialConsumption)) *
          100
        ).toFixed(2)
      : "";
 
  const overallRejectionPercent =
  form.startupScrap && form.lineRejectionActual && form.totalMaterialConsumption
    ? (
        (Number(form.startupScrap) + Number(form.lineRejectionActual)) /
        Number(form.totalMaterialConsumption) *
        100
      ).toFixed(2)
    : "";
 
 
  const productivityEfficiency =
    form.partProduction && form.productivityTarget
      ? (
          (Number(form.partProduction) / Number(form.productivityTarget)) *
          100
        ).toFixed(2)
      : "";
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const payload = {
      ...form,
      lineRejectionPercent,
      overallRejectionPercent,
      productivityEfficiency
    };
 
    try {
      const res = await fetch("http://163.125.102.142:5000/api/glboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
 
      if (res.ok) {
        alert("Data submitted successfully!");
        setForm({});
        window.location.reload();
      } else {
        alert("Error submitting data");
      }
    } catch (err) {
      console.error(err);
    }
  };
 
  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        GL Board Data Entry Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Date & Line */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Line</InputLabel>
              <Select
                name="shift"
                value={form.shift}
                onChange={handleChange}
                required
              >
                {[...Array(8)].map((_, index) => (
                  <MenuItem key={index + 1} value={`Line ${index + 1}`}>
                    Line {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
 
          {/* Safety & Action Plan */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Safety"
              type="number"
              name="safety"
              value={form.safety}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              multiline
              label="Safety Action Plan"
              name="safetyActionPlan"
              value={form.safetyActionPlan}
              onChange={handleChange}
              required
            />
          </Grid>
 
          {/* Line Rejection Inputs */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Line Rejection Actual(KG)"
              type="number"
              name="lineRejectionActual"
              value={form.lineRejectionActual}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Total Material Consumption(KG)"
              type="number"
              name="totalMaterialConsumption"
              value={form.totalMaterialConsumption}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Line Rejection %"
              value={lineRejectionPercent}
              InputProps={{ readOnly: true }}
              required
            />
          </Grid>
 
          {/* Startup Scrap & Overall Rejection */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Startup Scrap(KG/Setup)"
              type="number"
              name="startupScrap"
              value={form.startupScrap}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Overall Rejection %"
              value={overallRejectionPercent}
              InputProps={{ readOnly: true }}
              required
            />
          </Grid>
 
          {/* Productivity */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Productivity Target"
              type="number"
              name="productivityTarget"
              value={form.productivityTarget}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Part Production"
              type="number"
              name="partProduction"
              value={form.partProduction}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Productivity Efficiency %"
              value={productivityEfficiency}
              InputProps={{ readOnly: true }}
              required
            />
          </Grid>
 
          {/* Sub KPI */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Changeover Time"
              type="number"
              name="changeoverTime"
              value={form.changeoverTime}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Setup Time"
              type="number"
              name="setupTime"
              value={form.setupTime}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Breakdown Time"
              type="number"
              name="breakdownTime"
              value={form.breakdownTime}
              onChange={handleChange}
              required
            />
          </Grid>
 
          {/* Abnormality */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              multiline
              label="Abnormality Management"
              name="abnormalityManagement"
              value={form.abnormalityManagement}
              onChange={handleChange}
              required
            />
          </Grid>
 
          {/* Costs */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cost (Energy)"
              type="number"
              name="costEnergy"
              value={form.costEnergy}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cost (Direct Material)"
              type="number"
              name="costDirectMaterial"
              value={form.costDirectMaterial}
              onChange={handleChange}
              required
            />
          </Grid>
 
          {/* Indirect Material */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Old Dhoti Consumption"
              type="number"
              name="oldDhoti"
              value={form.oldDhoti}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Hand Gloves"
              type="number"
              name="handGloves"
              value={form.handGloves}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Coroguard (ml)"
              type="number"
              name="coroguard"
              value={form.coroguard}
              onChange={handleChange}
              required
            />
          </Grid>
 
          {/* Submit */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
 
import React, { useState } from 'react';
import axios from 'axios';
 
function BulkPlan() {
  const [file, setFile] = useState(null);
 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
 
  const uploadFile = async () => {
    if (!file) return alert("No file selected");
 
    const formData = new FormData();
    formData.append('file', file);
 
    try {
      const res = await axios.post('http://163.125.102.142:5000/api/bulk_plan', formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };
 
  return (
   
    <div style={{ marginTop: "80px" ,marginLeft:"100px"}}>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button
        onClick={uploadFile}
        style={{ marginLeft: "10px", padding: "10px 10px" }}
      >
        Upload Excel
      </button>
    </div>
  );
}
 
export default BulkPlan;
 
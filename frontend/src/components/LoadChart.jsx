import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import axios from "axios";
 
function LoadChart() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [plans, setPlans] = useState([]);
 
  useEffect(() => {
    if (!selectedDate) return;
 
    axios
      .get(`http://163.125.102.142:5000/api/seq_plans?date=${selectedDate}`)
      .then((res) => {
        const filteredPlans = res.data.filter((plan) => plan.active_time);
        setPlans(filteredPlans);
        console.log("Filtered Plans:", filteredPlans);
      })
      .catch((err) => console.error("Error fetching plans:", err));
  }, [selectedDate]);
 
  if (!plans || plans.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <label>
          Select Date:{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <p>No plans available for this date</p>
      </div>
    );
  }
 
  let chartSeries = [];
 
  plans.forEach((plan) => {
    if (plan.active_time && plan.co_end) {
      chartSeries.push({
        x: `C/O Over (Plan ${plan.sequence_no})`,
        y: [
          dayjs(plan.active_time).add(5.5, "hour").valueOf(),
          dayjs(plan.co_end).add(5.5, "hour").valueOf(),
        ],
        fillColor: "#CC9379",
      });
    }
 
    if (plan.active_time && plan.duration) {
      const targetStart = dayjs(plan.co_end).add(5.5, "hour");
      const targetEnd = targetStart.add(plan.duration, "minute");
 
      chartSeries.push({
        x: `Target (Plan ${plan.sequence_no})`,
        y: [targetStart.valueOf(), targetEnd.valueOf()],
        fillColor: "#2ECC71",
      });
    }
 
    const planStart = plan.co_end
      ? dayjs(plan.co_end).add(5.5, "hour")
      : dayjs(plan.start).add(5.5, "hour");
 
    const planEnd = plan.complete_time
      ? dayjs(plan.complete_time).add(5.5, "hour")
      : dayjs().add(5.5, "hour");
 
    chartSeries.push({
      x: `Actual (Plan ${plan.sequence_no} - ${plan.model} - ${plan.partno})`,
      y: [planStart.valueOf(), planEnd.valueOf()],
      fillColor: plan.status === "Active" ? "#1E90FF" : "#FF7F7F",
    });
  });
 
  const options = {
    chart: { type: "rangeBar", toolbar: { show: true } },
    plotOptions: { bar: { horizontal: true, barHeight: "50%" } },
    xaxis: {
  type: "datetime",
  labels: {
    style: {
      fontWeight: "bold",
      fontSize:"20px"   // 🔥 bold X-axis labels
    },
  },
},
yaxis: {
    labels: {
      style: {
        fontWeight: "bold",
        fontSize: "14px", // 🔥 bold + 20px Y-axis
      },
    },
  },
dataLabels: {
  enabled: true,
  formatter: (_, opts) => chartSeries[opts.dataPointIndex].x,
  style: {
    fontWeight: "bold",
    fontSize:"20px"   // 🔥 bold data labels
  },
},
tooltip: {
  x: {
    format: "HH:mm",
  },
  style: {
    fontWeight: "bold",   // 🔥 bold tooltip text
  },
},
colors: chartSeries.map((s) => s.fillColor),
 
  };
 
  return (
    <div style={{ padding: "10px", position: "relative" }}>
      <label style={{ fontSize: "22px", fontWeight: "bold" }}>
  Select Date:{" "}
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    style={{ fontSize: "22px", padding: "4px 8px" }} // bigger input text
  />
</label>
 
<h2 style={{ textAlign: "center", fontSize: "35px", fontWeight: "bold", marginTop: "20px" }}>
  Daily Load Chart
</h2>
 
 
      {/* ✅ Custom Legend on right top */}
      <div
        style={{
    position: "absolute",
    bottom: "-20px",   // moved to bottom
    right: "35%",   // adjust as needed
    background: "#fff",
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    fontSize: "18px",
    fontWeight:"bold",
    display: "flex",
    flexDirection: "row",   // 🔥 horizontal layout
    gap: "16px",            // space between legend items
    alignItems: "center",
  }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ width: 15, height: 15, background: "#CC9379", display: "inline-block", marginRight: 6 }}></span>
          C/O(Changeover)
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ width: 15, height: 15, background: "#2ECC71", display: "inline-block", marginRight: 6 }}></span>
          Target
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ width: 15, height: 15, background: "#1E90FF", display: "inline-block", marginRight: 6 }}></span>
          Actual (Active)
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ width: 15, height: 15, background: "#FF7F7F", display: "inline-block", marginRight: 6 }}></span>
          Actual (Completed)
        </div>
      </div>
 
      <Chart
        options={options}
        series={[{ data: chartSeries }]}
        type="rangeBar"
        height={1000}
      />
    </div>
  );
}
 
export default LoadChart;
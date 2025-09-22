import React, { useEffect, useState } from "react";

const DowntimeIndicator = () => {
  const [downtimeActive, setDowntimeActive] = useState(false);
  const [downtimeSince, setDowntimeSince] = useState("");

  useEffect(() => {
    const fetchDowntime = async () => {
      try {
        const response = await fetch("http://163.125.102.142:5000/api/downtime_status");
        const data = await response.json();
        if (data.downtime_active) {
          setDowntimeActive(true);
          setDowntimeSince(data.downtime_since);
        } else {
          setDowntimeActive(false);
        }
      } catch (error) {
        console.error("Error fetching downtime:", error);
      }
    };

    fetchDowntime();
    const interval = setInterval(fetchDowntime, 5000); // Refresh every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (!downtimeActive) return null; // Hide when no downtime

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h3 style={styles.text}>Downtime Active Since</h3>
        <p style={styles.time}>{downtimeSince}</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: "2%",
    right: "45%",
    zIndex: 9999, // Ensures it is above everything
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "160px",
    height: "160px",
    backgroundColor: "rgba(255, 0, 0, 0.8)", // Semi-transparent red
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
    boxShadow: "0px 0px 20px rgba(255, 0, 0, 0.5)", // Soft glow effect
    animation: "blink 1s infinite", // Blinking effect
    transition: "transform 0.3s ease-in-out",
  },
  text: {
    margin: "0",
    padding: "5px",
  },
  time: {
    fontSize: "18px",
  },
};

export default DowntimeIndicator;

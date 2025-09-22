import React, { useEffect, useState } from "react";

export default function PokaYokeStatusTable() {
  const [inputs, setInputs] = useState([]);
  const [holding139, setHolding139] = useState(null);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("http://163.125.102.142:5000/api/pokayoke_status");
      const data = await res.json();
      if (res.ok) {
        console.log(`Data ksdkn : `, data);
        
        setInputs(data.inputs || []);
        setHolding139(data.holding_139);
      } else {
        setError(data.error || "Error fetching data");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const nameMapping = {
    139: "Extrusion Main Die",
    0: "Cooling Trough",
    2: "Laser Printing",
    1: "Plasma Machine",
  };

  const orderedAddresses = [139, 0, 2, 1];

  const newData = orderedAddresses
    .map((addr) => {
      if (addr === 139) return { address: 139, status: holding139 === 0 }; 
      return inputs.find((i) => i.address === addr);
    })
    .filter(Boolean);

  return (
    <>
      <style>
        {`
          @keyframes blinkRed {
            0% { color: red; }
            50% { color: transparent; }
            100% { color: red; }
          }
          .blink-red {
            animation: blinkRed 1s infinite;
            font-weight: bold;
          }
        `}
      </style>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Live Poka-Yoke Status
      </h2>

      <table border="1" cellPadding="6" style={{ width: "100%", margin: "auto", textAlign: "center" }}>
        <thead>
          <tr>
            {newData.map((input) => (
              <th key={input.address}>{nameMapping[input.address]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {newData.map((input) => (
              <td key={input.address}>
                {input.status ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>OK ✅</span>
                ) : (
                  <span className="blink-red">Not OK ❌</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

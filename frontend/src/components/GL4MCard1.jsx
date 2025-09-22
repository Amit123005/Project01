// src/components/FourMCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function FourMCard({ chartData, title, color }) {
  const count = chartData ? chartData.length : 0;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "10px",
        background: color || "linear-gradient(135deg, #0a69a1, #4ea7d8)",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          p: 2,
        }}
      >
        {/* Title at the Top */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 2, opacity: 0.9, marginTop : 2 }}
        >
          {title || "Total 4M Changes"}
        </Typography>

        {/* Count in the Middle */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: "normal", lineHeight: 1.2 }}
          >
            {count}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

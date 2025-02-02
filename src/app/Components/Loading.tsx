import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function loading() {
  return (
    <Box className="flex items-center justify-center h-screen p-4 text-center text-blue-500">
      <CircularProgress />
    </Box>
  );
}

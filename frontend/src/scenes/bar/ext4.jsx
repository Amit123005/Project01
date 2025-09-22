import { Box } from "@mui/material";
import Header from "../../components/header";
import Extruder4 from "../../components/ext4";

const ext4 = () => {
  return (
    <Box m="20px">
      <Header title="Extruder4" />
      <Box height="75vh">
        <Extruder4 />
      </Box>
    </Box>
  );
};

export default ext4;

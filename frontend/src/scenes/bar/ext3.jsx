import { Box } from "@mui/material";
import Header from "../../components/header";
import Extruder3 from "../../components/ext3";

const ext3 = () => {
  return (
    <Box m="20px">
      <Header title="Extruder3" />
      <Box height="75vh">
        <Extruder3 />
      </Box>
    </Box>
  );
};

export default ext3;

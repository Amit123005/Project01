import { Box } from "@mui/material";
import Header from "../../components/header";
import Extruder2 from "../../components/ext2";

const ext2 = () => {
  return (
    <Box m="20px">
      <Header title="Extruder2" />
      <Box height="75vh">
        <Extruder2 />
      </Box>
    </Box>
  );
};

export default ext2;

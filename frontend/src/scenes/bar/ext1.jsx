import { Box } from "@mui/material";
import Header from "../../components/header";
import Extruder1 from "../../components/ext1";

const ext1 = () => {
  return (
    <Box m="20px">
      <Header title="Extruder1" />
      <Box height="75vh">
        <Extruder1 />
      </Box>
    </Box>
  );
};

export default ext1;

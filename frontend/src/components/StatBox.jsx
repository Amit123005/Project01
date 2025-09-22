import { Box, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100], textAlign: "center"  }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
        <Box display="flex" justifyContent="center" mt="20px">
          <Typography variant="h6" sx={{ color: colors.grey[200] }}>
            {subtitle}
          </Typography>
        </Box>
    </Box>
  );
};

export default StatBox;

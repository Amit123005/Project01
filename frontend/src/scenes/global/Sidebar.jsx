import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DatasetIcon from '@mui/icons-material/Dataset';
import { useAuth } from '../../context/AuthProvider';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [selected, setSelected] = React.useState("Dashboard");
  
  // Use the auth context to get the current user's access level
  const { accessLevel, department, userId, name, email, username  } = useAuth();
  const isAdmin = accessLevel === "Admin";

  return (
    <Box
      sx={{
        height: '100%',
        position: 'fixed',
        zIndex: 3000,
        transition: "all 0.3s ease", // Smooth transition for collapse/expand
        "& .pro-sidebar-inner": {
          background: `#283953 !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: '#EBEFFA',
        },
        "& .pro-inner-item:hover": {
          color: "#617180 !important",
        },
        "& .pro-menu-item.active": {
          color: "black !important",
        },
      }}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
    >
      <ProSidebar 
        collapsed={isCollapsed} 
        style={{
          width: isCollapsed ? "80px" : "200px",
          // transition: "width 0.3s ease-in-out",
          // overflow: "hidden",
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={<img src="./assets/sidebar.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
            style={{
              margin: "10px 0 20px 0",
              color: 'white',
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color='#EBEFFA'>
                  Taskbar
                </Typography>
                
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="5px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="120px"
                  height="140px"
                  src={`../../assets/omlogo.png`}
                  style={{ cursor: "pointer", borderRadius: "0%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color='#d6c529'
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Operator मित्र
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]} mt="10px">
                  PPAP Automotive Ltd
                </Typography>
              </Box>
            </Box>
          )}
          
          <Menu 
          iconShape="circle"
          style={{
            marginTop: '50px',        // Top margin for the whole menu
            display: 'flex',
            flexDirection: 'column',
            gap: '100px',              // Vertical spacing between SubMenus
          }}>
          {department !== 'PPC' && (
          <SubMenu title="Dashboards" icon={<SpaceDashboardIcon sx={{ fontSize: isCollapsed ?35 : 20 }}/>} style={{ marginBottom: '20px' }}>
            <MenuItem onClick={() => navigate('/')}>Production Dashboard</MenuItem>
            <MenuItem onClick={() => navigate('/dbdef')}>Process Parameters</MenuItem>
            <MenuItem onClick={() => navigate('/gldash2')}>GL Dashboard</MenuItem>
            <MenuItem onClick={() => navigate('/gl4mdash')}>4M Dashboard</MenuItem>
          </SubMenu>
          )}

          {/* {['admin', 'superadmin'].includes(accessLevel.toLowerCase()) && ( */}
          {accessLevel === 'Admin' && (
          <SubMenu title="Digital Twin" icon={<PersonIcon sx={{ fontSize: isCollapsed ?35 : 20 }}/>} style={{ marginBottom: '20px' }}>
            <MenuItem onClick={() => navigate('/users')}>User Mapping</MenuItem>
            {/* <MenuItem onClick={() => navigate('/digital-twin/simulation')}>Simulation</MenuItem> */}
          </SubMenu>
          )}

          <SubMenu title="Master" icon={<DatasetIcon sx={{ fontSize: isCollapsed ?35 : 20 }}/>} style={{ marginBottom: '20px' }}>
            {department !== 'PPC' && (
              <MenuItem onClick={() => navigate('/site')}>Site Mapping</MenuItem>
            )}
            {department !== 'PPC' && (
            <MenuItem onClick={() => navigate('/master')}>Target Sheet</MenuItem>
            )}
            {department !== 'PPC' && (accessLevel==='Admin' || accessLevel==='Super_admin') &&(
            <MenuItem onClick={() => navigate('/change')}>4M Change Sheet</MenuItem>
            )}
            <MenuItem onClick={() => navigate('/plans')}>Planning Sheet</MenuItem>
           <MenuItem onClick={() => navigate('/pab')}>PAB Board</MenuItem>
            <MenuItem onClick={() => navigate('/glform2')}>GL Form</MenuItem>
            <MenuItem onClick={() => navigate('/glsaform')}>GL Safety Form</MenuItem>
            <MenuItem onClick={() => navigate('/glqaform')}>Quality Action Points Form</MenuItem>
            <MenuItem onClick={() => navigate('/gl4mform')}>Four M Change Form</MenuItem>
            {/* <MenuItem onClick={() => navigate('/digital-twin/simulation')}>Simulation</MenuItem> */}
          </SubMenu>
          
          {department !== 'PPC' && (
          <SubMenu title="Reports" icon={<AssessmentIcon sx={{ fontSize: isCollapsed ?35 : 20 }}/>} style={{ marginBottom: '20px' }}>
            <MenuItem onClick={() => navigate('/test')}>Production Report</MenuItem>
            {['Production', 'All'].includes(department) && (
            <MenuItem onClick={() => navigate('/downtime')}>Downtime Report</MenuItem>
            )}
            <MenuItem onClick={() => navigate('/usdt')}>Downtime Reason</MenuItem>
            <MenuItem onClick={() => navigate('/gltab')}>GL Table</MenuItem>
            <MenuItem onClick={() => navigate('/glpt')}>GL Safety Points</MenuItem>
            <MenuItem onClick={() => navigate('/glqapt')}>Quality Action Points</MenuItem>
            <MenuItem onClick={() => navigate('/gl4mpt')}>4M Change Table</MenuItem>
          </SubMenu>
          )}
        </Menu>
          {/* <Box
            paddingLeft={isCollapsed ? undefined : "10%"}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: !isCollapsed ? "20px" : "50px"
            }}
          >
          {!isCollapsed && (
            <Typography
              variant="h5"
              color='#EBEFFA'
              sx={{ m:  "15px 0 5px 20px" }}
            >
              Dashboards
            </Typography>
          )}
            {isAdmin && (
              <Item
                title="Production Monitoring"
                to="/"
                icon={<img src="./assets/oeeicon.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
                selected={selected}
                setSelected={setSelected}
                sx={{ mb: isCollapsed ? '10px': '4px' , mt: '200px'}}
              />
            )}
            <Item
              title="Process Quality"
              to="/dbdef"
              icon={<img src="./assets/processicon.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
              selected={selected}
              setSelected={setSelected}
            />

            {!isCollapsed && (
            <Typography
              variant="h5"
              color='#EBEFFA'
              sx={{ m: "15px 0 5px 20px" }}
            >
              Planning
            </Typography>
            )}
            <Item
              title="Production Plans"
              to="/plans"
              icon={<img src="./assets/plan.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
              selected={selected}
              setSelected={setSelected}
            />
            {!isCollapsed && (
            <Typography
              variant="h5"
              color='#EBEFFA'
              sx={{ m: "15px 0 5px 20px" }}
            >
              Reports
            </Typography>
            )}
            <Item
              title="Production Report"
              to="/test"
              icon={<img src="./assets/report.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Target Sheet"
              to="/master"
              icon={<img src="./assets/report.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Downtimes Report"
              to="/downtimerep"
              icon={<img src="./assets/downtime.png" alt="icon" style={{ width: isCollapsed ? '40px' : '25px', height: 'auto' }} />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box> */}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

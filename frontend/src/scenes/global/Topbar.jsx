import { Box,useTheme,IconButton,Menu,MenuItem,Typography,Divider,Badge } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/NotificationContext";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { accessLevel, department, userId, name, email, username } = useAuth();
  const isAdmin = accessLevel === "Admin";
  const isProd = department === "Production";
  const { showNotification } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);
 
  const fetchNotifications = () => {
    setLoading(true);
    axios
      .get(`http://163.125.102.142:5000/api/notifications?user_id=${userId}`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        showNotification("Failed to fetch notifications", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };
 
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };
 
  const handleNotificationItemClick = async (notification) => {
    const relatedModule = notification.related_module?.toLowerCase();
    const mould_id = notification.mould_id;
    const related_id = notification.related_id?.toString().toLowerCase();
    console.log(relatedModule,mould_id,related_id);
    
 
    // Mark notification as read
    try {
      await axios.patch(
        `http://163.125.102.142:5000/api/notifications/${notification.id}/read`
      );
 
      // Update notification state locally
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      showNotification("Failed to mark notification as read", "error");
    }
 
    // Navigate to related page
    if (relatedModule === "preventive maintenance") {
      navigate("/pmupdate");
    } else if (["downtime", "downtime log"].includes(relatedModule)) {
      navigate(isProd ? "/downtime" : "/usdt");
      // navigate(isProd ? "/downtime" : "/usdt");
    }
    else if (relatedModule === 'thmsqa') {
      navigate(`/thmsques1?mould_id=${mould_id}&thmsid=${related_id}`)
    }
    else if (relatedModule === "thmsprd") {
      navigate(`/thmsques3?mould_id=${mould_id}&thmsid=${related_id}` );
    }
    else if (relatedModule === "thmsmaint") {
      navigate(`/thmsques2?mould_id=${mould_id}&thmsid=${related_id}` );
    }
    else if (relatedModule === "thmsmm") {
      navigate("/thmsupdate" );
    }
    else if (relatedModule === "thmsqa2") {
      navigate("/thmsupdate" );
    }
    else if (relatedModule === "thmsprd2") {
      navigate("/thmsupdate" );
    }
    else if (relatedModule === "thmsmaint2") {
      navigate("/thmsupdate" );
    }
    
 
    setAnchorEl(null); // Close the menu
  };

  

  
 
  const handleCloseNotificationMenu = () => {
    setAnchorEl(null);
  };
 
  const handleUserClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };
 
  const handleCloseMenus = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data
    localStorage.removeItem("authToken"); // Example: Remove auth token from local storage
    // Add any other necessary cleanup here

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{background:"#ebeffa"}}>
      {/* Left section */}
      <Box display="flex" borderRadius="3px"></Box>
      
            {/* Right section - Icons */}
      <Box display="flex" mr="15px">
        <IconButton onClick={() => navigate("/")}>
          <HomeOutlinedIcon />
        </IconButton>
        
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (<DarkModeOutlinedIcon />) : (<LightModeOutlinedIcon />)}
        </IconButton>
        
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={notifications.filter((n) => !n.is_read).length} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
          {/* Notification Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseNotificationMenu} >
            {loading ? (<MenuItem><Typography>Loading...</Typography></MenuItem>) : notifications.length > 0 
              ? 
              (notifications.map((notification, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleNotificationItemClick(notification)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    backgroundColor: notification.is_read ? "white" : "#f0f0f0",
                  }}
                >
                  <Typography fontWeight={notification.is_read ? "normal" : "bold"}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {new Date(notification.created_at).toUTCString()}
                  </Typography>
                </MenuItem>
              ))) 
              : 
              (<MenuItem>
                <Typography>No notifications</Typography>
              </MenuItem>
              )
            }
          </Menu>
        <IconButton onClick={handleUserClick}>
          <PersonOutlinedIcon />
        </IconButton>
          {/* User Menu */}       
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseMenus}
            PaperProps={{
              sx: {
                minWidth: 240,
                borderRadius: 2,
                boxShadow: 3,
                p: 1,
              },
            }}
          >
            <Box px={2} py={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Name:
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {name}
              </Typography>
              
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Username:
              </Typography>
              <Typography variant="body2" gutterBottom>
                {username}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Email:
              </Typography>
              <Typography variant="body2">{email}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Menu>
        
        <IconButton onClick={handleLogout}>
          <PowerSettingsNewIcon />
        </IconButton>
    </Box>
</Box>
  );
};
 
export default Topbar;

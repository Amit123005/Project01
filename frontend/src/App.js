import React from 'react';
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthProvider';
import Dashboard from "./scenes/dashboard";
import Dashboard2 from "./scenes/PMS Dashboard";
import Dashboard3 from "./scenes/Test Dashboard";
import LoginPage from "./components/login";
import Team from "./scenes/team";
import Prod_report from "./scenes/contacts";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import Extruder1 from "./components/ext1";
import Extruder2 from "./components/ext2";
import Extruder3 from "./components/ext3";
import Extruder4 from "./components/ext4";
import PMS_Table from "./components/pms_table";
import OEE_Chart from "./components/oee_chart";
import Bar from "./scenes/bar";
import FAQ from "./scenes/faq";
import Prod_report2 from "./scenes/contacts/prod_report2";
import Prod_plans from "./scenes/contacts/prod_plans";
import Downtimerep from "./scenes/contacts/downtimerep";
import VoiceChat from './components/ollama';
import Prod_plansHMI from './scenes/contacts/prod_plansHMI';
import Extruder1_test from './components/ext1_test';
import DowntimeIndicator from './components/downtime_indicator';
import Chatbot from './components/chatbot';
import BulkPlan from './components/BulkPlan';
import TargetSheet from './scenes/contacts/target_sheet';
import Workflow from './FormBuilder/Workflow';
import FormQuestions from './FormBuilder/Form';
import { NotificationProvider } from './components/NotificationContext';
import DigitalTwin from './scenes/contacts/DigitalTwin';
import DowntimeLogTable from './components/DowntimeLogTable';
import DowntimeLogTableUser from './components/DowntimeLogTableUser';
import FourMChange from './scenes/contacts/4MChangeTable';
import SiteMap from './scenes/contacts/site_map';
import PokaYokeStatusTable from './components/poka-yoke';
import GLDash from './scenes/dashboard/GLDash';
import GLPointsMgmt from './components/GLPointsMgmt';
import GLForm from './components/GLForm';
import GLForm2 from './components/GLForm2';
import GLDash2 from './scenes/dashboard/GLDash2';
import GLSafetyForm from './components/GLSafetyForm';
import GLDash3 from './scenes/dashboard/GLDash3';
import GLQualForm from './components/GLQualityForm';
import GLQAPoints from './components/GLQAPoints';
import GL4MForm from './components/GL4MForm';
import GL4MPoints from './components/GLfourmPoints';
import GL4MDash from './scenes/dashboard/GL4MDash';
import GLTable from './components/GLTable';
import PABBoard from './components/PABBoard';
import Dashboard4 from './scenes/Test Dashboard/index2';
import DBDEF3 from './scenes/dashboard/index3';
import LoadChart from './components/LoadChart';

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === '/login';
  const isPlansHMIPage = location.pathname === '/plansHMI';
  const isGldash = location.pathname === '/gldash2';
  const isGl4mdash = location.pathname === '/gl4mdash';
  const isPAB = location.pathname === '/pab';
  const isDB4 = location.pathname === '/db4';
  const isDBDEF2 = location.pathname === '/dbdef2';
  const isLC = location.pathname === '/lc';

  if (loading) {
    
    return <div>Loading...</div>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Conditionally render Sidebar and Topbar based on route */}
          {!isLoginPage && !isPlansHMIPage && !isGldash && !isGl4mdash && !isPAB && !isDB4 && !isDBDEF2 && !isLC && <Sidebar />}
          <main className="content">
          <NotificationProvider>
            {!isLoginPage && !isPlansHMIPage && <Topbar />}
            <Routes>
              {/* Redirect from root to login if not authenticated */}
              <Route path="/" element={<Navigate to={isAuthenticated ? "/db3" : "/login"} />} />
              <Route path="/db4" element={<Dashboard4 />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Protected routes */}
              <Route path="/dbdef" element={<Dashboard />} />
              <Route path="/dbdef2" element={<DBDEF3 />} />
              <Route path="/team" element={isAuthenticated ? <Team /> : <Navigate to="/login" />} />
              <Route path="/contacts" element={isAuthenticated ? <Prod_report /> : <Navigate to="/login" />} />
              <Route path="/invoices" element={isAuthenticated ? <Invoices /> : <Navigate to="/login" />} />
              <Route path="/form" element={isAuthenticated ? <Form /> : <Navigate to="/login" />} />
              <Route path="/bar" element={isAuthenticated ? <Bar /> : <Navigate to="/login" />} />
              <Route path="/ext1" element={<Extruder1 />} />
              <Route path="/ext1test" element={<Extruder1_test />} />
              <Route path="/ext2" element={<Extruder2 />} />
              <Route path="/ext3" element={<Extruder3 />} />
              <Route path="/ext4" element={<Extruder4 />} />
              <Route path="/db2" element={isAuthenticated ? <Dashboard2 /> : <Navigate to="/login" />} />
              <Route path="/db3" element={isAuthenticated ? <Dashboard3 /> : <Navigate to="/login" />} />
              <Route path="/pms_table" element={isAuthenticated ? <PMS_Table /> : <Navigate to="/login" />} />
              <Route path="/oee_chart" element={isAuthenticated ? <OEE_Chart /> : <Navigate to="/login" />} />
              <Route path="/test" element={isAuthenticated ? <Prod_report2 /> : <Navigate to="/login" />} />
              <Route path="/master" element={isAuthenticated ? <TargetSheet /> : <Navigate to="/login" />} />
              <Route path="/site" element={isAuthenticated ? <SiteMap /> : <Navigate to="/login" />} />
              <Route path="/change" element={isAuthenticated ? <FourMChange /> : <Navigate to="/login" />} />
              <Route path="/plans" element={isAuthenticated ? <Prod_plans /> : <Navigate to="/login" />} />
              <Route path="/plansHMI" element={<Prod_plansHMI />} />
              <Route path="/downtimerep" element={isAuthenticated ? <Downtimerep /> : <Navigate to="/login" />} />
              <Route path="/chat" element={isAuthenticated ? <Chatbot /> : <Navigate to="/login" />} />
              <Route path="/downtimeduration" element={isAuthenticated ? <DowntimeIndicator /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dbdef" : "/login"} />} />
              <Route path="/bulk_plan" element={isAuthenticated ? <BulkPlan /> : <Navigate to="/login" />} />
              <Route path="/workflow" element={isAuthenticated ? <Workflow /> : <Navigate to="/login" />} />
              <Route path="/forms" element={isAuthenticated ? <FormQuestions /> : <Navigate to="/login" />} />
              <Route path="/Users" element={isAuthenticated ? <DigitalTwin /> : <Navigate to="/login" />} />
              <Route path="/downtime" element={isAuthenticated ? <DowntimeLogTable /> : <Navigate to="/login" />} />
              <Route path="/usdt" element={isAuthenticated ? <DowntimeLogTableUser /> : <Navigate to="/login" />} />
              <Route path="/py" element={isAuthenticated ? <PokaYokeStatusTable /> : <Navigate to="/login" />} />
              <Route path="/gldash" element={isAuthenticated ? <GLDash /> : <Navigate to="/login" />} />
              <Route path="/gldash2" element={<GLDash2 />} />
              <Route path="/gldash3" element={isAuthenticated ? <GLDash3 /> : <Navigate to="/login" />} />
              <Route path="/glpt" element={isAuthenticated ? <GLPointsMgmt /> : <Navigate to="/login" />} />
              <Route path="/glqapt" element={isAuthenticated ? <GLQAPoints /> : <Navigate to="/login" />} />
              <Route path="/glform" element={isAuthenticated ? <GLForm /> : <Navigate to="/login" />} />
              <Route path="/glqaform" element={isAuthenticated ? <GLQualForm /> : <Navigate to="/login" />} />
              <Route path="/glform2" element={isAuthenticated ? <GLForm2 /> : <Navigate to="/login" />} />
              <Route path="/glsaform" element={isAuthenticated ? <GLSafetyForm /> : <Navigate to="/login" />} />
              <Route path="/gl4mform" element={isAuthenticated ? <GL4MForm /> : <Navigate to="/login" />} />
              <Route path="/gl4mpt" element={isAuthenticated ? <GL4MPoints /> : <Navigate to="/login" />} />
              <Route path="/gl4mdash" element={<GL4MDash />} />
              <Route path="/gltab" element={isAuthenticated ? <GLTable /> : <Navigate to="/login" />} />
              <Route path="/pab" element={<PABBoard />} />
              <Route path="/lc" element={<LoadChart />} />
            </Routes>
            </NotificationProvider>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

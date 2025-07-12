import { BrowserRouter as Router, Routes, Route, Link , useLocation } from "react-router-dom";
import LoginClient from "./components/loginclient";
import LoginDelivery from "./components/loginpartner";
import ClientDashboard from "./components/clientDashboard";
import PartnerDashboard from "./components/partnerDashboard";
import JobStatus from "./components/jobstatus";
import Home from "./components/Home";
import SignUpClient from "./components/SignUpClient";      // Import client sign-up
import SignUpDelivery from "./components/SignUPDelivery";  // Import partner sign-up

function App() {
  const Navigation = () => {
    const location = useLocation();
    // Define the paths where you want to hide the nav
    const hideNavPaths = ["/","/client-dashboard", "/partner-dashboard","/client-login","/delivery-login","/job-status", "/client-signup",
      "/delivery-signup"];
  
    // Only render nav if the current path is not one of the dashboard paths
    if (hideNavPaths.includes(location.pathname)) {
      return null;
    }
  
    return (
      <nav>
        <ul>
          <li>
            <Link to="/client-login">Client Login</Link>
          </li>
          <li>
            <Link to="/delivery-login">Delivery Partner Login</Link>
          </li>
        </ul>
      </nav>
    );
  };
  
 

  return (
    <>
       <Router>
      <Navigation/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client-login" element={<LoginClient />} />
          <Route path="/delivery-login" element={<LoginDelivery />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/job-status" element={<JobStatus />} />
          <Route path="/client-signup" element={<SignUpClient />} />       
          <Route path="/delivery-signup" element={<SignUpDelivery />} /> 
        </Routes>
    </Router>
    </>
  )
}

export default App
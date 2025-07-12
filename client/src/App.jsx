import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import LoginClient from "./components/loginclient";
import LoginDelivery from "./components/loginpartner";
import ClientDashboard from "./components/clientDashboard";
import PartnerDashboard from "./components/partnerDashboard";
import JobStatus from "./components/jobstatus";
import Home from "./components/Home";
import SignUpClient from "./components/SignUpClient";
import SignUpDelivery from "./components/SignUpDelivery";
import CompanySignup from "./components/CompanySignup";
import CompanyLogin from "./components/companyLogin";
import CompanyDashboard from "./components/CompanyDashboard"
import CompanyVerifyDelivery from "./components/CompanyVerifyDelivery";

function App() {
  const Navigation = () => {
    const location = useLocation();
    // Update hideNavPaths to include company-related paths
    const hideNavPaths = [
      "/",
      "/client-dashboard",
      "/partner-dashboard",
      "/client-login",
      "/delivery-login",
      "/job-status",
      "/client-signup",
      "/delivery-signup",
      "/company-signup",
      "/company-login",
      "/company-dashboard",
      "/company-verify-delivery",
    ];

    // Only render nav if the current path is not one of the hideNavPaths
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
          <li>
            <Link to="/company-login">Company Login</Link>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client-login" element={<LoginClient />} />
        <Route path="/delivery-login" element={<LoginDelivery />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/job-status" element={<JobStatus />} />
        <Route path="/client-signup" element={<SignUpClient />} />
        <Route path="/delivery-signup" element={<SignUpDelivery />} />
        <Route path="/company-signup" element={<CompanySignup />} />
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company-verify-delivery" element={<CompanyVerifyDelivery />} />
      </Routes>
    </Router>
  );
}

export default App;
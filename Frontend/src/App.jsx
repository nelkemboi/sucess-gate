import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Browse from "./Browse";
import Students from "./Students";
import Balance from "./Balance";
import StudentDashboard from "./StudentDashboard";
import StudentBody from "./StudentBody";
import CreateProject from "./CreateProject";
import WriterSignUp from "./WriterSignUp";
import UserSignUp from "./UserSignUp";
import WriterSearch from "./WriterSearch"; // Ensure this is imported
import StudentPay from "./StudentPay"; // Import the PaymentPage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Root landing page */}
        <Route path="/" element={<Landing />} />

        {/* App-specific routes */}
        <Route path="/app" element={<Navigation />}>
          <Route index element={<Dashboard />} /> {/* Default child route */}
          <Route path="browse" element={<Browse />} />
          <Route path="students" element={<Students />} />
          <Route path="balance" element={<Balance />} />
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        {/* StudentBody route */}
        <Route path="/StudentBody" element={<StudentBody />} />

        {/* Independent CreateProject route */}
        <Route path="/CreateProject" element={<CreateProject />} />

        {/* Independent WriterSearch route */}
        <Route path="/WriterSearch/:projectId" element={<WriterSearch />} />

        {/* Payment page route */}
        <Route path="/payment/:projectId/:writerId" element={<StudentPay />} />

        {/* Independent routes */}
        <Route path="/app/writer-signup" element={<WriterSignUp />} />
        <Route path="/app/user-signup" element={<UserSignUp />} />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

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

        {/* Independent routes */}
        <Route path="/app/writer-signup" element={<WriterSignUp />} />
        <Route path="/app/user-signup" element={<UserSignUp />} />
        <Route path="/app/createproject" element={<CreateProject />} />
        <Route path="studentBody" element={<StudentBody />} />
        

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLanding from "./AdminLanding";
import AdminDashboard from "./AdminDashboard";
import WriterApplications from "./WriterApplication";
import WriterIssues from "./WriterIssues";
import StudentIssues from "./StudentIssue";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLanding />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route path="writer-applications" element={<WriterApplications />} />
          <Route path="writer-issues" element={<WriterIssues />} />
          <Route path="student-issues" element={<StudentIssues />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

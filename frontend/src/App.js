import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Jobs from "./Jobs";
import ProtectedRoute from "./ProtectedRoute";
import MyApplications from "./MyApplications";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/jobs">Jobs</Link>
        <Link to="/applications">My Applications</Link>
        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        } />

        <Route path="/applications" element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
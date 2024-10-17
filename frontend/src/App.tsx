import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

import "react-toastify/dist/ReactToastify.css";
import CreateProject from "./pages/CreateProject";
import AssignUserToProject from "./pages/AssignUserToProject";
import Project from "./pages/Project";
import AssignIssueToProject from "./pages/AssignIssueToProject";
import Board from "./pages/Board";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <Project />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/board"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/create"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/issue/create/:id"
          element={
            <ProtectedRoute>
              <AssignIssueToProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/assign/:id"
          element={
            <ProtectedRoute>
              <AssignUserToProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;

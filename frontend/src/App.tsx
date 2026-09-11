import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import Upload from "./pages/Upload";
import Scheduled from "./pages/Scheduled";
import Sent from "./pages/Sent";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  if (location.pathname === "/login") {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="px-4 pb-10 pt-6 lg:px-8 xl:px-10">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/scheduled" element={<ProtectedRoute><Scheduled /></ProtectedRoute>} />
              <Route path="/sent" element={<ProtectedRoute><Sent /></ProtectedRoute>} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
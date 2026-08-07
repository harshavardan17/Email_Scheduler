import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import Upload from "./pages/Upload";
import Scheduled from "./pages/Scheduled";
import Sent from "./pages/Sent";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="lg:flex lg:min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <main className="px-4 pb-10 pt-6 lg:px-8 xl:px-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/compose" element={<Compose />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/scheduled" element={<Scheduled />} />
                <Route path="/sent" element={<Sent />} />
                <Route path="*" element={<Navigate replace to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
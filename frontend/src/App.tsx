import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/sections/Hero';
import { Events } from '@/sections/Events';
import { Clubs } from '@/sections/Clubs';
import { Hackathons } from '@/sections/Hackathons';
import { RegistrationCTA } from '@/sections/RegistrationCTA';
import { Footer } from '@/sections/Footer';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { StudentDashboard } from '@/pages/StudentDashboard';
import './App.css';

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Events />
        <Clubs />
        <Hackathons />
        <RegistrationCTA />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

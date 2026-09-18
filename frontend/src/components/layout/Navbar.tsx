import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, User, LogOut, Shield, LayoutDashboard, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#events', label: 'Events' },
    { href: '#clubs', label: 'Clubs' },
    { href: '#hackathons', label: 'Hackathons' },
    { href: '#register', label: 'Register' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2 px-4 md:px-8' : 'py-4 px-4 md:px-8'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 ${
          isScrolled
            ? 'bg-[#1A1A1A]/90 backdrop-blur-xl rounded-full px-6 py-2 shadow-2xl border border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isScrolled ? 'bg-[#CDFF00]' : 'bg-white/10 backdrop-blur-sm'
            }`}>
              <GraduationCap className={`w-5 h-5 transition-colors ${isScrolled ? 'text-[#1A1A1A]' : 'text-[#CDFF00]'}`} />
            </div>
            <span className={`font-bold text-lg transition-colors ${
              isScrolled ? 'text-white' : 'text-white'
            }`}>
              SRM Events
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                  isScrolled ? 'text-white/70 hover:text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#CDFF00] group-hover:w-1/2 transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* Theme Toggle + CTA / User */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all group"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <Sun className={`w-4 h-4 absolute transition-all duration-300 ${theme === 'light' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-yellow-400'}`} />
              <Moon className={`w-4 h-4 absolute transition-all duration-300 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100 text-white/80' : 'opacity-0 -rotate-90 scale-0'}`} />
            </button>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Button size="sm" className="bg-[#CDFF00] text-[#1A1A1A] hover:bg-[#B8E600] rounded-full font-semibold" asChild>
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-1.5" />
                      Admin Panel
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" className={`rounded-full font-medium ${
                    isScrolled ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`} asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isScrolled ? 'bg-white/10' : 'bg-white/10'
                }`}>
                  <div className="w-6 h-6 rounded-full bg-[#CDFF00] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  </div>
                  <span className={`text-sm ${isScrolled ? 'text-white/90' : 'text-white/90'}`}>{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className={`p-2 rounded-full transition-all ${
                    isScrolled ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Button className="bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] rounded-full px-6 font-semibold transition-all hover:scale-105 group" asChild>
                <Link to="/login">
                  Get Started
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-white' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-4 right-4 mt-2 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-[#1A1A1A] backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          
          {isAuthenticated ? (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-[#CDFF00] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-white/50 text-xs">{user?.regNumber}</p>
                </div>
              </div>
              {user?.role === 'admin' ? (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-[#CDFF00] hover:bg-[#CDFF00]/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="w-5 h-5" /> Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-white/80 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard className="w-5 h-5" /> My Dashboard
                </Link>
              )}
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full mt-2 flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <Button className="w-full mt-4 bg-[#CDFF00] text-[#1A1A1A] hover:bg-[#B8E600] rounded-full font-semibold" asChild>
              <Link to="/login">Get Started →</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

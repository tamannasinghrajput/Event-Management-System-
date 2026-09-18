import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Users, ArrowLeft, GraduationCap, LogOut, User, Mail, Phone, Hash,
  BookOpen, Loader2, XCircle, CheckCircle, ClipboardList, Trophy, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { registrationsApi } from '@/services/api';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  regNumber: string;
  department: string;
  eventId: string;
  eventTitle: string;
  status: string;
  registeredAt: string;
}

export function StudentDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingReg, setCancellingReg] = useState<Registration | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    loadRegistrations();
  }, [user]);

  const loadRegistrations = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await registrationsApi.getByEmail(user.email);
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to load registrations:', error);
      // Try localStorage fallback
      const saved = JSON.parse(localStorage.getItem('srm_registrations') || '[]');
      setRegistrations(saved.filter((r: Registration) => r.email === user.email));
    }
    setIsLoading(false);
  };

  const handleCancelRegistration = (reg: Registration) => {
    setCancellingReg(reg);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!cancellingReg) return;
    setIsCancelling(true);
    try {
      await registrationsApi.cancel(cancellingReg.id);
      setRegistrations(prev => prev.filter(r => r.id !== cancellingReg.id));
    } catch (error) {
      console.error('Cancel failed:', error);
    }
    setIsCancelling(false);
    setCancelDialogOpen(false);
    setCancellingReg(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#CDFF00] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const deptNames: Record<string, string> = {
    cse: 'Computer Science', ece: 'Electronics', mech: 'Mechanical',
    civil: 'Civil', eee: 'Electrical', it: 'Information Technology', admin: 'Administration',
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CDFF00] to-[#9EFF00] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#1A1A1A]" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">My Dashboard</h1>
              <p className="text-white/50 text-sm">Welcome, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Site
              </Button>
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#CDFF00] to-[#9EFF00] flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <Badge className="mt-2 bg-[#CDFF00]/20 text-[#5B9AFF] border-[#2B71F8]/30 capitalize">{user.role}</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-white/40" />
                  <span className="text-white/70">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-white/40" />
                  <span className="text-white/70 font-mono">{user.regNumber}</span>
                </div>
                {user.department && (
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="w-4 h-4 text-white/40" />
                    <span className="text-white/70">{deptNames[user.department] || user.department}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-white/40" />
                    <span className="text-white/70">{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#1A1A1A] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#CDFF00]">{registrations.length}</p>
                    <p className="text-white/50 text-xs">Registrations</p>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-400">{registrations.filter(r => r.status === 'confirmed').length}</p>
                    <p className="text-white/50 text-xs">Confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registrations */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList className="w-6 h-6 text-[#CDFF00]" />
              <h2 className="text-2xl font-bold text-white">My Registrations</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#CDFF00] animate-spin" />
              </div>
            ) : registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.map(reg => (
                  <div key={reg.id} className="bg-[#1A1A1A] rounded-xl p-5 border border-white/10 hover:border-[#2B71F8]/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{reg.eventTitle}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                          <Badge className={reg.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {reg.status}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Registered {new Date(reg.registeredAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelRegistration(reg)}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-white font-semibold mb-2">No registrations yet</h3>
                <p className="text-white/50 mb-6">You haven't registered for any events</p>
                <Link to="/#events">
                  <Button className="bg-[#CDFF00] hover:bg-[#B8E600] text-white rounded-full">
                    Browse Events
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md bg-[#1A1A1A] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Cancel Registration?</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to cancel your registration for "<span className="text-white">{cancellingReg?.eventTitle}</span>"?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button onClick={confirmCancel} disabled={isCancelling} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              {isCancelling ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <XCircle className="mr-2 w-4 h-4" />}
              {isCancelling ? 'Cancelling...' : 'Cancel Registration'}
            </Button>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
              Keep It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

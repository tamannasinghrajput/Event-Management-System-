import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Plus, Pencil, Trash2, Users, BarChart3, ClipboardList,
  Search, ArrowLeft, GraduationCap, LogOut, X, Save, Loader2,
  Trophy, MapPin, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi, eventsApi } from '@/services/api';

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image: string;
  seats: number;
  registered: number;
  prizes?: string;
  teamSize?: string;
}

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

interface UserData {
  id: string;
  name: string;
  email: string;
  regNumber: string;
  department: string;
  year: string;
  phone: string;
  role: string;
  createdAt: string;
}

const emptyEvent = {
  title: '', description: '', date: '', time: '', venue: '',
  category: 'technical', image: '/assets/images/event-ai.jpg',
  seats: 100, prizes: '', teamSize: 'Individual'
};

export function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<EventData[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventData | null>(null);
  const [formData, setFormData] = useState(emptyEvent);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Load data
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadData();
    }
  }, [activeTab, isAuthenticated, user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'events' || activeTab === 'analytics') {
        const data = await eventsApi.getAll();
        setEvents(data);
      }
      if (activeTab === 'registrations' || activeTab === 'analytics') {
        const data = await adminApi.getAllRegistrations();
        setRegistrations(data);
      }
      if (activeTab === 'users' || activeTab === 'analytics') {
        const data = await adminApi.getAllUsers();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setIsLoading(false);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Event CRUD
  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData(emptyEvent);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      image: event.image,
      seats: event.seats,
      prizes: event.prizes || '',
      teamSize: event.teamSize || 'Individual'
    });
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (event: EventData) => {
    setDeletingEvent(event);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;
    try {
      await adminApi.deleteEvent(deletingEvent.id);
      setEvents(prev => prev.filter(e => e.id !== deletingEvent.id));
      showToast('success', `"${deletingEvent.title}" deleted successfully`);
    } catch (error) {
      showToast('error', 'Failed to delete event');
    }
    setIsDeleteOpen(false);
    setDeletingEvent(null);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingEvent) {
        const result = await adminApi.updateEvent(editingEvent.id, formData);
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? result.event : ev));
        showToast('success', `"${formData.title}" updated successfully`);
      } else {
        const result = await adminApi.createEvent(formData);
        setEvents(prev => [...prev, result.event]);
        showToast('success', `"${formData.title}" created successfully`);
      }
      setIsFormOpen(false);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to save event');
    }
    setIsSaving(false);
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRegistrations = registrations.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.regNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'hackathon': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'technical': return 'bg-[#CDFF00]/20 text-[#CDFF00] border-[#CDFF00]/30';
      case 'cultural': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'sports': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#CDFF00] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-right ${
          toast.type === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-400 backdrop-blur-xl'
            : 'bg-red-500/20 border-red-500/30 text-red-400 backdrop-blur-xl'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CDFF00] to-[#9EFF00] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#1A1A1A]" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/50 text-sm">SRM Events 2K26</p>
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
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#CDFF00] text-[#1A1A1A] shadow-lg shadow-[#CDFF00]/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        {activeTab !== 'analytics' && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-[#CDFF00] focus:ring-[#CDFF00]/20"
              />
            </div>
            {activeTab === 'events' && (
              <Button onClick={handleAddEvent} className="bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] font-semibold rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#CDFF00] animate-spin" />
          </div>
        ) : (
          <>
            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <p className="text-white/50 text-sm mb-4">{filteredEvents.length} events total</p>
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 hover:border-[#CDFF00]/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold truncate">{event.title}</h3>
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.venue}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {event.registered}/{event.seats}</span>
                          {event.prizes && <span className="flex items-center gap-1 text-[#CDFF00]"><Trophy className="w-3.5 h-3.5" /> {event.prizes}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleEditEvent(event)} className="bg-white/10 text-white/70 hover:bg-[#CDFF00]/20 hover:text-[#CDFF00] border border-white/5 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleDeleteEvent(event)} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className="text-center py-16 text-white/40">No events found</div>
                )}
              </div>
            )}

            {/* REGISTRATIONS TAB */}
            {activeTab === 'registrations' && (
              <div>
                <p className="text-white/50 text-sm mb-4">{filteredRegistrations.length} registrations total</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Reg No.</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Event</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map(reg => (
                        <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-white text-sm">{reg.name}</td>
                          <td className="py-3 px-4 text-white/70 text-sm">{reg.email}</td>
                          <td className="py-3 px-4 text-white/70 text-sm font-mono">{reg.regNumber}</td>
                          <td className="py-3 px-4 text-white/70 text-sm max-w-[200px] truncate">{reg.eventTitle}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{reg.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-white/50 text-sm">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-16 text-white/40">No registrations found</div>
                )}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <p className="text-white/50 text-sm mb-4">{filteredUsers.length} users total</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Reg No.</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Dept</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-white text-sm">{u.name}</td>
                          <td className="py-3 px-4 text-white/70 text-sm">{u.email}</td>
                          <td className="py-3 px-4 text-white/70 text-sm font-mono">{u.regNumber}</td>
                          <td className="py-3 px-4 text-white/70 text-sm uppercase">{u.department || '—'}</td>
                          <td className="py-3 px-4">
                            <Badge className={u.role === 'admin' ? 'bg-[#CDFF00]/20 text-[#5B9AFF] border-[#2B71F8]/30' : 'bg-white/10 text-white/70 border-white/20'}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-white/50 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-16 text-white/40">No users found</div>
                )}
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Events', value: events.length, color: 'text-[#CDFF00]' },
                    { label: 'Registrations', value: registrations.length, color: 'text-green-400' },
                    { label: 'Total Users', value: users.length, color: 'text-purple-400' },
                    { label: 'Total Seats', value: events.reduce((sum, e) => sum + e.seats, 0).toLocaleString(), color: 'text-[#CDFF00]' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-xl p-6 border border-white/10">
                      <p className="text-white/50 text-sm mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Events by Category */}
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Events by Category</h3>
                  <div className="space-y-3">
                    {['technical', 'hackathon', 'cultural', 'sports'].map(cat => {
                      const count = events.filter(e => e.category === cat).length;
                      const pct = events.length > 0 ? (count / events.length) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70 capitalize">{cat}</span>
                            <span className="text-white/50">{count} events</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#CDFF00] to-[#9EFF00] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Recent Registrations</h3>
                  <div className="space-y-3">
                    {registrations.slice(-5).reverse().map(reg => (
                      <div key={reg.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-white text-sm">{reg.name}</p>
                          <p className="text-white/50 text-xs">{reg.eventTitle}</p>
                        </div>
                        <span className="text-white/40 text-xs">{new Date(reg.registeredAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {registrations.length === 0 && <p className="text-white/40 text-sm">No registrations yet</p>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl bg-[#1A1A1A] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingEvent ? 'Modify the event details below.' : 'Fill in the details to create a new event.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEvent} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-white/60">Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00]" placeholder="Event title" />
            </div>

            <div className="space-y-2">
              <Label className="text-white/60">Description</Label>
              <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required className="w-full min-h-[80px] px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00] focus:outline-none focus:ring-1 focus:ring-[#2B71F8]/20 resize-none" placeholder="Event description" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60">Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))} required className="bg-white/5 border-white/10 text-white focus:border-[#CDFF00]" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Time</Label>
                <Input value={formData.time} onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00]" placeholder="09:00 AM" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60">Venue</Label>
              <Input value={formData.venue} onChange={(e) => setFormData(p => ({ ...p, venue: e.target.value }))} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00]" placeholder="Tech Park, Kattankulathur" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60">Category</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData(p => ({ ...p, category: val }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Seats</Label>
                <Input type="number" value={formData.seats} onChange={(e) => setFormData(p => ({ ...p, seats: parseInt(e.target.value) || 0 }))} className="bg-white/5 border-white/10 text-white focus:border-[#CDFF00]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60">Prizes (optional)</Label>
                <Input value={formData.prizes} onChange={(e) => setFormData(p => ({ ...p, prizes: e.target.value }))} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00]" placeholder="Rs.1,00,000" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Team Size</Label>
                <Input value={formData.teamSize} onChange={(e) => setFormData(p => ({ ...p, teamSize: e.target.value }))} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00]" placeholder="2-4 members" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60">Image</Label>
              <Select value={formData.image} onValueChange={(val) => setFormData(p => ({ ...p, image: val }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  <SelectItem value="/assets/images/event-techfest.png">Tech Fest</SelectItem>
                  <SelectItem value="/assets/images/event-hackathon.png">Hackathon</SelectItem>
                  <SelectItem value="/assets/images/event-cybersecurity.png">Cybersecurity</SelectItem>
                  <SelectItem value="/assets/images/event-iot.png">IoT / Electronics</SelectItem>
                  <SelectItem value="/assets/images/event-ai-health.png">AI / Healthcare</SelectItem>
                  <SelectItem value="/assets/images/event-robotics-new.png">Robotics</SelectItem>
                  <SelectItem value="/assets/images/event-cultural-fest.png">Cultural Fest</SelectItem>
                  <SelectItem value="/assets/images/event-sports.png">Sports</SelectItem>
                  <SelectItem value="/assets/images/event-space.png">Space Tech</SelectItem>
                  <SelectItem value="/assets/images/event-quantum.png">Quantum / Physics</SelectItem>
                  <SelectItem value="/assets/images/event-conference.png">Conference</SelectItem>
                  <SelectItem value="/assets/images/event-data.png">Data / Analytics</SelectItem>
                  <SelectItem value="/assets/images/event-autonomous.png">Autonomous / Vehicle</SelectItem>
                  <SelectItem value="/assets/images/event-bioengineering.png">Bioengineering</SelectItem>
                  <SelectItem value="/assets/images/event-alumni.png">Alumni / Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSaving} className="flex-1 bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] font-semibold rounded-lg py-6 transition-all">
                {isSaving ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Saving...</> : <><Save className="mr-2 w-4 h-4" />{editingEvent ? 'Update Event' : 'Create Event'}</>}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
                <X className="mr-2 w-4 h-4" /> Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-[#1A1A1A] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Delete Event?</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to delete "<span className="text-white">{deletingEvent?.title}</span>"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              <Trash2 className="mr-2 w-4 h-4" /> Delete
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

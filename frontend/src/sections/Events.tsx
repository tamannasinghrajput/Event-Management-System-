import { useState, useMemo, useEffect } from 'react';
import { Calendar, MapPin, Users, Trophy, Clock, Search, Star, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { events as defaultEvents, clubs } from '@/data/events';
import type { Event } from '@/types';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Events() {
  const [eventsList, setEventsList] = useState(defaultEvents);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#events .scroll-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Filter events based on all criteria
  const filteredEvents = useMemo(() => {
    let filtered = eventsList;

    // Status filter
    const now = new Date('2026-01-01'); // Using 2026 as reference
    if (selectedStatus === 'upcoming') {
      filtered = filtered.filter(e => new Date(e.date) >= now);
    } else if (selectedStatus === 'ongoing') {
      // Events happening today
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.toDateString() === now.toDateString();
      });
    } else if (selectedStatus === 'past') {
      filtered = filtered.filter(e => new Date(e.date) < now);
    }

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(event => event.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }

    // Club filter
    if (selectedClub !== 'all') {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(selectedClub.toLowerCase())
      );
    }

    // Date range filter
    if (selectedDateRange !== 'all') {
      const eventDate = new Date();
      filtered = filtered.filter(event => {
        const date = new Date(event.date);
        if (selectedDateRange === 'this-week') {
          const weekFromNow = new Date(eventDate);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return date >= eventDate && date <= weekFromNow;
        } else if (selectedDateRange === 'this-month') {
          return date.getMonth() === eventDate.getMonth() && date.getFullYear() === eventDate.getFullYear();
        } else if (selectedDateRange === 'next-month') {
          const nextMonth = new Date(eventDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return date.getMonth() === nextMonth.getMonth();
        }
        return true;
      });
    }

    return filtered;
  }, [eventsList, activeCategory, searchQuery, selectedClub, selectedDateRange, selectedStatus]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleRegisterClick = () => {
    setIsDetailsOpen(false);
    setIsRegisterOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hackathon': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'technical': return 'bg-[#CDFF00]/20 text-[#CDFF00] border-[#CDFF00]/30';
      case 'cultural': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'sports': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getCategoryBgDot = (category: string) => {
    switch (category) {
      case 'hackathon': return 'bg-purple-400';
      case 'technical': return 'bg-[#CDFF00]';
      case 'cultural': return 'bg-pink-400';
      case 'sports': return 'bg-emerald-400';
      default: return 'bg-white/50';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPopularity = (event: Event) => {
    return Math.round((event.registered / event.seats) * 100);
  };

  return (
    <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0EB]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 scroll-animate">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1A1A1A] mb-3">
              Our <span className="italic text-gradient">Events</span>
            </h2>
            <p className="text-[#1A1A1A]/50 max-w-lg text-lg">
              Transform ideas into reality by combining creativity, strategy, and expertise.
            </p>
          </div>
          <p className="text-[#1A1A1A]/40 text-sm">
            Showing <span className="text-[#1A1A1A] font-semibold">{filteredEvents.length}</span> events
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-8 scroll-animate">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
          <Input
            type="text"
            placeholder="Search events, clubs, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-6 bg-white/80 border-[#1A1A1A]/10 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 rounded-full focus:border-[#CDFF00] focus:ring-[#CDFF00]/20 shadow-sm"
          />
        </div>

        {/* Status + Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6 scroll-animate">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ongoing', label: 'Ongoing' },
            { id: 'past', label: 'Past' },
            { id: 'all', label: 'All' },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedStatus === status.id
                  ? 'bg-[#1A1A1A] text-white shadow-lg'
                  : 'bg-white/80 text-[#1A1A1A]/60 hover:bg-white hover:text-[#1A1A1A] border border-[#1A1A1A]/10'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-3 mb-10 scroll-animate">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-[160px] rounded-full bg-white/80 dark:bg-[#1A1A1A] text-[#1A1A1A]/70 dark:text-white/80 border-[#1A1A1A]/10 dark:border-white/10 h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hackathon">Hackathons</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedClub} onValueChange={setSelectedClub}>
            <SelectTrigger className="w-[180px] rounded-full bg-white/80 dark:bg-[#1A1A1A] text-[#1A1A1A]/70 dark:text-white/80 border-[#1A1A1A]/10 dark:border-white/10 h-10">
              <SelectValue placeholder="All Clubs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clubs</SelectItem>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.name}>{club.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-[160px] rounded-full bg-white/80 dark:bg-[#1A1A1A] text-[#1A1A1A]/70 dark:text-white/80 border-[#1A1A1A]/10 dark:border-white/10 h-10">
              <SelectValue placeholder="Any Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Date</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="next-month">Next Month</SelectItem>
            </SelectContent>
          </Select>

          {(activeCategory !== 'all' || selectedClub !== 'all' || selectedDateRange !== 'all' || searchQuery) && (
            <button onClick={() => { setActiveCategory('all'); setSelectedClub('all'); setSelectedDateRange('all'); setSearchQuery(''); }}
              className="px-4 py-2.5 rounded-full bg-red-50 text-red-500 border border-red-200 text-sm hover:bg-red-100 transition-all">
              Clear Filters
            </button>
          )}
        </div>

        {/* Events Grid — Dark Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="dark-card arrow-reveal img-zoom group relative bg-[#1A1A1A] rounded-2xl overflow-hidden cursor-pointer"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Event Image */}
              <div className="relative h-44 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(event.category)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getCategoryBgDot(event.category)}`} />
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </Badge>
                {/* Arrow icon */}
                <div className="arrow-icon absolute top-3 right-3 w-10 h-10 rounded-full bg-[#CDFF00] flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-[#1A1A1A]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#CDFF00] transition-colors leading-tight">
                  {event.title}
                </h3>
                <p className="text-white/40 text-sm mb-4">
                  {event.description.substring(0, 80)}...
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <Calendar className="w-3 h-3" /> {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <MapPin className="w-3 h-3" /> {event.venue.split(',')[0]}
                  </span>
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <span>{event.registered}/{event.seats}</span>
                  </div>
                  {event.prizes && (
                    <div className="flex items-center gap-1 text-[#CDFF00] text-xs font-semibold">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{event.prizes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#1A1A1A]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#1A1A1A]/30" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No events found</h3>
            <p className="text-[#1A1A1A]/50">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Event Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl bg-[#1A1A1A] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
            {selectedEvent && (
              <>
                <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent" />
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(selectedEvent.category)}`}>
                    {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                  </Badge>
                </div>
                
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif font-bold text-white">
                    {selectedEvent.title}
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    {selectedEvent.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/40 mb-1"><Calendar className="w-4 h-4" /><span className="text-sm">Date</span></div>
                    <p className="text-white font-medium">{formatDate(selectedEvent.date)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/40 mb-1"><Clock className="w-4 h-4" /><span className="text-sm">Time</span></div>
                    <p className="text-white font-medium">{selectedEvent.time}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/40 mb-1"><MapPin className="w-4 h-4" /><span className="text-sm">Venue</span></div>
                    <p className="text-white font-medium">{selectedEvent.venue}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/40 mb-1"><Users className="w-4 h-4" /><span className="text-sm">Team Size</span></div>
                    <p className="text-white font-medium">{selectedEvent.teamSize}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 mb-6">
                  <div>
                    <p className="text-white/40 text-sm">Registration</p>
                    <p className="text-white font-medium">{selectedEvent.registered} / {selectedEvent.seats} seats filled</p>
                  </div>
                  {selectedEvent.prizes && (
                    <div className="text-right">
                      <p className="text-white/40 text-sm">Prize Pool</p>
                      <p className="text-[#CDFF00] font-bold text-lg">{selectedEvent.prizes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleRegisterClick} className="flex-1 bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] rounded-full py-6 font-semibold transition-all hover:scale-[1.02]">
                    Register Now
                  </Button>
                  <Button onClick={() => setIsDetailsOpen(false)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full font-medium">
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Registration Dialog */}
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent className="max-w-lg bg-[#1A1A1A] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-white">
                Register for {selectedEvent?.title}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Fill in your details to secure your spot at this event.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <RegistrationForm
                eventId={selectedEvent.id}
                eventTitle={selectedEvent.title}
                onSuccess={() => {
                  setEventsList(prev => prev.map(e => 
                    e.id === selectedEvent.id ? { ...e, registered: e.registered + 1 } : e
                  ));
                  setSelectedEvent(prev => prev ? { ...prev, registered: prev.registered + 1 } : null);
                  setIsRegisterOpen(false);
                }}
                onCancel={() => setIsRegisterOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

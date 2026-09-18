import { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { events } from '@/data/events';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RegistrationCTA() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const handleQuickRegister = () => {
    if (selectedEventId) {
      setIsDialogOpen(true);
    }
  };

  return (
    <section id="register" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#1A1A1A]">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#CDFF00]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CDFF00]/10 border border-[#CDFF00]/20 mb-8">
              <Sparkles className="w-4 h-4 text-[#CDFF00]" />
              <span className="text-sm text-[#CDFF00] font-medium">Limited Seats Available</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Ready to{' '}
              <span className="italic text-gradient">Participate?</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-white/40 max-w-xl mb-10 leading-relaxed">
              Secure your spot today. Join thousands of students in the biggest 
              technical and cultural celebration at SRM University.
            </p>

            {/* Quick Register */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
              <Select onValueChange={setSelectedEventId}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-[#CDFF00]/20 rounded-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="bg-[#232323] border-white/10">
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleQuickRegister}
                disabled={!selectedEventId}
                className="bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] rounded-full px-8 py-5 font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#CDFF00]/20 disabled:opacity-30 group"
              >
                Register
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right: Spinning Badge + Features */}
          <div className="flex-shrink-0 relative">
            {/* Spinning badge */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <path id="circlePath" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
                  </defs>
                  <text className="fill-white/60" style={{ fontSize: '14px', letterSpacing: '6px' }}>
                    <textPath href="#circlePath" startOffset="0%">
                      LET&apos;S GET STARTED • LET&apos;S GET STARTED • 
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button 
                  onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-20 h-20 rounded-full bg-[#CDFF00] hover:bg-[#B8E600] flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg hover:shadow-[#CDFF00]/30 group"
                  aria-label="Scroll to events"
                >
                  <ArrowRight className="w-8 h-8 text-[#1A1A1A] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Quick Registration', desc: 'Sign up in under 2 minutes' },
                { icon: Target, title: 'Track Progress', desc: 'Monitor your registrations' },
                { icon: Sparkles, title: 'Get Updates', desc: 'Never miss event notifications' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/5 rounded-xl px-5 py-4 border border-white/5 hover:border-[#CDFF00]/20 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#CDFF00]/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-[#CDFF00]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                    <p className="text-white/40 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-[#1A1A1A] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-white">
              Register for {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Fill in your details to secure your spot at this event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <RegistrationForm
              eventId={selectedEvent.id}
              eventTitle={selectedEvent.title}
              onSuccess={() => {
                setIsDialogOpen(false);
                setSelectedEventId('');
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

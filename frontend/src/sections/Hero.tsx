import { useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 15;
      const y = (clientY / innerHeight - 0.5) * 15;
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Calendar, value: '8+', label: 'Events' },
    { icon: Users, value: '4000+', label: 'Participants' },
    { icon: Sparkles, value: 'Rs.13L+', label: 'In Prizes' },
  ];

  return (
    <section id="home" ref={heroRef}>
      {/* Hero with Campus Background */}
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/images/srm-campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-[#121212]" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#CDFF00] rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
                opacity: 0.2 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-24"
          style={{
            transform: 'translate(calc(var(--mouse-x, 0px) * -0.3), calc(var(--mouse-y, 0px) * -0.3))',
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[#CDFF00]" />
            <span className="text-sm text-white/90 font-medium">SRM University Presents</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 tracking-tight animate-fade-in-up stagger-1">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              SRM
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-gradient">EVENTS</span>{' '}
              <span className="text-white">2K26</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/80 mb-4 font-light animate-fade-in-up stagger-2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            Where Innovation Meets Celebration
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-3">
            Join the biggest technical and cultural fest of the year. Showcase your talents,
            compete with the best, and create memories that last a lifetime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up stagger-4">
            <Button
              size="lg"
              className="bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] rounded-full px-8 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#CDFF00]/20 group"
              asChild
            >
              <a href="#events">
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold transition-all hover:scale-105 backdrop-blur-sm"
              asChild
            >
              <a href="#register">Register Now</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 animate-fade-in-up stagger-5">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2 group">
                <div className="flex items-center gap-2 text-[#CDFF00]">
                  <stat.icon className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-bold text-white group-hover:text-[#CDFF00] transition-colors drop-shadow-lg">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
      </div>

      {/* Marquee Ticker */}
      <div className="bg-[#1A1A1A] py-4 border-y border-white/5">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-4">
                {[
                  'Hackathons',
                  'Workshops',
                  'Tech Talks',
                  'Cultural Fests',
                  'Sports Tournaments',
                  'Robotics',
                  'AI/ML',
                  'Coding Contests',
                  'Music Nights',
                  'Art Exhibitions',
                ].map((item, j) => (
                  <span key={j} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-white/80 text-sm font-medium tracking-wide uppercase">{item}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CDFF00]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

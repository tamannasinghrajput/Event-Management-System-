import { useState, useEffect } from 'react';
import { Trophy, Users, Briefcase, Cpu, Palette, Heart, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { clubs } from '@/data/events';

const categoryIcons = {
  technical: Cpu,
  cultural: Palette,
  sports: Trophy,
  social: Heart,
  professional: Briefcase,
};

const categoryLabels = {
  technical: 'Technical',
  cultural: 'Cultural',
  sports: 'Sports',
  social: 'Social',
  professional: 'Professional',
};

const bentoThemes = [
  { bg: 'bg-[#CDFF00]', text: 'text-[#1A1A1A]', muted: 'text-[#1A1A1A]/70', iconBg: 'bg-[#1A1A1A]', icon: 'text-[#CDFF00]', tagBg: 'bg-black/10' },
  { bg: 'bg-[#8B5CF6]', text: 'text-white', muted: 'text-white/80', iconBg: 'bg-[#CDFF00]', icon: 'text-[#1A1A1A]', tagBg: 'bg-white/20' },
  { bg: 'bg-[#1A1A1A]', text: 'text-white', muted: 'text-white/60', titleText: 'text-[#CDFF00]', iconBg: 'bg-white/10', icon: 'text-white', tagBg: 'bg-white/10' },
  { bg: 'bg-[#F5F0EB]', text: 'text-[#1A1A1A]', muted: 'text-[#1A1A1A]/60', iconBg: 'bg-[#1A1A1A]', icon: 'text-white', tagBg: 'bg-black/5' },
  { bg: 'bg-emerald-500', text: 'text-white', muted: 'text-white/80', iconBg: 'bg-white', icon: 'text-emerald-500', tagBg: 'bg-white/20' },
  { bg: 'bg-pink-500', text: 'text-white', muted: 'text-white/80', iconBg: 'bg-[#1A1A1A]', icon: 'text-white', tagBg: 'bg-white/20' },
];

export function Clubs() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    // Use a small timeout to let React flush the DOM updates for new filtered items
    const timeout = setTimeout(() => {
      document.querySelectorAll('#clubs .scroll-animate').forEach((el) => observer.observe(el));
    }, 10);
    
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [activeCategory]);

  const filteredClubs = activeCategory === 'all'
    ? clubs
    : clubs.filter(club => club.category === activeCategory);

  const categories = ['all', 'technical', 'cultural', 'sports', 'social', 'professional'];

  return (
    <section id="clubs" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 scroll-animate">
          <div>
            <Badge className="bg-[#CDFF00]/10 text-[#CDFF00] border-[#CDFF00]/20 mb-4">
              <Users className="w-3 h-3 mr-1.5" />
              Student Organizations
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-3">
              SRM <span className="italic text-gradient">Clubs</span>
            </h2>
            <p className="text-white/40 max-w-lg text-lg">
              Discover 22+ student clubs at SRM University. From technical societies to cultural groups, 
              find your community and pursue your passions.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12 scroll-animate">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#CDFF00] text-[#1A1A1A] shadow-lg shadow-[#CDFF00]/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat === 'all' ? 'All Clubs' : categoryLabels[cat as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>

        {/* Dynamic Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {filteredClubs.map((club, index) => {
            const Icon = categoryIcons[club.category as keyof typeof categoryIcons] || Cpu;
            const theme = bentoThemes[index % bentoThemes.length];
            const isLarge = index === 0 || index === 5 || index === 8;

            return (
              <div
                key={club.id}
                className={`group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between min-h-[320px] scroll-animate ${theme.bg} ${isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}`}
                style={{ animationDelay: `${(index % 6) * 50}ms` }}
              >
                {/* Abstract Decorative Shape in Background */}
                <div className="absolute -right-8 -top-8 opacity-[0.07] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                  <Icon className={`w-64 h-64 ${theme.text}`} />
                </div>

                <div className="relative z-10 flex items-start justify-between mb-8 gap-4">
                  <div>
                    <Badge className={`mb-4 px-4 py-1 flex w-fit items-center gap-1.5 text-xs border-none shadow-none font-bold uppercase tracking-wider ${theme.tagBg} ${theme.text}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {categoryLabels[club.category as keyof typeof categoryLabels]}
                    </Badge>
                    <h3 className={`text-3xl lg:text-4xl font-bold font-serif leading-tight mb-3 ${theme.titleText || theme.text}`}>
                      {club.name}
                    </h3>
                    <p className={`text-base font-medium max-w-md line-clamp-3 ${theme.muted}`}>
                      {club.description}
                    </p>
                  </div>

                  <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shadow-sm ${theme.iconBg}`}>
                    <ArrowUpRight className={`w-7 h-7 ${theme.icon}`} />
                  </div>
                </div>

                {/* Footer: Key Events */}
                <div className={`relative z-10 mt-auto pt-6 border-t ${theme.bg === 'bg-[#1A1A1A]' ? 'border-white/10' : 'border-black/5'}`}>
                  <div className="flex flex-wrap gap-2.5">
                    {club.events.slice(0, 3).map((event, i) => (
                      <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md ${theme.tagBg} ${theme.text}`}>
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 scroll-animate">
          {[
            { label: 'Total Clubs', value: '22+' },
            { label: 'Technical', value: '10' },
            { label: 'Cultural', value: '6' },
            { label: 'Annual Events', value: '50+' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-[#232323] border border-white/5 hover:border-[#CDFF00]/20 transition-all"
            >
              <p className="text-3xl font-bold text-[#CDFF00] mb-1">{stat.value}</p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { GraduationCap, Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Events', href: '#events' },
    { label: 'Clubs', href: '#clubs' },
    { label: 'Hackathons', href: '#hackathons' },
    { label: 'Register', href: '#register' },
  ];

  const resources = [
    { label: 'Event Guidelines', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="bg-[#0F0F0F]">
      {/* Top: Large CTA Text */}
      <div className="border-b border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight text-center md:text-left">
            Ready to create<br />
            <span className="italic text-gradient">something amazing?</span>
          </h2>
          <a
            href="#register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#CDFF00] text-[#1A1A1A] rounded-full font-semibold text-lg hover:bg-[#B8E600] transition-all hover:scale-105 group"
          >
            Get Started
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#CDFF00] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div>
                <span className="font-bold text-lg text-white block">SRM Events</span>
                <span className="text-white/30 text-xs">2K26</span>
              </div>
            </a>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              The biggest technical and cultural fest at SRM University. 
              Join us for an unforgettable experience.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#CDFF00] hover:text-[#1A1A1A] transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/40 hover:text-[#CDFF00] transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/40 hover:text-[#CDFF00] transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#CDFF00] mt-0.5 shrink-0" />
                <span className="text-white/40 text-sm">
                  SRM University,<br />
                  Kattankulathur, Chennai - 603203
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#CDFF00] shrink-0" />
                <a href="mailto:events@srmuniv.ac.in" className="text-white/40 hover:text-[#CDFF00] transition-colors text-sm">
                  events@srmuniv.ac.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#CDFF00] shrink-0" />
                <a href="tel:+914427411000" className="text-white/40 hover:text-[#CDFF00] transition-colors text-sm">
                  +91 44 2741 1000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {currentYear} SRM University. All rights reserved.
            </p>
            <p className="text-white/30 text-sm">
              Made with <span className="text-red-500">❤</span> by <span className="text-[#CDFF00] font-medium">Harsh</span>
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

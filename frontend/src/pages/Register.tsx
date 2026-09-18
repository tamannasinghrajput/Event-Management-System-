import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ArrowRight, User, Phone, Hash, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    regNumber: '',
    department: '',
    year: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        regNumber: formData.regNumber,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
      });

      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Email or Registration Number may already exist.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00] focus:ring-[#CDFF00]/20 rounded-xl";

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#CDFF00]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1A1A] mb-4">
            <GraduationCap className="w-8 h-8 text-[#CDFF00]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-2">Create Account</h1>
          <p className="text-[#1A1A1A]/50">Join SRM Events 2K26</p>
        </div>

        {/* Register Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70 text-sm">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input id="name" type="text" placeholder="John Doe" value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)} required className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-white/70 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input id="reg-email" type="email" placeholder="yourname@srmist.edu.in" value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)} required className={inputClass} />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-white/70 text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 chars"
                    value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white/70 text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input id="confirm-password" type={showPassword ? 'text' : 'password'} placeholder="Repeat password"
                    value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} required className={inputClass} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reg Number & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regNumber" className="text-white/70 text-sm">Registration Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input id="regNumber" type="text" placeholder="RA22110030XXXXX" value={formData.regNumber}
                    onChange={(e) => handleChange('regNumber', e.target.value)} required className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70 text-sm">Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm flex items-center gap-1"><BookOpen className="w-4 h-4" /> Department</Label>
                <Select onValueChange={(value) => handleChange('department', value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#CDFF00]/20 rounded-xl">
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#232323] border-white/10">
                    <SelectItem value="cse">Computer Science</SelectItem>
                    <SelectItem value="ece">Electronics</SelectItem>
                    <SelectItem value="mech">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="eee">Electrical</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm flex items-center gap-1"><Calendar className="w-4 h-4" /> Year</Label>
                <Select onValueChange={(value) => handleChange('year', value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#CDFF00]/20 rounded-xl">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#232323] border-white/10">
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    <SelectItem value="5">5th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            {/* Submit */}
            <Button type="submit" disabled={isLoading}
              className="w-full bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] rounded-full py-6 font-semibold transition-all hover:scale-[1.02] disabled:opacity-50">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-white/50">Already have an account? </span>
            <Link to="/login" className="text-[#CDFF00] hover:text-[#B8E600] transition-colors font-medium">Sign In</Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] text-sm transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

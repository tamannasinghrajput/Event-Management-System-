import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { registrationsApi, healthCheck } from '@/services/api';

interface RegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RegistrationForm({ eventId, eventTitle, onSuccess, onCancel }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', regNumber: '', department: '', year: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const backendAvailable = await healthCheck();
      if (backendAvailable) {
        await registrationsApi.register({ ...formData, eventId, eventTitle });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const registrations = JSON.parse(localStorage.getItem('srm_registrations') || '[]');
        registrations.push({ id: Date.now().toString(), ...formData, eventId, eventTitle, status: 'confirmed', registeredAt: new Date().toISOString() });
        localStorage.setItem('srm_registrations', JSON.stringify(registrations));
      }
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  const handleChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
        <p className="text-white/60">You've successfully registered for {eventTitle}. Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/60 text-sm">Full Name</Label>
          <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00] focus:ring-[#CDFF00]/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/60 text-sm">Email</Label>
          <Input id="email" type="email" placeholder="john@srmap.edu.in" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00] focus:ring-[#CDFF00]/20" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white/60 text-sm">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00] focus:ring-[#CDFF00]/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="regNumber" className="text-white/60 text-sm">Registration Number</Label>
          <Input id="regNumber" placeholder="RA2211003010XXX" value={formData.regNumber} onChange={(e) => handleChange('regNumber', e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#CDFF00] focus:ring-[#CDFF00]/20" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department" className="text-white/60 text-sm">Department</Label>
          <Select onValueChange={(value) => handleChange('department', value)} required>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#CDFF00]/20"><SelectValue placeholder="Select Department" /></SelectTrigger>
            <SelectContent className="bg-[#232323] border-white/10">
              <SelectItem value="cse">Computer Science</SelectItem><SelectItem value="ece">Electronics</SelectItem>
              <SelectItem value="mech">Mechanical</SelectItem><SelectItem value="civil">Civil</SelectItem>
              <SelectItem value="eee">Electrical</SelectItem><SelectItem value="it">IT</SelectItem><SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="year" className="text-white/60 text-sm">Year of Study</Label>
          <Select onValueChange={(value) => handleChange('year', value)} required>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#CDFF00]/20"><SelectValue placeholder="Select Year" /></SelectTrigger>
            <SelectContent className="bg-[#232323] border-white/10">
              <SelectItem value="1">1st Year</SelectItem><SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem><SelectItem value="4">4th Year</SelectItem><SelectItem value="5">5th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#CDFF00] hover:bg-[#B8E600] text-[#1A1A1A] rounded-full py-6 transition-all hover:scale-[1.02] disabled:opacity-50">
          {isSubmitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Registering...</> : 'Complete Registration'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="border-white/20 text-white hover:bg-white/10">Cancel</Button>
      </div>
    </form>
  );
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'hackathon' | 'technical' | 'cultural' | 'sports';
  image: string;
  seats: number;
  registered: number;
  prizes?: string;
  teamSize?: string;
}

export interface Club {
  id: string;
  name: string;
  category: 'technical' | 'cultural' | 'sports' | 'social' | 'professional';
  description: string;
  logo?: string;
  events: string[];
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  regNumber: string;
  department: string;
  year: string;
  eventId: string;
}

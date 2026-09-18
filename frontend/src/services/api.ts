const API_BASE_URL = 'http://localhost:5000/api';

// Helper for headers
const getHeaders = (includeAuth: boolean = false): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = localStorage.getItem('srm_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Auth API
export const authApi = {
    async login(email: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    async register(userData: {
        name: string;
        email: string;
        password: string;
        regNumber: string;
        department?: string;
        year?: string;
        phone?: string;
    }) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    async getCurrentUser() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to get user');
        }

        return response.json();
    },
};

// Events API
export const eventsApi = {
    async getAll(filters?: { category?: string; status?: string; search?: string }) {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);

        const url = `${API_BASE_URL}/events${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        return response.json();
    },

    async getById(id: string) {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);

        if (!response.ok) {
            throw new Error('Event not found');
        }

        return response.json();
    },
};

// Clubs API
export const clubsApi = {
    async getAll(category?: string) {
        const url = category && category !== 'all'
            ? `${API_BASE_URL}/clubs?category=${category}`
            : `${API_BASE_URL}/clubs`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch clubs');
        }

        return response.json();
    },
};

// Registrations API
export const registrationsApi = {
    async register(registrationData: {
        name: string;
        email: string;
        phone?: string;
        regNumber: string;
        department?: string;
        year?: string;
        eventId: string;
        eventTitle: string;
    }) {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(registrationData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    async getMyRegistrations() {
        const response = await fetch(`${API_BASE_URL}/registrations/my-registrations`, {
            headers: getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch registrations');
        }

        return response.json();
    },

    async getByEmail(email: string) {
        const response = await fetch(`${API_BASE_URL}/registrations?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch registrations');
        }

        return response.json();
    },

    async cancel(id: string) {
        const response = await fetch(`${API_BASE_URL}/registrations/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel registration');
        }

        return response.json();
    },
};

// Admin API
export const adminApi = {
    async createEvent(eventData: {
        title: string;
        description: string;
        date: string;
        time: string;
        venue: string;
        category: string;
        image?: string;
        seats?: number;
        prizes?: string;
        teamSize?: string;
    }) {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create event');
        }

        return response.json();
    },

    async updateEvent(id: string, eventData: Record<string, unknown>) {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update event');
        }

        return response.json();
    },

    async deleteEvent(id: string) {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete event');
        }

        return response.json();
    },

    async getAllRegistrations() {
        const response = await fetch(`${API_BASE_URL}/registrations/all`, {
            headers: getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch registrations');
        }

        return response.json();
    },

    async getAllUsers() {
        const response = await fetch(`${API_BASE_URL}/auth/users`, {
            headers: getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return response.json();
    },
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};

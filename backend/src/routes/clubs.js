const express = require('express');
const router = express.Router();

// Real SRM Clubs Data
const clubs = [
    // Technical Clubs
    {
        id: 'club-1',
        name: 'SRM ACM Student Chapter',
        category: 'technical',
        description: 'Official ACM student chapter promoting competitive programming, algorithms, and computer science excellence.',
        events: ['CodeRush', 'Tech Talks', 'Workshops']
    },
    {
        id: 'club-2',
        name: 'White Hat Hackers Club',
        category: 'technical',
        description: 'Cybersecurity club with 300+ members focusing on ethical hacking, CTF competitions, and security awareness.',
        events: ['CTF Competitions', 'Security Workshops', 'Bug Bounty']
    },
    {
        id: 'club-3',
        name: 'IEEE Student Branch',
        category: 'technical',
        description: 'Professional body for electronics and computing. Organizes workshops, conferences, and research seminars.',
        events: ['Robotics Challenge', 'Paper Presentations', 'Tech Seminars']
    },
    {
        id: 'club-4',
        name: 'GitHub Community SRM',
        category: 'technical',
        description: 'GitHub Campus Community promoting open-source contributions and collaborative development.',
        events: ['HackDays', 'Open Source Workshops', 'Git/GitHub Training']
    },
    {
        id: 'club-5',
        name: 'SRM Hackathon Club',
        category: 'technical',
        description: 'Club dedicated to organizing hackathons and coding competitions throughout the year.',
        events: ['Beyond Hack', 'Semicolon', 'Ideathon']
    },
    {
        id: 'club-6',
        name: 'Team Camber Racing',
        category: 'technical',
        description: 'Formula Student team designing and building race cars. National champions at Formula Bharat 2026.',
        events: ['Formula Bharat', 'Vehicle Launch', 'Test Sessions']
    },
    // Cultural Clubs
    {
        id: 'club-11',
        name: 'Dance Club',
        category: 'cultural',
        description: 'Official dance club representing SRM in inter-college competitions and organizing dance events.',
        events: ['Nritya Utsav', 'Dance Workshops', 'Flash Mobs']
    },
    {
        id: 'club-12',
        name: 'Music Club',
        category: 'cultural',
        description: 'Platform for musicians to collaborate, perform, and compete in various music competitions.',
        events: ['Sargam Symphony', 'Battle of Bands', 'Open Mic Nights']
    },
    {
        id: 'club-13',
        name: 'Fashion Club',
        category: 'cultural',
        description: 'Fashion and design club organizing fashion shows and promoting sustainable fashion.',
        events: ['Haute Couture', 'Fashion Shows', 'Design Workshops']
    },
    {
        id: 'club-14',
        name: 'Dramatics Club',
        category: 'cultural',
        description: 'Theatre and performing arts club for stage plays, street plays, and mime.',
        events: ['Rang Manch', 'Street Plays', 'Theatre Workshops']
    },
    {
        id: 'club-15',
        name: 'Literary Club',
        category: 'cultural',
        description: 'Club for literature enthusiasts. Organizes debates, quizzes, creative writing, and poetry events.',
        events: ['LitFest', 'Debates', 'Creative Writing']
    },
    {
        id: 'club-16',
        name: 'Creative Arts & Media',
        category: 'cultural',
        description: 'Visual arts club for painters, sketch artists, photographers, and digital artists.',
        events: ['Canvas Carnival', 'Art Exhibitions', 'Photography Contests']
    },
    // Professional & Social
    {
        id: 'club-17',
        name: 'Entrepreneurship Cell (E-Cell)',
        category: 'professional',
        description: 'Fosters entrepreneurial mindset through workshops, pitch events, and incubation support.',
        events: ['Startup Weekend', 'Pitch Competitions', 'Founder Talks']
    },
    {
        id: 'club-18',
        name: 'SRM TEDx Club',
        category: 'professional',
        description: 'Organizes TEDx events bringing inspiring speakers to share ideas worth spreading.',
        events: ['TEDx SRM', 'Salon Events', 'Speaker Sessions']
    },
    {
        id: 'club-19',
        name: 'Rotaract Club',
        category: 'social',
        description: 'Youth wing of Rotary International. Focuses on community service and social awareness.',
        events: ['Blood Donation', 'Social Drives', 'Awareness Campaigns']
    },
    {
        id: 'club-20',
        name: 'Astrophilia Club',
        category: 'technical',
        description: 'Astronomy club organizing stargazing sessions, space talks, and astrophotography events.',
        events: ['Stargazing', 'Space Talks', 'Astrophotography']
    },
    {
        id: 'club-21',
        name: 'Quiz Club',
        category: 'cultural',
        description: 'Quiz enthusiasts club organizing trivia competitions and knowledge challenges.',
        events: ['Quiz Competitions', 'Trivia Nights', 'Knowledge Challenges']
    },
    {
        id: 'club-22',
        name: 'Gaming Club',
        category: 'sports',
        description: 'Esports and gaming club organizing tournaments for popular games.',
        events: ['Esports Championship', 'Gaming Nights', 'Tournaments']
    },
    {
        id: 'club-23',
        name: 'Women Empowerment Club',
        category: 'social',
        description: 'Promotes gender equality and empowers women through various initiatives and events.',
        events: ['Women\'s Day', 'Empowerment Workshops', 'Leadership Talks']
    },
    {
        id: 'club-24',
        name: 'Self Defense Club',
        category: 'sports',
        description: 'Teaches self-defense techniques and promotes personal safety awareness.',
        events: ['Self Defense Workshops', 'Training Sessions', 'Awareness Drives']
    },
    {
        id: 'club-25',
        name: 'Social Club',
        category: 'social',
        description: 'Organizes social service activities and community outreach programs.',
        events: ['Community Service', 'Outreach Programs', 'Charity Events']
    }
];

// Get all clubs
router.get('/', (req, res) => {
    const { category } = req.query;
    let filteredClubs = [...clubs];

    if (category && category !== 'all') {
        filteredClubs = filteredClubs.filter(c => c.category === category);
    }

    res.json(filteredClubs);
});

// Get single club
router.get('/:id', (req, res) => {
    const club = clubs.find(c => c.id === req.params.id);
    if (!club) {
        return res.status(404).json({ error: 'Club not found' });
    }
    res.json(club);
});

module.exports = router;

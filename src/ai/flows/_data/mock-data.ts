
import type { League, Team, Match } from '@/lib/types';

export const leagues: League[] = [
    { id: '1', name: 'La Liga', country: 'España', sportId: 'soccer', logoUrl: '/flags/es.svg' },
    { id: '2', name: 'Premier League', country: 'Inglaterra', sportId: 'soccer', logoUrl: '/flags/gb.svg' },
    { id: '3', name: 'Serie A', country: 'Italia', sportId: 'soccer', logoUrl: '/flags/it.svg' },
    { id: '4', name: 'Bundesliga', country: 'Alemania', sportId: 'soccer', logoUrl: '/flags/de.svg' },
    { id: '5', name: 'Ligue 1', country: 'Francia', sportId: 'soccer', logoUrl: '/flags/fr.svg' },
];

export const teams: Team[] = [
    // La Liga
    { id: 't1', name: 'Real Madrid', logoUrl: 'https://placehold.co/40x40.png', leagueId: '1' },
    { id: 't2', name: 'Barcelona', logoUrl: 'https://placehold.co/40x40.png', leagueId: '1' },
    { id: 't3', name: 'Atlético Madrid', logoUrl: 'https://placehold.co/40x40.png', leagueId: '1' },
    // Premier League
    { id: 't4', name: 'Manchester City', logoUrl: 'https://placehold.co/40x40.png', leagueId: '2' },
    { id: 't5', name: 'Liverpool', logoUrl: 'https://placehold.co/40x40.png', leagueId: '2' },
    { id: 't6', name: 'Arsenal', logoUrl: 'https://placehold.co/40x40.png', leagueId: '2' },
    // Serie A
    { id: 't7', name: 'Juventus', logoUrl: 'https://placehold.co/40x40.png', leagueId: '3' },
    { id: 't8', name: 'Inter Milan', logoUrl: 'https://placehold.co/40x40.png', leagueId: '3' },
    // Bundesliga
    { id: 't9', name: 'Bayern Munich', logoUrl: 'https://placehold.co/40x40.png', leagueId: '4' },
    // Ligue 1
    { id: 't10', name: 'Paris Saint-Germain', logoUrl: 'https://placehold.co/40x40.png', leagueId: '5' },
];

const getTeam = (id: string) => teams.find(t => t.id === id)!;
const getLeague = (id: string) => leagues.find(l => l.id === id)!;

export const matches: Match[] = [
    { 
        id: 'm1', 
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), 
        homeTeam: getTeam('t1'), 
        awayTeam: getTeam('t2'), 
        league: getLeague('1'),
        odds: { home: 2.1, draw: 3.5, away: 3.2, over: 1.8, under: 2.0 },
        valueScore: 0.08,
    },
    { 
        id: 'm2', 
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), 
        homeTeam: getTeam('t4'), 
        awayTeam: getTeam('t5'), 
        league: getLeague('2'),
        odds: { home: 1.9, draw: 3.8, away: 4.0, over: 1.7, under: 2.1 },
        valueScore: 0.04,
    },
     { 
        id: 'm3', 
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
        homeTeam: getTeam('t7'), 
        awayTeam: getTeam('t8'), 
        league: getLeague('3'),
        odds: { home: 2.5, draw: 3.1, away: 2.9, over: 1.9, under: 1.9 },
        valueScore: 0.12,
    },
    { 
        id: 'm4', 
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), 
        homeTeam: getTeam('t9'), 
        awayTeam: getTeam('t10'), 
        league: getLeague('4'),
        odds: { home: 1.5, draw: 4.5, away: 6.0, over: 1.5, under: 2.5 },
        valueScore: 0.02,
    },
    // Add more matches to test pagination
    ...Array.from({ length: 20 }, (_, i) => ({
        id: `m${i + 5}`,
        startTime: new Date(Date.now() + (i + 2) * 12 * 60 * 60 * 1000).toISOString(),
        homeTeam: getTeam(`t${(i % 10) + 1}`),
        awayTeam: getTeam(`t${((i + 1) % 10) + 1}`),
        league: getLeague(`${(i % 5) + 1}`),
        odds: { home: 2.0 + i * 0.1, draw: 3.5, away: 3.0 - i * 0.1, over: 1.8, under: 2.0 },
        valueScore: 0.01 + i * 0.005,
    }))
];

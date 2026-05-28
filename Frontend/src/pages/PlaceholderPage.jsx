// src/pages/PlaceholderPage.jsx
// Used for routes not yet fully implemented
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const pageNames = {
  '/rooms': { emoji: '🏠', name: 'Rooms', desc: 'Discover and join study groups, project teams, and communities.' },
  '/tasks': { emoji: '✅', name: 'Tasks', desc: 'Manage your personal tasks and collaborate on shared to-do lists.' },
  '/calendar': { emoji: '📅', name: 'Calendar', desc: 'Track deadlines, events, and study sessions.' },
  '/quizzes': { emoji: '🧠', name: 'Quizzes', desc: 'Create and take quizzes to test your knowledge.' },
  '/notes': { emoji: '📝', name: 'Notes', desc: 'Rich collaborative notes and study materials.' },
  '/timer': { emoji: '⏱️', name: 'Study Timer', desc: 'Focused Pomodoro sessions to boost productivity.' },
  '/resources': { emoji: '📚', name: 'Resources', desc: 'Share and discover learning resources and links.' },
  '/people': { emoji: '👥', name: 'People', desc: 'Find and connect with other students and developers.' },
  '/leaderboard': { emoji: '🏆', name: 'Leaderboard', desc: 'Track your progress and compete with peers.' },
  '/settings': { emoji: '⚙️', name: 'Settings', desc: 'Customize your SyncMate experience.' },
};

export default function PlaceholderPage() {
  const location = useLocation();
  const page = pageNames[location.pathname] || { emoji: '🚧', name: 'Coming Soon', desc: 'This page is under construction.' };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: 'var(--bg-secondary)',
      padding: '2rem',
      textAlign: 'center',
    }}>
      {/* Mandala bg */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: 'var(--radius-2xl)',
        background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        marginBottom: '0.5rem',
      }}>
        {page.emoji}
      </div>
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
        fontSize: '1.5rem',
        color: 'var(--text-primary)',
      }}>
        {page.name}
      </h2>
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        maxWidth: 360,
        lineHeight: 1.7,
      }}>
        {page.desc}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.25rem',
        background: 'rgba(249,115,22,0.08)',
        borderRadius: 'var(--radius-full)',
        color: 'var(--saffron-600)',
        fontWeight: 600,
        fontSize: '0.85rem',
        marginTop: '0.5rem',
      }}>
        <Construction size={15} />
        Coming in next release
      </div>
    </div>
  );
}

// src/pages/Home.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, BookOpen, Timer, Trophy, ArrowRight, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useChatContext } from '../context/ChatContext.jsx';

const FEATURE_CARDS = [
  {
    icon: MessageCircle,
    title: 'Messages',
    description: 'Real-time chat with your team and study groups',
    path: '/chat',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
  },
  {
    icon: Users,
    title: 'Rooms',
    description: 'Join public rooms and communities',
    path: '/rooms',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    icon: BookOpen,
    title: 'Quizzes',
    description: 'Test your knowledge and challenge peers',
    path: '/quizzes',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    icon: Timer,
    title: 'Study Timer',
    description: 'Focus sessions with Pomodoro technique',
    path: '/timer',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const { conversations, totalUnread } = useChatContext();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: 'var(--bg-secondary)',
      padding: '2rem',
    }}>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316, #ea6f0a)',
        borderRadius: 'var(--radius-2xl)',
        padding: '2rem 2.5rem',
        marginBottom: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-saffron)',
      }}>
        {/* Mandala decoration */}
        <div style={{
          position: 'absolute',
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          opacity: 0.12,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='70' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='50' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='30' fill='none' stroke='white' stroke-width='1'/%3E%3Cpath d='M100 10 L100 190 M10 100 L190 100 M29 29 L171 171 M171 29 L29 171' stroke='white' stroke-width='0.7'/%3E%3C/svg%3E")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            {greeting},
          </p>
          <h2 style={{
            color: 'white',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: '1.8rem',
            marginBottom: '0.5rem',
          }}>
            {user?.name || user?.username || 'Welcome'} 🙏
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', maxWidth: 480 }}>
            You have {totalUnread > 0 ? `${totalUnread} unread messages` : 'no new messages'} and {conversations.length} active conversations.
          </p>

          <button
            onClick={() => navigate('/chat')}
            style={{
              marginTop: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              color: 'var(--saffron-600)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.6rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            Open Messages
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.75rem',
      }}>
        {[
          { label: 'Conversations', value: conversations.length, icon: MessageCircle },
          { label: 'Unread', value: totalUnread, icon: Zap },
          { label: 'Streak', value: '7 days', icon: Trophy },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon size={16} style={{ color: 'var(--saffron-500)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <h3 style={{
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        Quick Access
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {FEATURE_CARDS.map(({ icon: Icon, title, description, path, color, bg }) => (
          <button
            key={title}
            onClick={() => navigate(path)}
            style={{
              background: 'white',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
              color,
            }}>
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
              {title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

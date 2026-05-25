// src/components/ui/UserAvatar.jsx
import { getInitials, getUserColor } from '../../utils/helpers.js';

const sizeMap = {
  xs: 'width:24px;height:24px;font-size:0.6rem',
  sm: 'width:32px;height:32px;font-size:0.72rem',
  md: 'width:40px;height:40px;font-size:0.82rem',
  lg: 'width:48px;height:48px;font-size:0.95rem',
  xl: 'width:64px;height:64px;font-size:1.1rem',
  '2xl': 'width:80px;height:80px;font-size:1.3rem',
};

const statusDotSizeMap = {
  xs: '8px',
  sm: '10px',
  md: '11px',
  lg: '12px',
  xl: '13px',
  '2xl': '14px',
};

export default function UserAvatar({
  user,
  size = 'md',
  showStatus = false,
  status = 'offline',
  isGroup = false,
  groupIcon = null,
  className = '',
}) {
  const name = user?.name || user?.username || '';
  const initials = getInitials(name);
  const [color1, color2] = getUserColor(name);

  const sizeStyle = {
    xs: { width: 24, height: 24, fontSize: '0.6rem' },
    sm: { width: 32, height: 32, fontSize: '0.72rem' },
    md: { width: 40, height: 40, fontSize: '0.82rem' },
    lg: { width: 48, height: 48, fontSize: '0.95rem' },
    xl: { width: 64, height: 64, fontSize: '1.1rem' },
    '2xl': { width: 80, height: 80, fontSize: '1.3rem' },
  }[size] || { width: 40, height: 40, fontSize: '0.82rem' };

  const dotSize = statusDotSizeMap[size] || '11px';

  return (
    <div
      className={`avatar ${className}`}
      style={{ width: sizeStyle.width, height: sizeStyle.height }}
    >
      {isGroup ? (
        <div
          className="avatar-group"
          style={{
            background: `linear-gradient(135deg, #6366f1, #4f46e5)`,
            color: 'white',
            fontSize: sizeStyle.fontSize,
            fontWeight: 700,
          }}
        >
          {groupIcon || '#'}
        </div>
      ) : user?.avatar ? (
        <img
          src={user.avatar}
          alt={name}
          className="avatar-img"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      {!isGroup && (
        <div
          className="avatar-fallback"
          style={{
            background: `linear-gradient(135deg, ${color1}, ${color2})`,
            fontSize: sizeStyle.fontSize,
            display: user?.avatar ? 'none' : 'flex',
          }}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={`status-dot ${status}`}
          style={{ width: dotSize, height: dotSize }}
        />
      )}
    </div>
  );
}

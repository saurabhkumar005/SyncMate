// src/components/ui/NotificationBadge.jsx

export default function NotificationBadge({ count, className = '' }) {
  if (!count || count === 0) return null;
  return (
    <span className={`unread-badge ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

// src/components/ui/EmptyState.jsx
import { MessageCircle } from 'lucide-react';

export default function EmptyState({
  icon: Icon = MessageCircle,
  title = 'Nothing here yet',
  description = '',
  action = null,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div style={{ position: 'relative', zIndex: 1 }}>{action}</div>}
    </div>
  );
}

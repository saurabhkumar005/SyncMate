// src/utils/helpers.js

/**
 * Format a timestamp for display in messages and chat list
 */
export function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

/**
 * Format file size in KB / MB
 */
export function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get initials from a name
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a consistent color for a user based on their name
 */
export function getUserColor(name) {
  const colors = [
    ['#f97316', '#ea6f0a'],
    ['#6366f1', '#4f46e5'],
    ['#22c55e', '#16a34a'],
    ['#ec4899', '#db2777'],
    ['#14b8a6', '#0d9488'],
    ['#f59e0b', '#d97706'],
    ['#8b5cf6', '#7c3aed'],
    ['#ef4444', '#dc2626'],
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Group messages by date for rendering dividers
 */
export function groupMessagesByDate(messages) {
  const groups = {};
  messages.forEach((msg) => {
    const date = new Date(msg.created_at || msg.timestamp || Date.now());
    const key = date.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  });
  return groups;
}

/**
 * Format date label for message dividers
 */
export function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Detect file type category from filename
 */
export function getFileType(filename) {
  if (!filename) return 'default';
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'img';
  if (ext === 'pdf') return 'pdf';
  if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'zip';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'default';
}

/**
 * Debounce utility
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

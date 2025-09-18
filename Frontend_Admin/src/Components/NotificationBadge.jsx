import React from 'react';
import './NotificationBadge.css';

const NotificationBadge = ({ count, className = '', style = {} }) => {
  if (!count || count === 0) return null;

  return (
    <span
      className={`notification-badge ${className}`}
      style={style}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;

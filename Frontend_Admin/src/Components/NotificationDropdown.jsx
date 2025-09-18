import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import NotificationBadge from './NotificationBadge';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const { notifications, updateLastVisit, clearNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notificationItems = [
    { key: 'enquiries', label: 'Enquiries', path: '/adminenquiries', icon: '📝' },
    { key: 'newsletter', label: 'Newsletter', path: '/newsletteradmin', icon: '📧' },
    { key: 'plannedTrips', label: 'Planned Trips', path: '/homeplannedtrips', icon: '🗺️' },
    { key: 'customQuotes', label: 'Custom Quotes', path: '/admincustomquotes', icon: '💰' },
    { key: 'packageCallback', label: 'Package Callback', path: '/packageCallback', icon: '📦' },
    { key: 'destinationCallback', label: 'Destination Callback', path: '/destinationCallback', icon: '🏖️' },
    { key: 'activityCallback', label: 'Activity Callback', path: '/activityCallback', icon: '🎯' },
    { key: 'popupEnquiries', label: 'Popup Enquiries', path: '/adminpopupenquiries', icon: '💬' },
    { key: 'contact', label: 'Contact Enquiries', path: '/managecontact', icon: '📞' }
  ];

  const handleNotificationClick = (item) => {
    updateLastVisit(item.key);
    clearNotification(item.key);
    setIsOpen(false);
    // Navigate to the page (you might want to use React Router here)
    window.location.href = item.path;
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="notification-icon">🔔</span>
        {notifications.total > 0 && (
          <NotificationBadge
            count={notifications.total}
            className="navbar-badge"
          />
        )}
      </button>

      {isOpen && (
        <div className="notification-menu">
          <div className="notification-header">
            <h3>Notifications</h3>
            <span className="notification-count">{notifications.total} new</span>
          </div>

          <div className="notification-list">
            {notificationItems.map((item) => {
              const count = notifications[item.key];
              if (count === 0) return null;

              return (
                <div
                  key={item.key}
                  className="notification-item"
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="notification-icon">{item.icon}</div>
                  <div className="notification-content">
                    <div className="notification-title">{item.label}</div>
                    <div className="notification-description">
                      {count} new {count === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                  <NotificationBadge count={count} className="small" />
                </div>
              );
            })}

            {notifications.total === 0 && (
              <div className="notification-empty">
                <div className="notification-icon">✅</div>
                <div className="notification-content">
                  <div className="notification-title">All caught up!</div>
                  <div className="notification-description">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

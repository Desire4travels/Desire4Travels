import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    enquiries: 0,
    newsletter: 0,
    plannedTrips: 0,
    customQuotes: 0,
    packageCallback: 0,
    destinationCallback: 0,
    activityCallback: 0,
    popupEnquiries: 0,
    contact: 0,
    total: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const countFetchers = [
        {
          key: 'enquiries',
          section: 'enquiries',
          url: 'https://desire4travels-1.onrender.com/api/admin/enquiries',
          dateKey: 'submittedAt'
        },
        {
          key: 'newsletter',
          section: 'newsletter',
          url: 'https://desire4travels-1.onrender.com/api/admin/newsletter',
          dateKey: 'subscribedAt'
        },
        {
          key: 'plannedTrips',
          section: 'plannedTrips',
          url: 'https://desire4travels-1.onrender.com/api/admin/planned-trips',
          dateKey: 'createdAt'
        },
        {
          key: 'customQuotes',
          section: 'customQuotes',
          url: 'https://desire4travels-1.onrender.com/api/admin/custom-quotes',
          dateKey: 'createdAt'
        },
        {
          key: 'packageCallback',
          section: 'callback-package',
          url: 'https://desire4travels-1.onrender.com/callback-package',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'destinationCallback',
          section: 'callback-destination',
          url: 'https://desire4travels-1.onrender.com/callback-destination',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'activityCallback',
          section: 'activityCallback',
          url: 'https://desire4travels-1.onrender.com/activity-callback',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'popupEnquiries',
          section: 'popupEnquiries',
          url: 'https://desire4travels-1.onrender.com/api/popup-enquiries',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'contact',
          section: 'contact-us',
          url: 'https://desire4travels-1.onrender.com/contact-us',
          dateKey: 'createdAt._seconds'
        }
      ];

      const newCounts = {};
      let total = 0;

      for (let { key, section, url, dateKey } of countFetchers) {
        try {
          const visitRes = await axios.get('https://desire4travels-1.onrender.com/api/last-visit', {
            params: { section }
          });
          const lastVisit = visitRes.data.lastVisited ? new Date(visitRes.data.lastVisited) : null;

          const dataRes = await axios.get(url);
          const items = dataRes.data;

          const count = items.filter(item => {
            const raw = dateKey.split('.').reduce((obj, k) => obj?.[k], item);
            const itemDate = raw ? new Date(raw * 1000 || raw) : null;
            return lastVisit && itemDate && itemDate > lastVisit;
          }).length;

          newCounts[key] = count;
          total += count;
        } catch (err) {
          console.error(`${key} fetch failed:`, err);
          newCounts[key] = 0;
        }
      }

      newCounts.total = total;
      setNotifications(newCounts);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLastVisit = async (section) => {
    try {
      await axios.post('https://desire4travels-1.onrender.com/api/last-visit', { section });
      // Refresh notifications after updating last visit
      await fetchNotifications();
    } catch (error) {
      console.error('Error updating last visit:', error);
    }
  };

  const clearNotification = (section) => {
    setNotifications(prev => ({
      ...prev,
      [section]: 0,
      total: prev.total - prev[section]
    }));
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    isLoading,
    fetchNotifications,
    updateLastVisit,
    clearNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

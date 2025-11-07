import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Filter, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import './NotificationBell.css';

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Actualizar cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user, filter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();
      if (filter !== 'all') {
        if (filter === 'unread') params.append('isRead', 'false');
        else if (['info', 'success', 'warning', 'error'].includes(filter)) {
          params.append('type', filter);
        }
      }

      const response = await fetch(`/api/notifications?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } else {
        console.error('Error al obtener notificaciones:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Marcada como leída');
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      toast.error('Error al marcar como leída');
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(notifications.map(notif => ({
          ...notif,
          isRead: true,
          readAt: new Date().toISOString()
        })));
        setUnreadCount(0);
        toast.success(`${data.modifiedCount} notificaciones marcadas como leídas`);
      }
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      toast.error('Error al marcar todas como leídas');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const deletedNotif = notifications.find(n => n._id === notificationId);
        setNotifications(notifications.filter(n => n._id !== notificationId));
        
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast.success('Notificación eliminada');
      }
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      toast.error('Error al eliminar notificación');
    }
  };

  const deleteAllRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/read/all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(notifications.filter(n => !n.isRead));
        toast.success(`${data.deletedCount} notificaciones eliminadas`);
      }
    } catch (error) {
      console.error('Error al eliminar notificaciones:', error);
      toast.error('Error al eliminar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: { emoji: '✅', color: '#10b981' },
      warning: { emoji: '⚠️', color: '#f59e0b' },
      error: { emoji: '❌', color: '#ef4444' },
      info: { emoji: 'ℹ️', color: '#3b82f6' }
    };
    return icons[type] || icons.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: es 
      });
    } catch (error) {
      return 'hace un momento';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  if (!user) return null;

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div className="header-left">
              <h3>Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="unread-indicator">{unreadCount} sin leer</span>
              )}
            </div>
            <div className="header-actions">
              <button 
                className="action-btn"
                onClick={() => setShowFilters(!showFilters)}
                title="Filtros"
              >
                <Filter size={16} />
              </button>
              {unreadCount > 0 && (
                <button 
                  className="action-btn"
                  onClick={markAllAsRead}
                  disabled={loading}
                  title="Marcar todas como leídas"
                >
                  <CheckCheck size={16} />
                </button>
              )}
              <button 
                className="action-btn"
                onClick={deleteAllRead}
                disabled={loading}
                title="Eliminar leídas"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="notification-filters">
              {['all', 'unread', 'info', 'success', 'warning', 'error'].map(filterType => (
                <button
                  key={filterType}
                  className={`filter-btn ${filter === filterType ? 'active' : ''}`}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType === 'all' ? 'Todas' :
                   filterType === 'unread' ? 'Sin leer' :
                   filterType === 'info' ? 'Info' :
                   filterType === 'success' ? 'Éxito' :
                   filterType === 'warning' ? 'Alerta' : 'Error'}
                </button>
              ))}
            </div>
          )}

          <div className="notification-list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={48} />
                <p>
                  {filter === 'unread' ? 'No tienes notificaciones sin leer' :
                   filter !== 'all' ? `No tienes notificaciones de tipo ${filter}` :
                   'No tienes notificaciones'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const iconData = getNotificationIcon(notification.type);
                return (
                  <div 
                    key={notification._id}
                    className={`notification-item ${!notification.isRead ? 'unread' : ''} priority-${notification.priority}`}
                  >
                    <div className="notification-content">
                      <div 
                        className="notification-icon"
                        style={{ color: iconData.color }}
                      >
                        {iconData.emoji}
                      </div>
                      <div className="notification-text">
                        <div className="notification-header-inline">
                          <h4>{notification.title}</h4>
                          <div className="notification-meta">
                            <span 
                              className="priority-indicator"
                              style={{ backgroundColor: getPriorityColor(notification.priority) }}
                            ></span>
                            <span className="category-badge">{notification.category}</span>
                          </div>
                        </div>
                        <p>{notification.message}</p>
                        <div className="notification-footer">
                          <span className="notification-time">
                            {formatDate(notification.createdAt)}
                          </span>
                          {notification.actionUrl && (
                            <a 
                              href={notification.actionUrl}
                              className="action-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ver más
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button
                          className="action-btn mark-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          title="Marcar como leída"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        title="Eliminar"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="notification-footer">
              <p className="notification-count">
                Mostrando {filteredNotifications.length} de {notifications.length} notificaciones
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

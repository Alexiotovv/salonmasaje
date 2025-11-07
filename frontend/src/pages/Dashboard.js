import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { Bell, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas y notificaciones recientes en paralelo
      const [statsResponse, notificationsResponse] = await Promise.all([
        notificationService.getStats(),
        notificationService.getNotifications({ limit: 5 })
      ]);
      
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
      
      if (notificationsResponse.success) {
        setRecentNotifications(notificationsResponse.notifications);
      }
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      success: { icon: CheckCircle, color: '#10b981' },
      warning: { icon: AlertCircle, color: '#f59e0b' },
      error: { icon: AlertCircle, color: '#ef4444' },
      info: { icon: Bell, color: '#3b82f6' }
    };
    return icons[type] || icons.info;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <h2>Dashboard de Notificaciones</h2>
        <p>Bienvenido, {user?.name}. Aquí tienes un resumen de tus notificaciones.</p>
      </div>

      {/* Grid principal */}
      <div className="dashboard-grid">
        {/* Estadísticas generales */}
        <div className="dashboard-card">
          <h3>Estadísticas Generales</h3>
          
          {stats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#ef4444' }}>
                  {stats.unread}
                </div>
                <div className="stat-label">Sin leer</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#10b981' }}>
                  {stats.read}
                </div>
                <div className="stat-label">Leídas</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#6b7280' }}>
                  {Math.round((stats.read / stats.total) * 100) || 0}%
                </div>
                <div className="stat-label">Progreso</div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No hay estadísticas disponibles</p>
          )}
        </div>

        {/* Estadísticas por tipo */}
        <div className="dashboard-card">
          <h3>Por Tipo de Notificación</h3>
          
          {stats && Object.keys(stats.byType).length > 0 ? (
            <div className="type-stats">
              {Object.entries(stats.byType).map(([type, data]) => {
                const typeIcon = getTypeIcon(type);
                const IconComponent = typeIcon.icon;
                
                return (
                  <div key={type} className="type-stat-item">
                    <div className="type-stat-header">
                      <IconComponent 
                        size={20} 
                        style={{ color: typeIcon.color }} 
                      />
                      <span className="type-name">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </div>
                    <div className="type-stat-numbers">
                      <span className="type-total">{data.total}</span>
                      {data.unread > 0 && (
                        <span className="type-unread">({data.unread} sin leer)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No hay notificaciones por tipo</p>
          )}
        </div>

        {/* Notificaciones recientes */}
        <div className="dashboard-card recent-notifications">
          <h3>Notificaciones Recientes</h3>
          
          {recentNotifications.length > 0 ? (
            <div className="recent-list">
              {recentNotifications.map((notification) => {
                const typeIcon = getTypeIcon(notification.type);
                const IconComponent = typeIcon.icon;
                
                return (
                  <div 
                    key={notification._id} 
                    className={`recent-item ${!notification.isRead ? 'unread' : ''}`}
                  >
                    <div className="recent-icon">
                      <IconComponent 
                        size={16} 
                        style={{ color: typeIcon.color }} 
                      />
                    </div>
                    
                    <div className="recent-content">
                      <div className="recent-title">{notification.title}</div>
                      <div className="recent-message">{notification.message}</div>
                      <div className="recent-date">
                        {formatDate(notification.createdAt)}
                      </div>
                    </div>
                    
                    {!notification.isRead && (
                      <div className="recent-unread-indicator"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-notifications">
              <Bell size={48} style={{ color: '#d1d5db' }} />
              <p>No tienes notificaciones recientes</p>
            </div>
          )}
        </div>

        {/* Estadísticas por categoría */}
        <div className="dashboard-card">
          <h3>Por Categoría</h3>
          
          {stats && Object.keys(stats.byCategory).length > 0 ? (
            <div className="category-stats">
              {Object.entries(stats.byCategory).map(([category, data]) => (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <span className="category-name">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <span className="category-total">{data.total}</span>
                  </div>
                  
                  <div className="category-progress">
                    <div 
                      className="category-progress-bar"
                      style={{ 
                        width: `${(data.total / stats.total) * 100}%`,
                        backgroundColor: '#3b82f6'
                      }}
                    ></div>
                  </div>
                  
                  {data.unread > 0 && (
                    <div className="category-unread">
                      {data.unread} sin leer
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No hay notificaciones por categoría</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

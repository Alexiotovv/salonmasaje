import React, { useState, useEffect } from 'react'
import './Dashboard.css'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    turnosHoy: 0,
    ingresosHoy: 0,
    personalActivo: 0,
    ocupacion: 0,
    clientesNuevos: 0,
    turnosRecientes: []
  })

  // Datos de ejemplo más atractivos
  const datosEjemplo = {
    turnosHoy: 8,
    ingresosHoy: 18500,
    personalActivo: 12,
    ocupacion: 85,
    clientesNuevos: 3,
    turnosRecientes: [
      {
        id: 1,
        hora: "14:30",
        chica: "Valentina 🔥",
        cliente: "Juan Pérez",
        servicio: "Hora Pasión",
        monto: 2000,
        estado: "completado",
        duracion: "60 min"
      },
      {
        id: 2,
        hora: "15:45",
        chica: "Sofía 💋",
        cliente: "Carlos López",
        servicio: "Media Hora de Placer",
        monto: 1200,
        estado: "en-progreso",
        duracion: "30 min"
      },
      {
        id: 3,
        hora: "16:20",
        chica: "Isabella 🌹",
        cliente: "Roberto García",
        servicio: "Noche de Fantasía",
        monto: 5000,
        estado: "pendiente",
        duracion: "120 min"
      },
      {
        id: 4,
        hora: "17:00",
        chica: "Camila ✨",
        cliente: "Miguel Torres",
        servicio: "Hora de Seducción",
        monto: 2500,
        estado: "completado",
        duracion: "60 min"
      },
      {
        id: 5,
        hora: "18:30",
        chica: "Gabriella 💫",
        cliente: "Alejandro Ruiz",
        servicio: "Experiencia Premium",
        monto: 3500,
        estado: "confirmado",
        duracion: "90 min"
      }
    ]
  }

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData(datosEjemplo)
    }, 800)

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        turnosHoy: Math.max(0, prev.turnosHoy + Math.floor(Math.random() * 3) - 1),
        ingresosHoy: Math.max(0, prev.ingresosHoy + Math.floor(Math.random() * 1000) - 300)
      }))
    }, 20000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const navegarA = (modulo) => {
    const mensajes = {
      'personal': '💃 Gestión de nuestras chicas especiales',
      'turnos': '📅 Agenda de encuentros especiales',
      'finanzas': '💰 Control de tesoro',
      'clientes': '👥 Nuestros caballeros preferidos',
      'servicios': '🎭 Catálogo de experiencias',
      'habitaciones': '🏨 Suite de fantasías'
    }
    alert(`💖 ${mensajes[modulo] || modulo}`)
  }

  const cerrarSesion = () => {
    if (window.confirm('💋 ¿Seguro que quieres salir, mi amor?')) {
      alert('Hasta pronto, te extrañaremos 💔')
    }
  }

  const formatearDinero = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto)
  }

  const getEstadoInfo = (estado) => {
    const estados = {
      'completado': { clase: 'completado', texto: '💖 Completado', icono: 'fas fa-heart' },
      'en-progreso': { clase: 'en-progreso', texto: '🔥 En Acción', icono: 'fas fa-fire' },
      'pendiente': { clase: 'pendiente', texto: '⏳ Esperando', icono: 'fas fa-hourglass-half' },
      'confirmado': { clase: 'confirmado', texto: '✅ Confirmado', icono: 'fas fa-check' }
    }
    return estados[estado] || { clase: '', texto: estado, icono: 'fas fa-circle' }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Sensual */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">💋</div>
          <h2>Las Cariñosas Melosas</h2>
          <p>Donde los sueños se hacen realidad</p>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <a href="#dashboard" className="nav-link">
                <i className="fas fa-crown"></i>
                <span>Mi Reino</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#personal" className="nav-link" onClick={() => navegarA('personal')}>
                <i className="fas fa-venus"></i>
                <span>Nuestras Diosas</span>
                <span className="nav-badge">{dashboardData.personalActivo}</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#turnos" className="nav-link" onClick={() => navegarA('turnos')}>
                <i className="fas fa-calendar-heart"></i>
                <span>Encuentros</span>
                <span className="nav-badge">{dashboardData.turnosHoy}</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#finanzas" className="nav-link" onClick={() => navegarA('finanzas')}>
                <i className="fas fa-gem"></i>
                <span>Tesoro</span>
                <span className="nav-badge">💎</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#clientes" className="nav-link" onClick={() => navegarA('clientes')}>
                <i className="fas fa-user-tie"></i>
                <span>Caballeros</span>
                <span className="nav-badge">👑</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#servicios" className="nav-link" onClick={() => navegarA('servicios')}>
                <i className="fas fa-magic"></i>
                <span>Experiencias</span>
                <span className="nav-badge">✨</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="user-panel">
          <div className="user-info">
            <div className="user-avatar">👑</div>
            <div className="user-details">
              <span className="user-name">Madame Melosa</span>
              <span className="user-role">Dueña & Manager</span>
            </div>
          </div>
          <button className="logout-btn" onClick={cerrarSesion} title="Cerrar sesión">
            <i className="fas fa-moon"></i>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-title">
            <h1>💖 Mi Reino Meloso</h1>
            <p>Controla la magia que ocurre detrás de cortinas...</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-seductor"
              onClick={() => navegarA('turnos')}
            >
              <i className="fas fa-plus-heart"></i>
              Nuevo Encuentro
            </button>
            <div className="notifications">
              <button className="notification-btn">
                <i className="fas fa-bell-heart"></i>
                <span className="notification-badge">5</span>
              </button>
            </div>
          </div>
        </header>

        {/* Métricas Mejoradas */}
        <section className="metrics-section">
          <div className="metrics-grid">
            <div className="metric-card sensual">
              <div className="metric-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData.turnosHoy}</h3>
                <p className="metric-label">Encuentros Hoy</p>
                <div className="metric-footer">
                  <span className="metric-trend positive">
                    <i className="fas fa-fire"></i>
                    +12% éxtasis
                  </span>
                </div>
              </div>
            </div>

            <div className="metric-card sensual">
              <div className="metric-icon">
                <i className="fas fa-gem"></i>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{formatearDinero(dashboardData.ingresosHoy)}</h3>
                <p className="metric-label">Tesoro Recolectado</p>
                <div className="metric-footer">
                  <span className="metric-trend positive">
                    <i className="fas fa-trending-up"></i>
                    +8% riqueza
                  </span>
                </div>
              </div>
            </div>

            <div className="metric-card sensual">
              <div className="metric-icon">
                <i className="fas fa-venus-double"></i>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData.personalActivo}</h3>
                <p className="metric-label">Diosas Activas</p>
                <div className="metric-footer">
                  <span className="metric-trend neutral">
                    <i className="fas fa-sparkles"></i>
                    listas para amar
                  </span>
                </div>
              </div>
            </div>

            <div className="metric-card sensual">
              <div className="metric-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData.ocupacion}%</h3>
                <p className="metric-label">Nivel de Pasión</p>
                <div className="metric-footer">
                  <span className="metric-trend positive">
                    <i className="fas fa-heart"></i>
                    +5% deseo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accesos Rápidos Mejorados */}
        <section className="quick-access-section">
          <h2 className="section-title">
            <i className="fas fa-bolt"></i>
            Acción Rápida
          </h2>
          <div className="quick-access-grid">
            <div 
              className="quick-access-card seductora"
              onClick={() => navegarA('personal')}
            >
              <div className="quick-access-icon">
                <i className="fas fa-venus"></i>
              </div>
              <h3>Gestión de Diosas</h3>
              <p>Administra a nuestras estrellas y sus horarios de magia</p>
              <span className="quick-access-badge">{dashboardData.personalActivo} reinas</span>
            </div>

            <div 
              className="quick-access-card seductora"
              onClick={() => navegarA('turnos')}
            >
              <div className="quick-access-icon">
                <i className="fas fa-calendar-plus"></i>
              </div>
              <h3>Nuevo Encuentro</h3>
              <p>Crea una cita mágica entre diosa y caballero</p>
              <span className="quick-access-badge">✨ instantáneo</span>
            </div>

            <div 
              className="quick-access-card seductora"
              onClick={() => navegarA('finanzas')}
            >
              <div className="quick-access-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Reportes de Tesoro</h3>
              <p>Controla ingresos, gastos y ganancias del reino</p>
              <span className="quick-access-badge">💎 brillante</span>
            </div>

            <div 
              className="quick-access-card seductora"
              onClick={() => navegarA('clientes')}
            >
              <div className="quick-access-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3>Caballeros VIP</h3>
              <p>Base de datos de nuestros hombres preferidos</p>
              <span className="quick-access-badge">👑 exclusivo</span>
            </div>
          </div>
        </section>

        {/* Turnos Recientes Mejorados */}
        <section className="recent-activity-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-history"></i>
              Encuentros Recientes
            </h2>
            <button 
              className="btn btn-ver-todos"
              onClick={() => navegarA('turnos')}
            >
              <i className="fas fa-eye"></i>
              Ver Todos los Encantos
            </button>
          </div>
          
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Hora Mágica</th>
                  <th>Nuestra Diosa</th>
                  <th>Caballero</th>
                  <th>Experiencia</th>
                  <th>Duración</th>
                  <th>Ofrenda</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.turnosRecientes.map(turno => {
                  const estadoInfo = getEstadoInfo(turno.estado)
                  return (
                    <tr key={turno.id} className="activity-row">
                      <td className="time-cell">🕒 {turno.hora}</td>
                      <td className="employee-cell">
                        <div className="employee-info">
                          <span className="employee-name">{turno.chica}</span>
                        </div>
                      </td>
                      <td className="client-cell">🤵 {turno.cliente}</td>
                      <td className="service-cell">{turno.servicio}</td>
                      <td className="duration-cell">{turno.duracion}</td>
                      <td className="amount-cell">{formatearDinero(turno.monto)}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${estadoInfo.clase}`}>
                          <i className={estadoInfo.icono}></i>
                          {estadoInfo.texto}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
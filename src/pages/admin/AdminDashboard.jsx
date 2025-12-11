import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, query, where, getCountFromServer, getDocs, limit, orderBy } from "firebase/firestore";
import { 
  Users, Calendar, MapPin, FileText, Briefcase, 
  ArrowRight, Phone, Clock, Activity 
} from "lucide-react"; // Iconos modernos
import "./Admin.css"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({ citasPendientes: 0, totalServicios: 0 });
  const [citasRecientes, setCitasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Contar Citas Pendientes
      const qCitas = query(collection(db, "citas"), where("estado", "==", "pendiente"));
      const snapCitas = await getCountFromServer(qCitas);
      
      // 2. Contar Servicios
      const qServicios = collection(db, "servicios");
      const snapServicios = await getCountFromServer(qServicios);
      
      // 3. Obtener Citas Recientes (5) ordenadas por fecha de creación (si tienes timestamp) o default
      // Nota: Si no tienes campo fechaCreacion, traerá las 5 primeras por defecto.
      const qRecientes = query(collection(db, "citas"), limit(5)); 
      const citasSnap = await getDocs(qRecientes);
      const recientes = citasSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      setStats({
        citasPendientes: snapCitas.data().count,
        totalServicios: snapServicios.data().count,
      });
      setCitasRecientes(recientes);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoClass = (estado) => {
    if (estado === 'confirmada') return 'status-confirmada';
    if (estado === 'cancelada') return 'status-cancelada';
    return 'status-pendiente';
  };

  if (loading) return (
    <div className="loading-admin">
      <div className="spinner-gold"></div>
      <p>Cargando Panel...</p>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Control</h1>
        <p className="admin-subtitle">Bienvenida, Dra. Tanya Shandal. Aquí está el resumen de hoy.</p>
      </div>

      {/* GRID DE ESTADÍSTICAS Y ACCESOS RÁPIDOS */}
      <div className="stats-grid">
        
        {/* Tarjeta Principal: Citas Pendientes */}
        <div className="stat-card highlight-card">
          <div className="card-header">
            <div className="icon-box gold">
              <Clock size={24} />
            </div>
            <span className="card-label">Por Atender</span>
          </div>
          <h2 className="stat-number">{stats.citasPendientes}</h2>
          <p className="stat-desc">Solicitudes pendientes de aprobación</p>
          <Link to="/admin/citas" className="card-link">Gestionar Citas <ArrowRight size={16} /></Link>
        </div>

        {/* Tarjeta Servicios */}
        <div className="stat-card">
          <div className="card-header">
            <div className="icon-box">
              <Activity size={24} />
            </div>
            <span className="card-label">Servicios Activos</span>
          </div>
          <h2 className="stat-number">{stats.totalServicios}</h2>
          <p className="stat-desc">Procedimientos disponibles en catálogo</p>
          <Link to="/admin/servicios" className="card-link">Ver Servicios <ArrowRight size={16} /></Link>
        </div>

        {/* Tarjeta Ubicación */}
        <div className="stat-card">
          <div className="card-header">
            <div className="icon-box">
              <MapPin size={24} />
            </div>
            <span className="card-label">Consultorio</span>
          </div>
          <h3 className="card-title-sm">Ubicación & Mapa</h3>
          <p className="stat-desc">Gestionar dirección y horarios</p>
          <Link to="/admin/ubicacion" className="card-link">Editar Mapa <ArrowRight size={16} /></Link>
        </div>

        {/* Tarjeta Blog */}
        <div className="stat-card">
          <div className="card-header">
            <div className="icon-box">
              <FileText size={24} />
            </div>
            <span className="card-label">Investigación</span>
          </div>
          <h3 className="card-title-sm">Blog Médico</h3>
          <p className="stat-desc">Publicar artículos y novedades</p>
          <Link to="/admin/investigacion" className="card-link">Ir al Blog <ArrowRight size={16} /></Link>
        </div>

        {/* Tarjeta CV */}
        <div className="stat-card">
          <div className="card-header">
            <div className="icon-box">
              <Briefcase size={24} />
            </div>
            <span className="card-label">Perfil</span>
          </div>
          <h3 className="card-title-sm">Curriculum Vitae</h3>
          <p className="stat-desc">Actualizar trayectoria profesional</p>
          <Link to="/admin/curriculum" className="card-link">Editar CV <ArrowRight size={16} /></Link>
        </div>

        {/* Tarjeta Contactos */}
        <div className="stat-card">
          <div className="card-header">
            <div className="icon-box">
              <Phone size={24} />
            </div>
            <span className="card-label">Contacto</span>
          </div>
          <h3 className="card-title-sm">Redes & Teléfonos</h3>
          <p className="stat-desc">Actualizar información de contacto</p>
          <Link to="/admin/contactos" className="card-link">Gestionar <ArrowRight size={16} /></Link>
        </div>
      </div>
      
      {/* SECCIÓN DE CITAS RECIENTES */}
      <section className="citas-recientes-section">
        <div className="section-header">
          <h2><Calendar size={20} /> Actividad Reciente</h2>
          <Link to="/admin/citas" className="view-all-link">Ver calendario completo</Link>
        </div>

        {citasRecientes.length === 0 ? (
          <div className="empty-state">
            <p>No hay actividad reciente registrada.</p>
          </div>
        ) : (
          <div className="citas-list-dashboard">
            {citasRecientes.map(cita => (
              <div key={cita.id} className="cita-reciente-item">
                <div className="cita-info">
                  <span className="cita-servicio">{cita.servicio}</span>
                  <span className="cita-paciente">{cita.userEmail}</span>
                </div>
                
                <div className="cita-meta">
                  <div className="cita-fecha">
                    <span>📅 {cita.fecha}</span>
                    <span>⏰ {cita.hora}</span>
                  </div>
                  <span className={`badge-status ${getEstadoClass(cita.estado)}`}>
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
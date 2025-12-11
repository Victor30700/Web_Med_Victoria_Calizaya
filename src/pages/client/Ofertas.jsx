import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/config";
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  onSnapshot, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Ofertas.css";

export default function Ofertas() {
  const [servicios, setServicios] = useState([]);
  const [horario, setHorario] = useState(null);
  const [cita, setCita] = useState({ fecha: "", hora: "", servicioId: "", servicioNombre: "" });
  const [loading, setLoading] = useState(true);
  
  // Estado para guardar las citas del usuario
  const [misCitas, setMisCitas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef(null); 
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Cargar Servicios y Horario (Solo una vez)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const servData = await getDocs(collection(db, "servicios"));
        setServicios(servData.docs.map(d => ({ ...d.data(), id: d.id })));
        
        const configSnap = await getDoc(doc(db, "configuracion", "horarioGeneral"));
        if(configSnap.exists()) setHorario(configSnap.data());
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // 2. ESCUCHAR CITAS DEL USUARIO EN TIEMPO REAL
  useEffect(() => {
    if (!user) {
      setMisCitas([]);
      return;
    }

    const q = query(
      collection(db, "citas"), 
      where("userId", "==", user.uid),
      orderBy("creadoEn", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const citasData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMisCitas(citasData);
    }, (error) => {
      console.error("⚠️ Error obteniendo citas:", error);
      if (error.code === 'failed-precondition') {
          console.warn("FALTA ÍNDICE: Copia el link de arriba en tu navegador para crearlo.");
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Función auxiliar para seleccionar servicio
  const seleccionarServicio = (servicio) => {
    setCita({ ...cita, servicioId: servicio.id, servicioNombre: servicio.nombre });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Manejar Reserva
  const reservarCita = async (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire({
        icon: 'warning', 
        title: 'Inicia sesión', 
        text: 'Debes estar registrado para agendar.',
        confirmButtonColor: '#1a1a1a' // Negro elegante
      }).then(() => navigate("/login"));
    }

    if (!cita.fecha || !cita.hora || !cita.servicioId) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'Faltan datos', 
        text: 'Selecciona fecha y hora.',
        confirmButtonColor: '#D4AF37' // Dorado alerta
      });
    }

    // Validación de horario
    if (horario) {
      if (cita.hora < horario.entrada || cita.hora > horario.salida) {
        return Swal.fire({ 
          icon: 'error', 
          title: 'Horario no disponible', 
          text: `Atención de ${horario.entrada} a ${horario.salida}.`,
          confirmButtonColor: '#ef4444'
        });
      }
    }

    const result = await Swal.fire({
      title: '¿Confirmar reserva?',
      html: `
        <div style="text-align:left; font-size: 1rem; color: #334155;">
          <p><strong>Servicio:</strong> ${cita.servicioNombre}</p>
          <p><strong>Fecha:</strong> ${cita.fecha}</p>
          <p><strong>Hora:</strong> ${cita.hora}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agendar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1a1a1a', // Negro
      cancelButtonColor: '#94a3b8'
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "citas"), {
        userId: user.uid,
        userEmail: user.email,
        servicio: cita.servicioNombre,
        fecha: cita.fecha,
        hora: cita.hora,
        estado: "pendiente",
        creadoEn: serverTimestamp() 
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud Enviada!',
        text: 'Tu cita ha quedado registrada y está en espera de la respuesta del admin.',
        timer: 3000,
        showConfirmButton: false
      });

      setCita({ fecha: "", hora: "", servicioId: "", servicioNombre: "" }); 

    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar la cita.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (estado) => {
    if (estado === 'confirmada') return 'Confirmada';
    if (estado === 'cancelada') return 'Cancelada';
    return 'En espera';
  };

  const getStatusIcon = (estado) => {
    if (estado === 'confirmada') return '✅';
    if (estado === 'cancelada') return '❌';
    return '⏳';
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-gold"></div>
      <p>Cargando servicios médicos...</p>
    </div>
  );

  return (
    <div className="ofertas-container fade-in">
      <header className="ofertas-header slide-up">
        <h1>Agenda tu Salud</h1>
        <div className="gold-divider-small"></div>
        <p>Selecciona un servicio profesional y reserva tu horario ideal.</p>
      </header>

      <div ref={formRef}></div>

      {/* FORMULARIO FLOTANTE (Diseño Luxury) */}
      {cita.servicioId && (
        <div className="reserva-wrapper pop-in">
          <div className="reserva-card-luxury">
            <div className="reserva-header-luxury">
              <h3>Completar Reserva</h3>
              <span className="reserva-servicio-gold">{cita.servicioNombre}</span>
            </div>
            
            <form onSubmit={reservarCita} className="reserva-form">
              <div className="form-row">
                <div className="form-group">
                  <label>📅 Fecha de Cita</label>
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]} 
                    value={cita.fecha} 
                    onChange={e => setCita({...cita, fecha: e.target.value})} 
                    className="input-luxury"
                  />
                </div>
                <div className="form-group">
                  <label>⏰ Hora Preferida</label>
                  <input 
                    type="time" 
                    required 
                    value={cita.hora} 
                    onChange={e => setCita({...cita, hora: e.target.value})} 
                    className="input-luxury"
                  />
                </div>
              </div>

              <div className="botones-reserva">
                <button type="button" onClick={() => setCita({ fecha: "", hora: "", servicioId: "", servicioNombre: "" })} className="btn-cancelar-luxury" disabled={isSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar-luxury" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner-mini"></span> : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE SERVICIOS */}
      <div className="servicios-grid">
        {servicios.map((servicio, index) => (
          <div key={servicio.id} className="card-servicio-luxury slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-icon-luxury">
              <span className="card-icon-gold">🩺</span>
            </div>
            <div className="card-content">
              <h3>{servicio.nombre}</h3>
              <div className="card-details-luxury">
                <div className="detail-item">
                  <span className="label">Precio</span>
                  <span className="value-gold">{servicio.precio} Bs</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duración</span>
                  <span className="value-text">{servicio.duracion} min</span>
                </div>
              </div>
              <button 
                className="btn-agendar-luxury"
                onClick={() => seleccionarServicio(servicio)}
                disabled={isSubmitting}
              >
                Reservar Cita
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- LISTA DE CITAS DEL USUARIO --- */}
      {user && (
        <div className="mis-citas-section slide-up delay-2">
          <div className="section-header-luxury">
            <h2>📋 Mis Citas Agendadas</h2>
          </div>

          {misCitas.length === 0 ? (
            <div className="no-citas-luxury">
              <div className="icon-empty-gold">📅</div>
              <p>No tienes citas programadas o no se pudieron cargar.</p>
              <small>Si acabas de registrar una y no aparece, verifica tu conexión.</small>
            </div>
          ) : (
            <div className="citas-user-grid">
              {misCitas.map(c => (
                <div key={c.id} className={`cita-user-card-luxury status-${c.estado}`}>
                  <div className="cita-header-card">
                    <span className="cita-fecha">📅 {c.fecha}</span>
                    <span className={`status-badge-luxury badge-${c.estado}`}>
                      {getStatusIcon(c.estado)} {getStatusLabel(c.estado)}
                    </span>
                  </div>

                  <div className="cita-body-card">
                    <h4 className="cita-servicio-name">{c.servicio}</h4>
                    <p className="cita-hora">Horario: <strong>{c.hora}</strong></p>
                  </div>
                  
                  {c.estado === 'pendiente' && (
                    <div className="cita-footer-pendiente-luxury">
                      <div className="pulse-dot-gold"></div>
                      <span>En espera de confirmación</span>
                    </div>
                  )}
                  
                  {c.estado === 'confirmada' && (
                    <div className="cita-footer-confirmada-luxury">
                      <span>¡Todo listo! Te esperamos.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
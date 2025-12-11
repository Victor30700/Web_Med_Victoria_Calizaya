import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "./GestionContactos.css"; // Nuevo archivo CSS específico

export default function GestionContactos() {
  const [contacto, setContacto] = useState({
    telefono: "",
    whatsapp: "", // Solo números para el link
    email: "",
    direccion: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    horarioAtencion: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacto = async () => {
      try {
        const docRef = doc(db, "configuracion", "contacto");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setContacto(docSnap.data());
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchContacto();
  }, []);

  const guardarContacto = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "configuracion", "contacto"), contacto);
      Swal.fire({ 
        icon: 'success', 
        title: '¡Contactos Actualizados!', 
        text: 'La información se ha guardado correctamente.',
        timer: 2000, 
        showConfirmButton: false,
        confirmButtonColor: '#00a896'
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la información.', 'error');
    }
  };

  if (loading) return (
    <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información de contacto...</p>
    </div>
  );

  return (
    <div className="admin-container fade-in">
      <header className="admin-header">
        <h1>📞 Gestión de Contactos</h1>
        <p>Configura los canales de comunicación para que tus pacientes puedan encontrarte fácilmente.</p>
      </header>

      <form onSubmit={guardarContacto} className="contactos-form-grid">
        
        {/* SECCIÓN 1: INFORMACIÓN DIRECTA */}
        <section className="card-admin">
            <div className="card-header">
                <h2>🏢 Información del Consultorio</h2>
            </div>
            <div className="card-body">
                <div className="form-grid">
                    <div className="form-group">
                        <label><i className="icon-label">📞</i> Teléfono Fijo / Celular</label>
                        <input 
                            type="text" 
                            placeholder="Ej. +591 70000000" 
                            value={contacto.telefono} 
                            onChange={e => setContacto({...contacto, telefono: e.target.value})} 
                            className="input-modern" 
                        />
                        <small>Texto visible para llamadas.</small>
                    </div>

                    <div className="form-group">
                        <label><i className="icon-label">📱</i> WhatsApp (Link)</label>
                        <input 
                            type="number" 
                            placeholder="Ej. 59170000000" 
                            value={contacto.whatsapp} 
                            onChange={e => setContacto({...contacto, whatsapp: e.target.value})} 
                            className="input-modern" 
                        />
                        <small>Solo números, sin símbolos ni espacios (Código país + número).</small>
                    </div>

                    <div className="form-group full-width">
                        <label><i className="icon-label">✉️</i> Correo Electrónico</label>
                        <input 
                            type="email" 
                            placeholder="doctora@ejemplo.com" 
                            value={contacto.email} 
                            onChange={e => setContacto({...contacto, email: e.target.value})} 
                            className="input-modern" 
                        />
                    </div>

                    <div className="form-group full-width">
                        <label><i className="icon-label">📍</i> Dirección Física</label>
                        <input 
                            type="text" 
                            placeholder="Ej. Av. Las Américas #123, Edificio Médico..." 
                            value={contacto.direccion} 
                            onChange={e => setContacto({...contacto, direccion: e.target.value})} 
                            className="input-modern" 
                        />
                    </div>

                    <div className="form-group full-width">
                        <label><i className="icon-label">⏰</i> Horario de Atención</label>
                        <input 
                            type="text" 
                            placeholder="Ej. Lun - Vie: 8:00am - 12:00pm y 3:00pm - 7:00pm" 
                            value={contacto.horarioAtencion} 
                            onChange={e => setContacto({...contacto, horarioAtencion: e.target.value})} 
                            className="input-modern" 
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* SECCIÓN 2: REDES SOCIALES */}
        <section className="card-admin">
            <div className="card-header">
                <h2>🌐 Redes Sociales</h2>
            </div>
            <div className="card-body">
                <p className="helper-text">Pega aquí los enlaces completos a tus perfiles.</p>
                
                <div className="social-inputs">
                    <div className="form-group social-group facebook">
                        <label><i className="icon-label">📘</i> Facebook</label>
                        <input 
                            type="url" 
                            placeholder="https://facebook.com/tu-pagina" 
                            value={contacto.facebook} 
                            onChange={e => setContacto({...contacto, facebook: e.target.value})} 
                            className="input-modern" 
                        />
                    </div>
                    
                    <div className="form-group social-group instagram">
                        <label><i className="icon-label">📸</i> Instagram</label>
                        <input 
                            type="url" 
                            placeholder="https://instagram.com/tu-usuario" 
                            value={contacto.instagram} 
                            onChange={e => setContacto({...contacto, instagram: e.target.value})} 
                            className="input-modern" 
                        />
                    </div>

                    <div className="form-group social-group tiktok">
                        <label><i className="icon-label">🎵</i> TikTok</label>
                        <input 
                            type="url" 
                            placeholder="https://tiktok.com/@tu-usuario" 
                            value={contacto.tiktok} 
                            onChange={e => setContacto({...contacto, tiktok: e.target.value})} 
                            className="input-modern" 
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* BOTÓN DE ACCIÓN FLOTANTE O FINAL */}
        <div className="form-actions-bar">
            <button type="submit" className="btn-primary-admin large-btn">
                💾 Guardar Todos los Cambios
            </button>
        </div>

      </form>
    </div>
  );
}
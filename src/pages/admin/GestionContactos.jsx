import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "../admin/Admin.css"; 

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
      Swal.fire({ icon: 'success', title: '¡Contactos Actualizados!', timer: 2000, showConfirmButton: false });
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la información.', 'error');
    }
  };

  if (loading) return <div className="loading-admin">Cargando...</div>;

  return (
    <div className="admin-container">
      <h1>📞 Gestión de Contactos</h1>
      <p>Configura cómo pueden encontrarte tus pacientes.</p>

      <section className="card-admin">
        <form onSubmit={guardarContacto} className="form-curriculum">
          <h3>Información Directa</h3>
          <div className="form-group">
            <label>Teléfono Fijo / Celular (Texto visible):</label>
            <input type="text" placeholder="Ej. +591 70000000" value={contacto.telefono} onChange={e => setContacto({...contacto, telefono: e.target.value})} className="input-admin" />
          </div>
          <div className="form-group">
            <label>Número WhatsApp (Solo números para el enlace, ej. 59170000000):</label>
            <input type="number" placeholder="59170000000" value={contacto.whatsapp} onChange={e => setContacto({...contacto, whatsapp: e.target.value})} className="input-admin" />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input type="email" placeholder="doctora@ejemplo.com" value={contacto.email} onChange={e => setContacto({...contacto, email: e.target.value})} className="input-admin" />
          </div>
          <div className="form-group">
            <label>Dirección Escrita:</label>
            <input type="text" placeholder="Av. Las Américas #123..." value={contacto.direccion} onChange={e => setContacto({...contacto, direccion: e.target.value})} className="input-admin" />
          </div>
          <div className="form-group">
            <label>Horario de Atención (Texto):</label>
            <input type="text" placeholder="Lun - Vie: 8am - 6pm" value={contacto.horarioAtencion} onChange={e => setContacto({...contacto, horarioAtencion: e.target.value})} className="input-admin" />
          </div>

          <h3>Redes Sociales (Enlaces)</h3>
          <div className="form-group">
            <label>Facebook URL:</label>
            <input type="url" placeholder="https://facebook.com/..." value={contacto.facebook} onChange={e => setContacto({...contacto, facebook: e.target.value})} className="input-admin" />
          </div>
          <div className="form-group">
            <label>Instagram URL:</label>
            <input type="url" placeholder="https://instagram.com/..." value={contacto.instagram} onChange={e => setContacto({...contacto, instagram: e.target.value})} className="input-admin" />
          </div>
          <div className="form-group">
            <label>TikTok URL:</label>
            <input type="url" placeholder="https://tiktok.com/..." value={contacto.tiktok} onChange={e => setContacto({...contacto, tiktok: e.target.value})} className="input-admin" />
          </div>

          <button type="submit" className="btn-save-map">Guardar Contactos</button>
        </form>
      </section>
    </div>
  );
}
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "./Contactos.css";

export default function Contactos() {
  const [contacto, setContacto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacto = async () => {
      try {
        const docSnap = await getDoc(doc(db, "configuracion", "contacto"));
        if (docSnap.exists()) setContacto(docSnap.data());
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchContacto();
  }, []);

  if (loading) return <div className="loading-contactos"><div className="spinner"></div><p>Cargando información...</p></div>;

  if (!contacto) return <div className="contactos-container"><p>Información de contacto no disponible.</p></div>;

  return (
    <div className="contactos-container fade-in">
      <header className="contactos-header slide-up">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para atenderte. Elige el medio que prefieras.</p>
      </header>

      <div className="contactos-grid slide-up delay-1">
        {/* Tarjeta WhatsApp */}
        <div className="contacto-card whatsapp">
          <div className="icon">💬</div>
          <h3>WhatsApp</h3>
          <p>Escríbenos para consultas rápidas.</p>
          {contacto.whatsapp && (
            <a href={`https://wa.me/${contacto.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-contacto btn-ws">
              Enviar Mensaje
            </a>
          )}
        </div>

        {/* Tarjeta Teléfono */}
        <div className="contacto-card telefono">
          <div className="icon">📞</div>
          <h3>Llámanos</h3>
          <p>Atención directa y emergencias.</p>
          <p className="dato-contacto">{contacto.telefono || "No disponible"}</p>
        </div>

        {/* Tarjeta Email */}
        <div className="contacto-card email">
          <div className="icon">✉️</div>
          <h3>Correo Electrónico</h3>
          <p>Envíanos tus documentos o dudas.</p>
          <a href={`mailto:${contacto.email}`} className="dato-contacto link">{contacto.email || "No disponible"}</a>
        </div>

        {/* Tarjeta Horario */}
        <div className="contacto-card horario">
          <div className="icon">🕒</div>
          <h3>Horario de Atención</h3>
          <p className="dato-contacto">{contacto.horarioAtencion || "Consultar"}</p>
        </div>
      </div>

      {/* Redes Sociales */}
      <section className="sociales-section slide-up delay-2">
        <h2>Síguenos en Redes Sociales</h2>
        <div className="sociales-icons">
          {contacto.facebook && <a href={contacto.facebook} target="_blank" rel="noopener noreferrer" className="social-icon fb">Facebook</a>}
          {contacto.instagram && <a href={contacto.instagram} target="_blank" rel="noopener noreferrer" className="social-icon ig">Instagram</a>}
          {contacto.tiktok && <a href={contacto.tiktok} target="_blank" rel="noopener noreferrer" className="social-icon tk">TikTok</a>}
        </div>
      </section>
    </div>
  );
}
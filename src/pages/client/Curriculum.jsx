import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "./Curriculum.css";

export default function Curriculum() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN DE CONVERSIÓN (Lógica Thumbnail que funciona) ---
  const convertirLinkDrive = (url) => {
    if (!url) return "";
    
    if (url.includes("drive.google.com") && url.includes("/file/d/")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // Usamos thumbnail HD para garantizar visualización
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }
    return url;
  };

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const docRef = doc(db, "configuracion", "curriculum");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCvData(docSnap.data());
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  if (loading) return (
    <div className="loading-cv">
      <div className="spinner-gold"></div>
      <p>Cargando perfil profesional...</p>
    </div>
  );

  if (!cvData) {
    return (
      <div className="cv-container">
        <div className="cv-card empty fade-in">
          <div className="empty-icon-gold">⚖️</div>
          <h2>Perfil Profesional</h2>
          <p>La información del profesional aún no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-container fade-in">
      <div className="cv-card">
        {/* Cabecera elegante negra con borde dorado */}
        <div className="cv-luxury-header">
            <div className="gold-line"></div>
        </div>

        <header className="cv-header-content">
          
          {/* FOTO DE PERFIL CON BORDE DORADO */}
          {cvData.foto && (
            <div className="profile-gold-wrapper pop-in">
              <img 
                src={convertirLinkDrive(cvData.foto)} 
                alt="Dra. Victoria Calizaya" 
                className="profile-image"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="https://placehold.co/150?text=Dra.+Victoria";
                }}
              />
            </div>
          )}

          <div className="header-text slide-up">
            <h1>Dra. Victoria Calizaya</h1>
            <span className="gold-divider-small"></span>
            <p className="subtitle">Médico Cirujano - Medicina General</p>
          </div>
        </header>

        <div className="cv-body slide-up delay-1">
          <section className="cv-section bio-section">
            <h3 className="section-title">
              <span className="icon-gold">🩺</span> 
              Perfil Profesional
            </h3>
            <p>{cvData.descripcion || "Sin descripción disponible."}</p>
          </section>

          {/* --- NUEVA SECCIÓN: MISIÓN Y VISIÓN --- */}
          {(cvData.mision || cvData.vision) && (
            <div className="mision-vision-grid">
              {cvData.mision && (
                <div className="mv-card-luxury pop-in delay-2">
                  <div className="mv-icon-gold">🎯</div>
                  <h3>Misión</h3>
                  <p>{cvData.mision}</p>
                </div>
              )}
              {cvData.vision && (
                <div className="mv-card-luxury pop-in delay-3">
                  <div className="mv-icon-gold">👁️</div>
                  <h3>Visión</h3>
                  <p>{cvData.vision}</p>
                </div>
              )}
            </div>
          )}

          <section className="cv-section experience-section mt-4">
            <h3 className="section-title">
              <span className="icon-gold">🏥</span> 
              Experiencia y Logros
            </h3>
            <div className="experience-box-gold">
                <p>{cvData.experiencia || "Información pendiente de actualizar."}</p>
            </div>
          </section>
        </div>

        {cvData.enlace && (
          <div className="cv-footer slide-up delay-2">
            <a 
              href={cvData.enlace} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-download-gold"
            >
              📥 Descargar Currículum Vitae
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
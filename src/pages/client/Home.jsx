import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulación de carga profesional
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // Un poco más de tiempo para apreciar la carga
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="aesthetic-spinner"></div>
        <p className="loader-text">Dra. Tanya Shandal Tito Lipa</p>
        <span className="loader-sub">Cirugía Plástica & Reconstructiva</span>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* SECCIÓN HERO (Principal) */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="badge-specialty fade-in-up">Excelencia en Estética</span>
          <h1 className="title-animate">Dra. TANYA SHANDAL TITO LIPA</h1>
          <p className="hero-subtitle fade-up-delay-1">
            Especialista en Cirugía Plástica y Reconstructiva
          </p>
          <p className="hero-description fade-up-delay-2">
            Arte, ciencia y seguridad para resaltar tu mejor versión.
          </p>
          
          <div className="hero-buttons fade-up-delay-3">
            <Link to="/ofertas" className="btn-hero primary">
              <span>📅 Agendar Valoración</span>
            </Link>
            <Link to="/ubicacion" className="btn-hero secondary">
              <span>📍 Ver Consultorio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* SECCIÓN DE BIENVENIDA / FILOSOFÍA */}
      <section className="welcome-section fade-on-scroll">
        <div className="section-header">
          <span className="subtitle">NUESTRA FILOSOFÍA</span>
          <h2>Armonía y Perfección</h2>
          <div className="divider-gold"></div>
        </div>
        <p>
          La cirugía plástica no es solo transformar, es <strong>reconstruir la confianza</strong>. 
          En el consultorio de la Dra. Tanya Shandal, combinamos técnicas quirúrgicas de vanguardia 
          con una visión artística para lograr resultados naturales que respetan tu esencia.
        </p>
      </section>

      {/* SECCIÓN DE SERVICIOS DESTACADOS */}
      <section className="features-section">
        <div className="feature-card">
          <div className="card-icon">✨</div>
          <h3>Cirugía Estética</h3>
          <p>Procedimientos faciales y corporales diseñados para mejorar la armonía y belleza natural.</p>
        </div>

        <div className="feature-card highlight">
          <div className="card-icon">🩺</div>
          <h3>Reconstrucción</h3>
          <p>Soluciones quirúrgicas avanzadas para restaurar la función y la estética tras traumas o condiciones médicas.</p>
        </div>

        <div className="feature-card">
          <div className="card-icon">🛡️</div>
          <h3>Seguridad Total</h3>
          <p>Protocolos médicos estrictos, instalaciones certificadas y acompañamiento post-operatorio.</p>
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="cta-section">
        <h3>¿Listo para el cambio?</h3>
        <p>Agenda tu consulta hoy y da el primer paso.</p>
        <Link to="/ofertas" className="btn-hero outline-dark">
          Contactar Ahora
        </Link>
      </section>
    </div>
  );
}
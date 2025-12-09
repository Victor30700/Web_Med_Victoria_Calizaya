import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* SECCIÓN HERO (Principal) */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Dra. Victoria Calizaya</h1>
          <p>Especialista en Medicina General y Atención Integral.</p>
          <div className="hero-buttons">
            <Link to="/ofertas" className="btn-hero primary">Agendar Cita</Link>
            <Link to="/ubicacion" className="btn-hero secondary">Ver Ubicación</Link>
          </div>
        </div>
      </header>

      {/* SECCIÓN DE BIENVENIDA */}
      <section className="welcome-section">
        <h2>Tu salud es nuestra prioridad</h2>
        <p>
          En el consultorio de la Dra. Victoria Calizaya, nos dedicamos a brindar 
          atención médica de calidad con un enfoque humano y personalizado. 
          Contamos con instalaciones modernas y un compromiso total con tu bienestar.
        </p>
      </section>

      {/* SECCIÓN DE SERVICIOS RÁPIDOS */}
      <section className="features-section">
        <div className="feature-card">
          <h3>🩺 Diagnóstico Preciso</h3>
          <p>Evaluación médica completa con tecnología adecuada.</p>
        </div>
        <div className="feature-card">
          <h3>💊 Tratamiento Efectivo</h3>
          <p>Planes de recuperación adaptados a cada paciente.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Agenda Flexible</h3>
          <p>Horarios de atención de Lunes a Sábado.</p>
        </div>
      </section>
    </div>
  );
}
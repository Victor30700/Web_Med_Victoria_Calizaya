import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; 

export default function Navbar() {
  const { user, rol, logout } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar la visibilidad del menú en móviles
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Función para cerrar el menú después de hacer clic en un enlace (útil en móvil)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to={rol === "admin" ? "/admin" : "/"} onClick={handleLinkClick}>
          PerfilMed Victoria
        </Link>
      </div>

      {/* Botón de Hamburguesa para Móvil */}
      <button 
        className="menu-toggle" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? '✕' : '☰'} 
      </button>

      {/* El menú principal, dinámico para desktop y móvil */}
      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        
        {/* Menú para ADMINISTRADOR */}
        {user && rol === "admin" && (
          <>
            <li><Link to="/admin" onClick={handleLinkClick}>Panel Principal</Link></li>
            <li><Link to="/admin/servicios" onClick={handleLinkClick}>Gestionar Servicios</Link></li>
            <li><Link to="/admin/ubicacion" onClick={handleLinkClick}>Gestionar Ubicación</Link></li>
            <li><Link to="/admin/investigacion" onClick={handleLinkClick}>Gestionar Investigación</Link></li>
            <li><Link to="/admin/citas" onClick={handleLinkClick}>Gestionar Citas</Link></li>
            <li><Link to="/admin/curriculum" onClick={handleLinkClick}>Gestionar CV</Link></li>
            {/* ENLACE AGREGADO: */}
            <li><Link to="/admin/contactos" onClick={handleLinkClick}>Gestionar Contactos</Link></li>
          </>
        )}

        {/* Menú para CLIENTES (Usuarios normales) */}
        {user && rol === "cliente" && (
          <>
            <li><Link to="/" onClick={handleLinkClick}>Inicio</Link></li>
            <li><Link to="/sobre-mi" onClick={handleLinkClick}>Sobre Mí</Link></li>
            <li><Link to="/ubicacion" onClick={handleLinkClick}>Ubicación</Link></li>
            <li><Link to="/ofertas" onClick={handleLinkClick}>Oferta de Servicios</Link></li>
            <li><Link to="/investigacion" onClick={handleLinkClick}>Investigación</Link></li>
            <li><Link to="/contactos" onClick={handleLinkClick}>Contactos</Link></li>
          </>
        )}

        {/* Botón de Cerrar Sesión o Iniciar */}
        {user ? (
          <li><button onClick={handleLogout} className="btn-logout">Salir</button></li>
        ) : (
          <li><Link to="/login" onClick={handleLinkClick}>Ingresar</Link></li>
        )}
      </ul>
    </nav>
  );
}
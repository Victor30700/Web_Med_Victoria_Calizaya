import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; 

// Importación de iconos Lucide (versión moderna y ligera)
import { 
  Menu, X, LogOut, Home, User, MapPin, 
  Sparkles, FileText, Phone, LayoutDashboard, 
  Briefcase, GraduationCap, Stethoscope 
} from "lucide-react";

export default function Navbar() {
  const { user, rol, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estado para controlar la visibilidad del menú en móviles
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Función para cerrar el menú al hacer click en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGOTIPO */}
        <div className="logo">
          <Link to={rol === "admin" ? "/admin" : "/"} onClick={handleLinkClick}>
            <span className="logo-initials">TS</span>
            <span className="logo-text">DRA. TANYA SHANDAL</span>
          </Link>
        </div>

        {/* Botón de Hamburguesa para Móvil */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* ENLACES DE NAVEGACIÓN */}
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          
          {/* --- Menú ADMINISTRADOR --- */}
          {user && rol === "admin" && (
            <>
              <li>
                <Link to="/admin" onClick={handleLinkClick}>
                  <LayoutDashboard size={18} /> Panel
                </Link>
              </li>
              <li>
                <Link to="/admin/servicios" onClick={handleLinkClick}>
                  <Stethoscope size={18} /> Servicios
                </Link>
              </li>
              <li>
                <Link to="/admin/ubicacion" onClick={handleLinkClick}>
                  <MapPin size={18} /> Ubicación
                </Link>
              </li>
              <li>
                <Link to="/admin/investigacion" onClick={handleLinkClick}>
                  <FileText size={18} /> Investigación
                </Link>
              </li>
              <li>
                <Link to="/admin/curriculum" onClick={handleLinkClick}>
                  <GraduationCap size={18} /> CV
                </Link>
              </li>
              <li>
                <Link to="/admin/contactos" onClick={handleLinkClick}>
                  <Phone size={18} /> Contactos
                </Link>
              </li>
            </>
          )}

          {/* --- Menú CLIENTES (Público) --- */}
          {user && rol === "cliente" && (
            <>
              <li>
                <Link to="/" onClick={handleLinkClick}>
                  <Home size={18} /> Inicio
                </Link>
              </li>
              <li>
                <Link to="/sobre-mi" onClick={handleLinkClick}>
                  <User size={18} /> Dra. Tanya
                </Link>
              </li>
              <li>
                <Link to="/ofertas" onClick={handleLinkClick}>
                  <Sparkles size={18} /> Procedimientos
                </Link>
              </li>
              <li>
                <Link to="/investigacion" onClick={handleLinkClick}>
                  <FileText size={18} /> Investigación
                </Link>
              </li>
              <li>
                <Link to="/ubicacion" onClick={handleLinkClick}>
                  <MapPin size={18} /> Ubicación
                </Link>
              </li>
              <li>
                <Link to="/contactos" onClick={handleLinkClick}>
                  <Phone size={18} /> Contacto
                </Link>
              </li>
            </>
          )}

          {/* Botón de Sesión */}
          {user ? (
            <li className="logout-item">
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={18} /> <span>Salir</span>
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={handleLinkClick} className="btn-login">
                <User size={18} /> Ingresar
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
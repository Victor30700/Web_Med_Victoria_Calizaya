import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; 
import { ArrowRight, Loader2, User } from "lucide-react"; // Se eliminaron Mail y Lock
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 

    try {
      await login(email, password);
      
      // Alerta de éxito elegante
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
      
      Toast.fire({
        icon: 'success',
        title: '¡Bienvenido de nuevo!'
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      let mensajeError = "Ocurrió un error al intentar ingresar.";
      
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        mensajeError = "Credenciales incorrectas. Verifique su correo o contraseña.";
      } else if (err.code === "auth/too-many-requests") {
        mensajeError = "Demasiados intentos. Por favor espere unos minutos.";
      }

      // Alerta de error estilizada
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: mensajeError,
        confirmButtonColor: '#c5a059', // Color Dorado
        confirmButtonText: 'Intentar de nuevo'
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in-up">
        
        {/* Encabezado del Login */}
        <div className="login-header">
          <div className="icon-circle">
            <User size={32} />
          </div>
          <h2>Iniciar Sesión</h2>
          <span className="subtitle">Bienvenido al portal de la Dra. Tanya Shandal</span>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Input Correo (Sin icono) */}
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* Input Contraseña (Sin icono) */}
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {/* Botón Submit */}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="spinner-flex">
                <Loader2 className="spinner-animate" size={20} /> 
                <span>Validando...</span>
              </div>
            ) : (
              <div className="btn-content">
                <span>Ingresar al Sistema</span>
                <ArrowRight size={20} />
              </div>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="toggle-text">
            ¿Es tu primera vez aquí?
            <Link to="/register" className="btn-link">Crear cuenta de paciente</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
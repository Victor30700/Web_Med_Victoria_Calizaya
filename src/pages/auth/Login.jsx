import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential") setError("Correo o contraseña incorrectos.");
      else setError("Error al acceder. Intente nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Ingreso al Sistema</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
        </form>

        <p className="toggle-text">
          ¿Nuevo usuario?
          {/* Aquí está el botón/enlace que lleva al Registro */}
          <Link to="/register" className="btn-link"> Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
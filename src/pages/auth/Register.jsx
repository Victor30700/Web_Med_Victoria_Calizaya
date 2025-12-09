import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import "./Login.css"; // Reutilizamos los estilos del login

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 1. Crear usuario en Authentication
      const credencialUsuario = await signup(email, password);
      const user = credencialUsuario.user;

      // 2. Guardar datos extra en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        nombre: nombre,
        telefono: telefono,
        rol: "cliente",
        creadoEn: new Date()
      });

      alert("¡Registro exitoso! Bienvenido a PerfilMed.");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") setError("Este correo ya está registrado.");
      else if (err.code === "auth/weak-password") setError("La contraseña debe tener al menos 6 caracteres.");
      else setError("Error al registrarse. Intente nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Registro de Paciente</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Teléfono / Celular</label>
            <input 
              type="tel" 
              placeholder="Ej. 70123456"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required 
            />
          </div>
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
            Crear Cuenta
          </button>
        </form>

        <p className="toggle-text">
          ¿Ya tienes cuenta?
          <Link to="/login" className="btn-link"> Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
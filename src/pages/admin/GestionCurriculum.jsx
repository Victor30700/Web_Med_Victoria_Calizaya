import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "../admin/Admin.css"; 

export default function GestionCurriculum() {
  const [curriculum, setCurriculum] = useState({
    enlace: "",      // Enlace al documento (PDF/CV)
    foto: "",        // Enlace a la foto de perfil
    descripcion: "",
    experiencia: "",
    mision: "",      // Nuevo campo: Misión
    vision: ""       // Nuevo campo: Visión
  });
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN DE CONVERSIÓN PARA VITE/REACT ---
  // Transforma el link de "compartir" en un link de "imagen directa"
  const convertirLinkDrive = (url) => {
    if (!url) return "";
    
    // 1. Verificamos si es un link de Google Drive
    if (url.includes("drive.google.com") && url.includes("/file/d/")) {
      // 2. Extraemos el ID del archivo
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // 3. Usamos el endpoint 'thumbnail' con tamaño grande (w1000)
        // Este endpoint es el que mejor funciona en etiquetas <img> estándar
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }
    return url; // Si no es de Drive, lo dejamos igual
  };

  // Cargar datos
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const docRef = doc(db, "configuracion", "curriculum");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCurriculum(docSnap.data());
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, []);

  // Guardar datos
  const guardarCurriculum = async (e) => {
    e.preventDefault();
    
    if (curriculum.enlace && !curriculum.enlace.startsWith('http')) {
      return Swal.fire('Error', 'El enlace del documento debe ser válido.', 'warning');
    }

    try {
      await setDoc(doc(db, "configuracion", "curriculum"), curriculum);
      
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'Perfil actualizado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar.', 'error');
    }
  };

  if (loading) return <div className="loading-admin">Cargando...</div>;

  return (
    <div className="admin-container">
      <h1>🎓 Gestión de Perfil Profesional</h1>
      <p>Actualiza tu información, foto y el enlace a tu CV.</p>

      <section className="card-admin">
        <form onSubmit={guardarCurriculum} className="form-curriculum">
          
          {/* FOTO DE PERFIL */}
          <div className="form-group">
            <label>Enlace a Foto de Perfil (Google Drive):</label>
            <input 
              type="url" 
              placeholder="Pega el link de compartir de Google Drive..." 
              value={curriculum.foto || ""}
              onChange={e => setCurriculum({...curriculum, foto: e.target.value})}
              className="input-admin"
            />
            <small>
                El sistema convertirá automáticamente el enlace de Drive para que sea visible.
            </small>
          </div>

          {/* VISTA PREVIA */}
          {curriculum.foto && (
            <div className="foto-preview-container">
                <p>Vista previa:</p>
                <img 
                    // Usamos la función aquí
                    src={convertirLinkDrive(curriculum.foto)} 
                    alt="Vista previa perfil" 
                    className="foto-preview"
                    // Esto ayuda a evitar bloqueos de seguridad de Google
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/150?text=No+Visible";
                    }}
                />
            </div>
          )}

          <div className="form-group">
            <label>Enlace al Documento CV (PDF):</label>
            <input 
              type="url" 
              value={curriculum.enlace || ""}
              onChange={e => setCurriculum({...curriculum, enlace: e.target.value})}
              className="input-admin"
            />
          </div>

          <div className="form-group">
            <label>Resumen Profesional:</label>
            <textarea 
              rows="4"
              value={curriculum.descripcion || ""}
              onChange={e => setCurriculum({...curriculum, descripcion: e.target.value})}
              className="textarea-admin"
            ></textarea>
          </div>

          {/* NUEVOS CAMPOS: MISIÓN Y VISIÓN */}
          <div className="form-group">
            <label>Misión (Opcional):</label>
            <textarea 
              rows="3"
              placeholder="Describe tu misión profesional..."
              value={curriculum.mision || ""}
              onChange={e => setCurriculum({...curriculum, mision: e.target.value})}
              className="textarea-admin"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Visión (Opcional):</label>
            <textarea 
              rows="3"
              placeholder="Describe tu visión a futuro..."
              value={curriculum.vision || ""}
              onChange={e => setCurriculum({...curriculum, vision: e.target.value})}
              className="textarea-admin"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Experiencia Destacada:</label>
            <textarea 
              rows="3"
              value={curriculum.experiencia || ""}
              onChange={e => setCurriculum({...curriculum, experiencia: e.target.value})}
              className="textarea-admin"
            ></textarea>
          </div>

          <button type="submit" className="btn-save-map">Guardar Perfil</button>
        </form>
      </section>
    </div>
  );
}
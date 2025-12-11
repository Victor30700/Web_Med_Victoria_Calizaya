import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore";
import "./GestionInvestigacion.css"; 

export default function GestionInvestigacion() {
  const [articulos, setArticulos] = useState([]);
  const [nuevoArticulo, setNuevoArticulo] = useState({ titulo: "", contenido: "" });
  const [loading, setLoading] = useState(true);

  const articulosRef = collection(db, "investigacion");

  // 1. Cargar artículos ordenados por fecha
  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const q = query(articulosRef, orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setArticulos(docs);
    } catch (error) {
      console.warn("Posible falta de índice o error de red, cargando sin orden estricto:", error);
      const querySnapshot = await getDocs(articulosRef);
      const docs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setArticulos(docs);
    } finally {
      setLoading(false);
    }
  };

  // 2. Publicar nuevo artículo
  const publicarArticulo = async (e) => {
    e.preventDefault();
    if (!nuevoArticulo.titulo || !nuevoArticulo.contenido) return alert("Por favor, completa todos los campos para publicar.");

    try {
      await addDoc(articulosRef, {
        ...nuevoArticulo,
        fecha: serverTimestamp(),
        fechaLegible: new Date().toLocaleDateString()
      });
      setNuevoArticulo({ titulo: "", contenido: "" });
      fetchArticulos(); 
      alert("¡Artículo publicado con éxito!");
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  // 3. Eliminar artículo
  const eliminarArticulo = async (id) => {
    if(!confirm("¿Estás seguro de que deseas eliminar este artículo permanentemente?")) return;
    try {
      await deleteDoc(doc(db, "investigacion", id));
      setArticulos(articulos.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return (
    <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando panel de investigación...</p>
    </div>
  );

  return (
    <div className="admin-container fade-in">
      <header className="admin-header">
        <h1>📰 Gestión de Investigación</h1>
        <p>Comparte avances médicos, noticias y consejos de salud para mantener informados a tus pacientes.</p>
      </header>

      <div className="admin-content-grid">
        {/* FORMULARIO DE PUBLICACIÓN */}
        <section className="card-admin form-section">
            <div className="card-header">
                <h2>✍️ Crear Nueva Publicación</h2>
            </div>
            <div className="card-body">
                <form onSubmit={publicarArticulo} className="admin-form">
                    <div className="form-group">
                    <label htmlFor="titulo">Título del Artículo</label>
                    <input 
                        id="titulo"
                        type="text" 
                        placeholder="Ej: Avances en Cardiología Pediátrica..." 
                        value={nuevoArticulo.titulo}
                        onChange={e => setNuevoArticulo({...nuevoArticulo, titulo: e.target.value})}
                        className="input-modern"
                    />
                    </div>
                    <div className="form-group">
                    <label htmlFor="contenido">Contenido</label>
                    <textarea 
                        id="contenido"
                        placeholder="Escribe el cuerpo del artículo aquí..." 
                        rows="8"
                        value={nuevoArticulo.contenido}
                        onChange={e => setNuevoArticulo({...nuevoArticulo, contenido: e.target.value})}
                        className="textarea-modern"
                    ></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary-admin">
                            🚀 Publicar Artículo
                        </button>
                    </div>
                </form>
            </div>
        </section>

        {/* LISTADO DE ARTÍCULOS */}
        <section className="lista-articulos">
            <div className="section-header">
                <h2>📚 Publicaciones Recientes</h2>
                <span className="badge-count">{articulos.length} artículos</span>
            </div>
            
            {articulos.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No hay artículos publicados todavía.</p>
                    <small>¡Sé el primero en compartir conocimiento!</small>
                </div>
            ) : (
            <div className="grid-articulos">
                {articulos.map((art) => (
                <div key={art.id} className="articulo-admin-card hover-lift">
                    <div className="articulo-top-bar">
                        <span className="fecha-badge">📅 {art.fechaLegible}</span>
                    </div>
                    <div className="articulo-content">
                        <h3>{art.titulo}</h3>
                        <p className="articulo-preview">{art.contenido.substring(0, 120)}...</p>
                    </div>
                    <div className="articulo-actions">
                        <button onClick={() => eliminarArticulo(art.id)} className="btn-delete-icon" title="Eliminar artículo">
                            🗑 Eliminar
                        </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </section>
      </div>
    </div>
  );
}
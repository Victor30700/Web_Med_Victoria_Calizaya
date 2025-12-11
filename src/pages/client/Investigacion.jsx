import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import "./Investigacion.css";

export default function Investigacion() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const q = query(collection(db, "investigacion"), orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        setArticulos(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        // Fallback si falla el ordenamiento (por falta de índice en Firebase)
        const querySnapshot = await getDocs(collection(db, "investigacion"));
        setArticulos(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  if (loading) return (
    <div className="loading-blog">
        <div className="spinner-gold"></div>
        <p>Cargando investigaciones...</p>
    </div>
  );

  return (
    <div className="blog-container fade-in">
      <header className="blog-header slide-up">
        <h1>🔬 Investigación y Noticias</h1>
        <div className="gold-divider-small"></div>
        <p>Mantente informado con los últimos avances y consejos de salud.</p>
      </header>

      {articulos.length === 0 ? (
        <div className="empty-state-luxury slide-up delay-1">
          <div className="empty-icon-gold">📰</div>
          <p>Aún no hay artículos publicados. Vuelve pronto.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {articulos.map((articulo, index) => (
            <article 
                key={articulo.id} 
                className="blog-card-luxury slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="blog-content">
                <div className="blog-meta">
                    <span className="blog-date-luxury">
                        📅 {articulo.fechaLegible || "Reciente"}
                    </span>
                </div>
                <h2>{articulo.titulo}</h2>
                <div className="gold-line-card"></div>
                <p>{articulo.contenido}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import L from "leaflet"; 
import Swal from "sweetalert2"; 
// Iconos Premium
import { MapPin, Search, Save, Globe, Link as LinkIcon, Navigation } from "lucide-react";
import "./GestionUbicacion.css";

// --- CONFIGURACIÓN DEL ICONO ROJO (Lógica Intacta) ---
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- COMPONENTES AUXILIARES (Lógica Intacta) ---

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={redIcon}>
      <Popup>¡Aquí está el consultorio!</Popup>
    </Marker>
  );
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16); 
    }
  }, [center, map]);
  return null;
}

// --- COMPONENTE PRINCIPAL ---

export default function GestionUbicacion() {
  const defaultCenter = [-21.5355, -64.7296]; // Tarija, Bolivia
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleUrl, setGoogleUrl] = useState(""); 

  // Cargar ubicación guardada
  useEffect(() => {
    const fetchUbicacion = async () => {
      try {
        const docRef = doc(db, "configuracion", "ubicacion");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPosition({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.error("Error cargando ubicación:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUbicacion();
  }, []);

  // Lógica de Google Maps
  const buscarDesdeGoogle = () => {
    if (!googleUrl) return Swal.fire('Error', 'Pega un enlace primero', 'warning');

    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = googleUrl.match(regex);

    if (match && match.length >= 3) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      
      setPosition({ lat, lng }); 
      Swal.fire({
        icon: 'success',
        title: 'Ubicación encontrada',
        text: `Coordenadas detectadas: ${lat}, ${lng}`,
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Enlace no válido',
        text: 'Asegúrate de copiar el enlace completo de la barra de direcciones del navegador (debe contener las coordenadas @lat,lng).'
      });
    }
  };

  // Guardar en Firebase
  const guardarUbicacion = async () => {
    if (!position) return Swal.fire('Atención', 'Selecciona una ubicación en el mapa primero.', 'warning');
    
    try {
      await setDoc(doc(db, "configuracion", "ubicacion"), {
        lat: position.lat,
        lng: position.lng
      });
      Swal.fire({
        title: '¡Guardado!',
        text: 'La ubicación de la oficina ha sido actualizada.',
        icon: 'success',
        confirmButtonColor: '#c5a059'
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire('Error', 'No se pudo guardar la ubicación.', 'error');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-gold"></div>
      <p>Cargando mapa...</p>
    </div>
  );

  return (
    <div className="admin-container">
      <header className="admin-header fade-in-down">
        <h1>Gestión de Ubicación</h1>
        <p>Define dónde se encuentra tu consultorio para que los pacientes te encuentren.</p>
      </header>
      
      {/* SECCIÓN DE BÚSQUEDA POR GOOGLE MAPS */}
      <section className="search-box-card fade-in-up delay-1">
        <div className="card-header-simple">
          <h3><LinkIcon size={20} className="icon-gold" /> Importar desde Google Maps</h3>
          <p className="instruction-text">
            Pega el enlace de la barra de direcciones de Google Maps para localizar automáticamente.
          </p>
        </div>
        
        <div className="search-input-wrapper">
          <div className="input-group full-width">
            <div className="input-icon-container">
              <Globe size={18} className="input-icon" />
              <input 
                type="text" 
                className="input-admin-search"
                placeholder="Ej: https://www.google.com/maps/@-21.535,-64.729,15z..." 
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
              />
            </div>
            <button onClick={buscarDesdeGoogle} className="btn-search-gold">
              <Search size={18} /> Buscar
            </button>
          </div>
        </div>
      </section>

      {/* CONTENEDOR DEL MAPA */}
      <div className="map-section fade-in-up delay-2">
        <div className="map-frame">
          <MapContainer center={position || defaultCenter} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
            <MapUpdater center={position} />
          </MapContainer>
        </div>
      </div>

      {/* BARRA DE ACCIÓN INFERIOR */}
      <div className="action-bar fade-in-up delay-3">
        <div className="coords-display">
          <Navigation size={20} className="icon-nav" />
          <div className="coords-text">
            {position ? (
              <>
                <span className="label">Coordenadas Actuales:</span>
                <span className="value">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</span>
              </>
            ) : (
              <span className="placeholder-text">Haz clic en el mapa para marcar la ubicación.</span>
            )}
          </div>
        </div>
        <button onClick={guardarUbicacion} className="btn-save-gold">
          <Save size={18} /> Guardar Ubicación
        </button>
      </div>
    </div>
  );
}
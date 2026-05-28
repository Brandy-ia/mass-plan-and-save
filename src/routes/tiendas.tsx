import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Clock, Phone, Search, LocateFixed, Loader2 } from "lucide-react";

export const Route = createFileRoute("/tiendas")({
  component: Tiendas,
});

type Tienda = {
  id: string;
  nombre: string;
  dir: string;
  lat: number;
  lng: number;
  abierto: boolean;
  hora: string;
  tel: string;
};

// Tiendas Mass reales en San Juan de Lurigancho (coords aproximadas para demo)
const TIENDAS: Tienda[] = [
  { id: "1", nombre: "Mass Av. Los Próceres", dir: "Av. Los Próceres 234, S.J.L.", lat: -11.9893, lng: -77.0035, abierto: true, hora: "Cierra 10:00 PM", tel: "01 234-5678" },
  { id: "2", nombre: "Mass Canto Grande", dir: "Av. Canto Grande 1820, S.J.L.", lat: -11.9712, lng: -76.9968, abierto: true, hora: "Cierra 11:00 PM", tel: "01 234-5679" },
  { id: "3", nombre: "Mass Las Flores", dir: "Jr. Las Flores 456, S.J.L.", lat: -11.9821, lng: -77.0102, abierto: false, hora: "Abre 7:00 AM", tel: "01 234-5680" },
  { id: "4", nombre: "Mass Mariscal Cáceres", dir: "Av. Mariscal Cáceres 1290, S.J.L.", lat: -11.9580, lng: -76.9897, abierto: true, hora: "Cierra 10:00 PM", tel: "01 234-5681" },
  { id: "5", nombre: "Mass Bayóvar", dir: "Av. Bayóvar 905, S.J.L.", lat: -11.9445, lng: -76.9810, abierto: true, hora: "Cierra 9:30 PM", tel: "01 234-5682" },
];

const MAPS_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

declare global {
  interface Window {
    google?: any;
    __initMassMap?: () => void;
  }
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function fmtDist(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.google?.maps) return Promise.resolve();
  if (!MAPS_KEY) return Promise.reject(new Error("Falta clave de Google Maps"));
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("gmaps-js") as HTMLScriptElement | null;
    window.__initMassMap = () => resolve();
    if (existing) return;
    const s = document.createElement("script");
    s.id = "gmaps-js";
    s.async = true;
    s.defer = true;
    const channel = TRACKING_ID ? `&channel=${TRACKING_ID}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&loading=async&callback=__initMassMap${channel}`;
    s.onerror = () => reject(new Error("No se pudo cargar Google Maps"));
    document.head.appendChild(s);
  });
}

function Tiendas() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("1");
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "denied" | "ok" | "error">("idle");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const userMarker = useRef<any>(null);

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocStatus("ok");
      },
      (err) => {
        setLocStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapRef.current || !window.google) return;
        const center = userPos ?? { lat: TIENDAS[0].lat, lng: TIENDAS[0].lng };
        mapObj.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
          ],
        });
        TIENDAS.forEach((t) => {
          const m = new window.google.maps.Marker({
            position: { lat: t.lat, lng: t.lng },
            map: mapObj.current,
            title: t.nombre,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#E30613",
              fillOpacity: 1,
              strokeColor: "#FFD100",
              strokeWeight: 3,
            },
          });
          m.addListener("click", () => setSel(t.id));
          markers.current.push(m);
        });
      })
      .catch(() => {
        /* silencio: cae al fallback visual */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Posición del usuario en el mapa
  useEffect(() => {
    if (!userPos || !mapObj.current || !window.google) return;
    mapObj.current.panTo(userPos);
    if (userMarker.current) userMarker.current.setMap(null);
    userMarker.current = new window.google.maps.Marker({
      position: userPos,
      map: mapObj.current,
      title: "Tu ubicación",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: "#1E88E5",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });
  }, [userPos]);

  // Calcular distancias y ordenar
  const tiendasConDist = TIENDAS.map((t) => ({
    ...t,
    distKm: userPos ? haversineKm(userPos, { lat: t.lat, lng: t.lng }) : null,
  })).sort((a, b) => {
    if (a.distKm == null && b.distKm == null) return 0;
    if (a.distKm == null) return 1;
    if (b.distKm == null) return -1;
    return a.distKm - b.distKm;
  });

  const filtradas = tiendasConDist.filter(
    (t) =>
      t.nombre.toLowerCase().includes(q.toLowerCase()) ||
      t.dir.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-primary px-5 pt-6 pb-5 rounded-b-3xl shadow-md">
        <p className="text-[11px] text-primary-foreground/70 font-medium">Encuentra tu</p>
        <h1 className="text-xl font-extrabold text-primary-foreground">Tienda Mass más cercana</h1>
        <div className="mt-4 flex items-center gap-2 bg-card rounded-xl px-3 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por distrito o avenida..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {/* Mapa real */}
      <section className="px-5 mt-5">
        <div className="relative h-56 rounded-2xl overflow-hidden border border-border bg-muted">
          <div ref={mapRef} className="absolute inset-0" />
          <button
            onClick={requestLocation}
            className="absolute bottom-2 right-2 bg-card rounded-lg px-2.5 py-1.5 text-[11px] font-semibold shadow flex items-center gap-1"
          >
            {locStatus === "loading" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5 text-secondary" />
            )}
            Mi ubicación
          </button>
        </div>
        {locStatus === "denied" && (
          <p className="text-[11px] text-destructive mt-2">
            Activa los permisos de ubicación para ver tiendas cercanas en orden de distancia.
          </p>
        )}
      </section>

      {/* Lista */}
      <section className="px-5 mt-5">
        <h2 className="text-sm font-bold text-foreground mb-3">
          {filtradas.length} tiendas {userPos ? "ordenadas por cercanía" : "disponibles"}
        </h2>
        <div className="space-y-2.5">
          {filtradas.map((t) => (
            <button
              key={t.id}
              onClick={() => setSel(t.id)}
              className={`w-full text-left bg-card rounded-2xl p-3 border transition-colors ${
                sel === t.id ? "border-secondary" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{t.nombre}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.dir}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Navigation className="w-3 h-3" />{" "}
                      {t.distKm != null ? fmtDist(t.distKm) : "—"}
                    </span>
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        t.abierto ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      <Clock className="w-3 h-3" /> {t.abierto ? "Abierto" : "Cerrado"} · {t.hora}
                    </span>
                  </div>
                </div>
              </div>
              {sel === t.id && (
                <div className="mt-3 pt-3 border-t border-border flex gap-2">
                  <a
                    href={`tel:${t.tel}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-muted text-foreground text-xs font-semibold py-2 rounded-lg"
                  >
                    <Phone className="w-3.5 h-3.5" /> Llamar
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold py-2 rounded-lg"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Cómo llegar
                  </a>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
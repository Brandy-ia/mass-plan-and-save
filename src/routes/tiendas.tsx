import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, Clock, Phone, Search } from "lucide-react";

export const Route = createFileRoute("/tiendas")({
  component: Tiendas,
});

const TIENDAS = [
  { id: "1", nombre: "Mass Av. Los Próceres", dir: "Av. Los Próceres 234, S.J.L.", dist: "350 m", abierto: true, hora: "Cierra 10:00 PM", tel: "01 234-5678" },
  { id: "2", nombre: "Mass Canto Grande", dir: "Av. Canto Grande 1820", dist: "1.2 km", abierto: true, hora: "Cierra 11:00 PM", tel: "01 234-5679" },
  { id: "3", nombre: "Mass Las Flores", dir: "Jr. Las Flores 456", dist: "2.4 km", abierto: false, hora: "Abre 7:00 AM", tel: "01 234-5680" },
  { id: "4", nombre: "Mass Mariscal Cáceres", dir: "Av. Mariscal Cáceres 1290", dist: "3.1 km", abierto: true, hora: "Cierra 10:00 PM", tel: "01 234-5681" },
  { id: "5", nombre: "Mass Bayóvar", dir: "Av. Bayóvar 905", dist: "4.7 km", abierto: true, hora: "Cierra 9:30 PM", tel: "01 234-5682" },
];

function Tiendas() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("1");
  const filtradas = TIENDAS.filter((t) =>
    t.nombre.toLowerCase().includes(q.toLowerCase()) || t.dir.toLowerCase().includes(q.toLowerCase()),
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

      {/* Mapa simulado */}
      <section className="px-5 mt-5">
        <div className="relative h-44 rounded-2xl overflow-hidden border border-border bg-muted">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 49%, oklch(0.7 0.04 90) 50%, transparent 51%), linear-gradient(90deg, transparent 49%, oklch(0.7 0.04 90) 50%, transparent 51%)",
              backgroundSize: "30px 30px",
            }}
          />
          {/* pins */}
          {[
            { t: "20%", l: "30%", id: "1" },
            { t: "55%", l: "60%", id: "2" },
            { t: "35%", l: "75%", id: "3" },
            { t: "70%", l: "25%", id: "4" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSel(p.id)}
              style={{ top: p.t, left: p.l }}
              className="absolute -translate-x-1/2 -translate-y-full"
            >
              <MapPin
                className={`w-7 h-7 drop-shadow ${sel === p.id ? "text-secondary fill-secondary/30" : "text-foreground"}`}
                strokeWidth={2.5}
              />
            </button>
          ))}
          {/* user */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-500/30" />
          </div>
          <div className="absolute bottom-2 right-2 bg-card rounded-lg px-2 py-1 text-[10px] font-semibold shadow">
            Tu ubicación
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="px-5 mt-5">
        <h2 className="text-sm font-bold text-foreground mb-3">{filtradas.length} tiendas cerca</h2>
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
                      <Navigation className="w-3 h-3" /> {t.dist}
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
                  <button className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold py-2 rounded-lg">
                    <Navigation className="w-3.5 h-3.5" /> Cómo llegar
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
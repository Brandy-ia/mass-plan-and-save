import { createFileRoute } from "@tanstack/react-router";
import { Bell, Percent, Gift, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/ofertas")({
  component: Ofertas,
});

const NOTIFICACIONES = [
  {
    id: "1",
    icon: Percent,
    titulo: "20% OFF en Detergente Bolívar 2.6kg",
    desc: "Hoy a S/ 21.90 en tu Mass Av. Los Próceres.",
    tiempo: "Hace 10 min",
    nuevo: true,
  },
  {
    id: "2",
    icon: Gift,
    titulo: "2x1 en Yogurt Gloria 1L",
    desc: "Lleva 2 por S/ 7.90 — válido hoy.",
    tiempo: "Hace 1 h",
    nuevo: true,
  },
  {
    id: "3",
    icon: Clock,
    titulo: "Últimas horas: Arroz Costeño 5kg a S/ 23.90",
    desc: "Promoción termina hoy a las 10:00 PM.",
    tiempo: "Hace 3 h",
    nuevo: false,
  },
  {
    id: "4",
    icon: MapPin,
    titulo: "Nueva tienda cerca de ti",
    desc: "Mass Av. Canto Grande abrió a 1.2 km de tu casa.",
    tiempo: "Ayer",
    nuevo: false,
  },
];

const PROMOS = [
  { id: "p1", titulo: "Combo Desayuno", desc: "Leche Gloria + Pan Bimbo + Mantequilla Laive", precio: "S/ 12.90", color: "from-primary to-primary/70" },
  { id: "p2", titulo: "Combo Hogar", desc: "Detergente Bolívar + Lejía Clorox + Ayudín", precio: "S/ 28.50", color: "from-secondary to-secondary/70" },
  { id: "p3", titulo: "Combo Lonchera", desc: "Atún Florida + Galletas Soda Field + Frugos 1L", precio: "S/ 14.90", color: "from-primary to-primary/70" },
];

function Ofertas() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-primary px-5 pt-6 pb-5 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-foreground" />
          <h1 className="text-xl font-extrabold text-primary-foreground">Ofertas y avisos</h1>
        </div>
        <p className="text-xs text-primary-foreground/80 mt-1">
          Promociones vigentes en tu tienda
        </p>
      </header>

      {/* Promos destacadas */}
      <section className="px-5 mt-5">
        <h2 className="text-sm font-bold text-foreground mb-3">Combos del día</h2>
        <div className="space-y-3">
          {PROMOS.map((p) => (
            <div
              key={p.id}
              className={`bg-gradient-to-r ${p.color} rounded-2xl p-4 text-secondary-foreground shadow-md`}
            >
              <p className="text-[11px] font-semibold opacity-90">PROMO LIMITADA</p>
              <p className="text-lg font-extrabold mt-0.5">{p.titulo}</p>
              <p className="text-xs opacity-90">{p.desc}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-extrabold">{p.precio}</span>
                <button className="bg-card text-foreground text-xs font-bold px-3 py-1.5 rounded-lg">
                  Agregar a lista
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notificaciones */}
      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold text-foreground mb-3">Notificaciones</h2>
        <div className="space-y-2">
          {NOTIFICACIONES.map((n) => (
            <div
              key={n.id}
              className={`bg-card rounded-2xl p-3 border flex gap-3 ${
                n.nuevo ? "border-secondary/40" : "border-border"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center shrink-0 relative">
                <n.icon className="w-5 h-5 text-secondary" />
                {n.nuevo && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{n.titulo}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.tiempo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
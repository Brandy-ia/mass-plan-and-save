import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MapPin, Bell, Search, ShoppingCart, Tag, Store, Percent, Package } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const ofertas = [
    { nombre: "Aceite Primor 1L", precio: "S/ 7.90", antes: "S/ 9.50", desc: "-17%" },
    { nombre: "Arroz Costeño 5kg", precio: "S/ 18.90", antes: "S/ 22.00", desc: "-14%" },
    { nombre: "Detergente Bolívar 2kg", precio: "S/ 14.50", antes: "S/ 17.90", desc: "-19%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header amarillo Mass */}
      <header className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-foreground/70 font-medium">¡Hola, María!</p>
            <h1 className="text-2xl font-extrabold text-primary-foreground tracking-tight">
              mass<span className="text-secondary">.</span>
            </h1>
          </div>
          <button className="relative p-2 rounded-full bg-primary-foreground/10">
            <Bell className="w-5 h-5 text-primary-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
          </button>
        </div>

        {/* Tienda más cercana */}
        <div className="mt-5 bg-card rounded-2xl p-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">Tienda más cercana</p>
            <p className="text-sm font-semibold text-foreground truncate">
              Mass Av. Los Próceres
            </p>
            <p className="text-[11px] text-muted-foreground">A 350 m · Abierto</p>
          </div>
          <button className="text-xs font-semibold text-secondary">Cambiar</button>
        </div>

        {/* Buscador */}
        <div className="mt-3 flex items-center gap-2 bg-card rounded-xl px-3 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Buscar productos, marcas..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {/* Accesos rápidos */}
      <section className="px-5 mt-5">
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { icon: Store, label: "Tiendas" },
            { icon: Percent, label: "Ofertas" },
            { icon: Package, label: "Marcas Mass" },
            { icon: Tag, label: "Cupones" },
          ].map((it) => (
            <button key={it.label} className="flex flex-col items-center gap-1.5">
              <span className="w-12 h-12 rounded-2xl bg-primary/30 flex items-center justify-center">
                <it.icon className="w-5 h-5 text-secondary" />
              </span>
              <span className="text-[11px] font-medium text-foreground leading-tight">
                {it.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Banner CTA lista */}
      <section className="px-5 mt-6">
        <Link
          to="/lista"
          className="block bg-secondary text-secondary-foreground rounded-2xl p-4 shadow-md active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-90">Tu lista de compras</p>
              <p className="text-base font-bold">Calcular presupuesto →</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Ofertas */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Ofertas de hoy</h2>
          <button className="text-xs font-semibold text-secondary">Ver todas</button>
        </div>
        <div className="space-y-2.5">
          {ofertas.map((o) => (
            <div
              key={o.nombre}
              className="bg-card rounded-2xl p-3 flex items-center gap-3 border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/30 flex items-center justify-center">
                <Tag className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{o.nombre}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-secondary">{o.precio}</span>
                  <span className="text-xs text-muted-foreground line-through">{o.antes}</span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                {o.desc}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

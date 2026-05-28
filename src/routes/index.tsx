import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MapPin, Bell, Search, ShoppingCart, Tag, Store, Percent, Package, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, signOut } = useAuth();
  const nombre =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    (user?.email?.split("@")[0]) ??
    "María";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;
  const ofertas = [
    { nombre: "Aceite Primor Premium 1L", precio: "S/ 8.50", antes: "S/ 10.90", desc: "-22%", img: "/images/aceite-primor.webp" },
    { nombre: "Arroz Costeño Superior 5kg", precio: "S/ 23.90", antes: "S/ 28.50", desc: "-16%", img: "/images/arroz-costeno.webp" },
    { nombre: "Leche Gloria Evaporada 400g", precio: "S/ 3.80", antes: "S/ 4.50", desc: "-15%", img: "/images/leche-gloria.jfif" },
    { nombre: "Detergente Bolívar Floral 2.6kg", precio: "S/ 21.90", antes: "S/ 26.90", desc: "-19%", img: "/images/detergente-bolivar.jfif" },
    { nombre: "Inca Kola 1.5L", precio: "S/ 5.50", antes: "S/ 6.90", desc: "-20%", img: "/images/inka-kola.webp" },
    { nombre: "Atún Florida en aceite 170g", precio: "S/ 4.90", antes: "S/ 6.20", desc: "-21%", img: "/images/atun-florida.jpeg" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header amarillo Mass */}
      <header className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-foreground/70 font-medium">¡Hola, {nombre}!</p>
            <h1 className="text-2xl font-extrabold text-primary-foreground tracking-tight">
              mass<span className="text-secondary">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/ofertas" className="relative p-2 rounded-full bg-primary-foreground/10">
              <Bell className="w-5 h-5 text-primary-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
            </Link>
            {user ? (
              <button
                onClick={() => signOut()}
                title="Cerrar sesión"
                className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground"
              >
                {avatar ? (
                  <img src={avatar} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold"
              >
                <LogIn className="w-3.5 h-3.5" /> Ingresar
              </Link>
            )}
          </div>
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
            { icon: Store, label: "Tiendas", to: "/tiendas" as const },
            { icon: Percent, label: "Ofertas", to: "/ofertas" as const },
            { icon: Package, label: "Marcas", to: "/marcas" as const },
            { icon: ShoppingCart, label: "Mi lista", to: "/lista" as const },
          ].map((it) => (
            <Link key={it.label} to={it.to} className="flex flex-col items-center gap-1.5">
              <span className="w-12 h-12 rounded-2xl bg-primary/30 flex items-center justify-center">
                <it.icon className="w-5 h-5 text-secondary" />
              </span>
              <span className="text-[11px] font-medium text-foreground leading-tight">
                {it.label}
              </span>
            </Link>
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
              <div className="w-14 h-14 rounded-xl bg-primary/30 flex items-center justify-center overflow-hidden">
                <img src={o.img} alt={o.nombre} className="w-full h-full object-cover" />
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

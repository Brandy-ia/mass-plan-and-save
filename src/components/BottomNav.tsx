import { Link, useLocation } from "@tanstack/react-router";
import { Home, MapPin, ShoppingCart, Tag, Bell } from "lucide-react";

const ITEMS = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/tiendas", icon: MapPin, label: "Tiendas" },
  { to: "/lista", icon: ShoppingCart, label: "Lista" },
  { to: "/marcas", icon: Tag, label: "Marcas" },
  { to: "/ofertas", icon: Bell, label: "Ofertas" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <ul className="grid grid-cols-5">
        {ITEMS.map((it) => {
          const active = pathname === it.to;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium"
              >
                <it.icon
                  className={`w-5 h-5 ${active ? "text-secondary" : "text-muted-foreground"}`}
                />
                <span className={active ? "text-secondary font-bold" : "text-muted-foreground"}>
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
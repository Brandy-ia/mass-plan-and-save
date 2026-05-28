import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tag, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/marcas")({
  component: Marcas,
});

const CATEGORIAS = ["Todos", "Abarrotes", "Limpieza", "Lácteos", "Bebidas"] as const;

type Producto = {
  id: string;
  nombre: string;
  cat: string;
  precio: number;
  refPrecio: number;
  ahorro: number;
  img?: string;
};

const PRODUCTOS: Producto[] = [
  { id: "1", nombre: "Arroz Superior Bell's 5kg", cat: "Abarrotes", precio: 21.9, refPrecio: 28.5, ahorro: 23, img: "/images/arroz-costeno.webp" },
  { id: "2", nombre: "Aceite Vegetal Bell's 1L", cat: "Abarrotes", precio: 7.5, refPrecio: 10.9, ahorro: 31, img: "/images/aceite-primor.webp" },
  { id: "3", nombre: "Azúcar Rubia Bell's 1kg", cat: "Abarrotes", precio: 3.9, refPrecio: 5.2, ahorro: 25, img: "/images/azucar-bells.webp" },
  { id: "4", nombre: "Fideos Spaghetti Bell's 500g", cat: "Abarrotes", precio: 2.5, refPrecio: 3.8, ahorro: 34, img: "/images/fideos-vittorio.jpeg" },
  { id: "5", nombre: "Leche Evaporada Bell's 400g", cat: "Lácteos", precio: 3.2, refPrecio: 4.5, ahorro: 29, img: "/images/leche-gloria.jfif" },
  { id: "6", nombre: "Yogurt Bebible Bell's 1L", cat: "Lácteos", precio: 5.5, refPrecio: 7.9, ahorro: 30 },
  { id: "7", nombre: "Queso Fresco Bell's 200g", cat: "Lácteos", precio: 6.9, refPrecio: 9.5, ahorro: 27 },
  { id: "8", nombre: "Detergente Bell's 2.6kg", cat: "Limpieza", precio: 18.9, refPrecio: 26.5, ahorro: 28, img: "/images/detergente-bolivar.jfif" },
  { id: "9", nombre: "Lejía Bell's 1L", cat: "Limpieza", precio: 2.9, refPrecio: 4.2, ahorro: 31 },
  { id: "10", nombre: "Papel Higiénico Bell's x12", cat: "Limpieza", precio: 14.9, refPrecio: 19.9, ahorro: 25, img: "/images/papel-higienico.webp" },
  { id: "11", nombre: "Gaseosa Cola Bell's 3L", cat: "Bebidas", precio: 5.9, refPrecio: 8.5, ahorro: 30 },
  { id: "12", nombre: "Agua Mineral Bell's 2.5L", cat: "Bebidas", precio: 2.5, refPrecio: 3.5, ahorro: 28 },
];

function Marcas() {
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Todos");
  const lista = cat === "Todos" ? PRODUCTOS : PRODUCTOS.filter((p) => p.cat === cat);
  const ahorroProm = Math.round(PRODUCTOS.reduce((s, p) => s + p.ahorro, 0) / PRODUCTOS.length);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-primary px-5 pt-6 pb-5 rounded-b-3xl shadow-md">
        <p className="text-[11px] text-primary-foreground/70 font-medium">Marcas Mass</p>
        <h1 className="text-xl font-extrabold text-primary-foreground">Bell&apos;s y más</h1>
        <div className="mt-3 bg-secondary text-secondary-foreground rounded-xl p-3 flex items-center gap-3">
          <TrendingDown className="w-6 h-6" />
          <div>
            <p className="text-xs opacity-90">Ahorro promedio</p>
            <p className="text-lg font-extrabold">{ahorroProm}% vs marcas tradicionales</p>
          </div>
        </div>
      </header>

      {/* Categorías */}
      <section className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                cat === c
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-card text-foreground border-border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {lista.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl p-3 border border-border">
              <div className="aspect-square rounded-xl bg-primary/30 flex items-center justify-center mb-2 overflow-hidden">
                {p.img ? (
                  <img src={p.img} alt={p.nombre} className="w-full h-full object-cover" />
                ) : (
                  <Tag className="w-8 h-8 text-secondary" />
                )}
              </div>
              <p className="text-xs font-semibold text-foreground line-clamp-2 min-h-[32px]">
                {p.nombre}
              </p>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-secondary">
                  S/ {p.precio.toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground line-through">
                  S/ {p.refPrecio.toFixed(2)}
                </span>
              </div>
              <span className="inline-block mt-1 text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                Ahorra {p.ahorro}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle2, XCircle, MapPin, X } from "lucide-react";

export const Route = createFileRoute("/lista")({
  component: ListaCompras,
});

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  marca: "Mass" | "Tradicional";
  stock?: "alto" | "medio" | "agotado";
};

const PRODUCTOS_INICIALES: Producto[] = [
  { id: "1", nombre: "Arroz Costeño Superior 5kg", precio: 26.9, cantidad: 1, marca: "Tradicional" },
  { id: "2", nombre: "Aceite Primor Premium 1L", precio: 9.5, cantidad: 2, marca: "Tradicional" },
  { id: "3", nombre: "Leche Gloria Evaporada 400g", precio: 4.2, cantidad: 3, marca: "Tradicional" },
  { id: "4", nombre: "Fideos Don Vittorio Spaghetti 500g", precio: 3.5, cantidad: 2, marca: "Tradicional" },
  { id: "5", nombre: "Detergente Bolívar Floral 2.6kg", precio: 24.9, cantidad: 1, marca: "Tradicional" },
  { id: "6", nombre: "Azúcar Rubia Bell's 1kg", precio: 3.9, cantidad: 2, marca: "Mass" },
  { id: "7", nombre: "Papel Higiénico Elite x12", precio: 19.9, cantidad: 1, marca: "Tradicional" },
  { id: "8", nombre: "Atún Florida en aceite 170g", precio: 5.5, cantidad: 3, marca: "Tradicional" },
];

function ListaCompras() {
  const [items, setItems] = useState<Producto[]>(PRODUCTOS_INICIALES);
  const [verificando, setVerificando] = useState(false);
  const [resultado, setResultado] = useState<Producto[] | null>(null);

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const ahorro = items.filter((i) => i.marca === "Mass").reduce((s, i) => s + i.precio * i.cantidad * 0.15, 0);

  const cambiarCantidad = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad: Math.max(0, p.cantidad + delta) } : p))
        .filter((p) => p.cantidad > 0),
    );
  };

  const eliminar = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  const verDisponibilidad = () => {
    setVerificando(true);
    setTimeout(() => {
      const stocks: Producto["stock"][] = ["alto", "alto", "medio", "alto", "agotado", "alto", "medio", "alto"];
      const conStock = items.map((it, idx) => ({ ...it, stock: stocks[idx % stocks.length] }));
      setResultado(conStock);
      setVerificando(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="bg-primary px-5 pt-6 pb-5 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-full bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex-1">
            <p className="text-[11px] text-primary-foreground/70 font-medium">Mi presupuesto</p>
            <h1 className="text-lg font-extrabold text-primary-foreground">Lista de compras</h1>
          </div>
        </div>

        <div className="mt-4 bg-card rounded-2xl p-3 flex items-center gap-3 shadow-sm">
          <MapPin className="w-4 h-4 text-secondary" />
          <p className="text-xs font-semibold text-foreground flex-1">Mass Av. Los Próceres</p>
          <span className="text-[10px] font-bold bg-primary/30 text-secondary px-2 py-0.5 rounded">
            350 m
          </span>
        </div>
      </header>

      {/* Lista */}
      <section className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">
            {items.length} productos
          </h2>
          <button className="text-xs font-semibold text-secondary flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        <div className="space-y-2.5">
          {items.map((it) => {
            const r = resultado?.find((x) => x.id === it.id);
            return (
              <div
                key={it.id}
                className="bg-card rounded-2xl p-3 border border-border flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center font-extrabold text-secondary text-xs">
                  {it.marca === "Mass" ? "M" : "•"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{it.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    S/ {it.precio.toFixed(2)} c/u
                  </p>
                  {r?.stock && (
                    <div className="mt-1 flex items-center gap-1">
                      {r.stock === "agotado" ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-destructive">
                          <XCircle className="w-3 h-3" /> Agotado
                        </span>
                      ) : r.stock === "medio" ? (
                        <span className="text-[10px] font-bold text-secondary">
                          ⚠ Pocas unidades
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                          <CheckCircle2 className="w-3 h-3" /> Disponible
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <p className="text-sm font-extrabold text-secondary">
                    S/ {(it.precio * it.cantidad).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1.5 bg-muted rounded-full p-0.5">
                    <button
                      onClick={() => cambiarCantidad(it.id, -1)}
                      className="w-6 h-6 rounded-full bg-card flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3 text-foreground" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{it.cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(it.id, 1)}
                      className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 text-secondary-foreground" />
                    </button>
                  </div>
                </div>
                <button onClick={() => eliminar(it.id)} className="p-1">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="mt-5 bg-card rounded-2xl p-4 border border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">S/ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ahorro Marcas Mass</span>
            <span className="font-semibold text-green-600">- S/ {ahorro.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between items-end">
            <span className="text-sm font-bold">Total presupuesto</span>
            <span className="text-2xl font-extrabold text-secondary">
              S/ {(total - ahorro).toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      {/* CTA fijo (encima del bottom nav) */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border p-4 shadow-lg z-30">
        <button
          onClick={verDisponibilidad}
          disabled={verificando || items.length === 0}
          className="w-full bg-secondary text-secondary-foreground font-bold py-3.5 rounded-xl shadow-md active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          {verificando ? "Verificando stock..." : "Ver disponibilidad en tienda"}
        </button>
      </div>

      {/* Modal resultado */}
      {resultado && !verificando && (
        <div className="fixed inset-0 bg-foreground/40 flex items-end z-50" onClick={() => setResultado(null)}>
          <div
            className="bg-card w-full rounded-t-3xl p-5 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Stock verificado</h3>
                <p className="text-xs text-muted-foreground">Mass Av. Los Próceres</p>
              </div>
              <button onClick={() => setResultado(null)} className="p-2 rounded-full bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-auto">
              {resultado.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground truncate flex-1 pr-2">{r.nombre}</span>
                  {r.stock === "alto" && (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" /> Disponible
                    </span>
                  )}
                  {r.stock === "medio" && (
                    <span className="text-secondary font-bold text-xs">⚠ Pocas</span>
                  )}
                  {r.stock === "agotado" && (
                    <span className="flex items-center gap-1 text-destructive font-bold text-xs">
                      <XCircle className="w-4 h-4" /> Agotado
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setResultado(null)}
              className="mt-4 w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
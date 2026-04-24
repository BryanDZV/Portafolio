"use client";

import React from "react"; // Importamos React para acceder a sus tipos
import { useFormStatus } from "react-dom";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// QUE HACE: Extrae automáticamente todos los tipos que acepta tu botón original.
// POR QUE SE ELIGIO: Usar 'React.ComponentProps<typeof Button>' es más seguro que importar una interfaz,
// ya que si cambias el botón de shadcn, este componente se actualiza solo.
interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loadingText?: string;
  children: React.ReactNode; // Aseguramos que TS sepa que puede recibir texto o iconos
}

export function LoadingButton({
  children,
  loadingText = "ENVIANDO...",
  className,
  ...props
}: LoadingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      // Si el formulario está enviando (pending), desactivamos el botón
      disabled={pending || props.disabled}
      className={className}
    >
      {pending ? (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </m.div>
      ) : (
        <m.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {children}
        </m.span>
      )}
    </Button>
  );
}

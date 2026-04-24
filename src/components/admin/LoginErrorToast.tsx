"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastFeedback } from "@/components/ui/ToastFeedback";

export function LoginErrorToast() {
  const searchParams = useSearchParams();
  const rawError = useMemo(() => searchParams.get("error"), [searchParams]);

  // Sincronizamos el estado inicial y las actualizaciones de la URL sin disparar efectos extra
  const [prevError, setPrevError] = useState<string | null>(rawError);
  const [message, setMessage] = useState<string | null>(rawError);

  if (rawError !== prevError) {
    setPrevError(rawError);
    setMessage(rawError);
  }

  useEffect(() => {
    if (!rawError) return;

    const timer = window.setTimeout(() => {
      setMessage(null);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [rawError]);

  return <ToastFeedback message={message} type="error" />;
}

"use client";

import { m, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error";

interface ToastFeedbackProps {
  message: string | null;
  type?: ToastType;
}

export function ToastFeedback({
  message,
  type = "success",
}: ToastFeedbackProps) {
  const isError = type === "error";

  return (
    <AnimatePresence>
      {message ? (
        <m.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed right-4 top-4 z-[100] max-w-sm rounded-xl border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md"
        >
          <p
            className={
              isError
                ? "text-sm font-medium text-destructive"
                : "text-sm font-medium text-primary"
            }
          >
            {message}
          </p>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

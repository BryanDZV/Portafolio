"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { m, useReducedMotion } from "framer-motion";
import { createProjectAction } from "@/app/[lang]/(admin)/dashboard/actions";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToastFeedback } from "@/components/ui/ToastFeedback";
import {
  STAGGER_CONTAINER,
  FADE_UP_ITEM,
} from "@/components/ui/motion-presets";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export function CreateProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3800);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  function showToast(message: string, type: "success" | "error") {
    setToastType(type);
    setToastMessage(message);
  }

  // QUE HACE: Maneja la respuesta de la Server Action y resetea la UI.
  // POR QUE SE ELIGIO: Separar la acción nos permite añadir lógica de notificaciones (Toasts) en el futuro sin ensuciar el JSX.
  async function clientAction(formData: FormData) {
    try {
      // Aquí podrías añadir una validación previa en el cliente si quisieras
      await createProjectAction(formData);
      formRef.current?.reset();
      showToast("Proyecto subido correctamente.", "success");
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "No se pudo subir el proyecto.";
      showToast(message, "error");
    }
  }

  function handleImageValidation(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      event.target.value = "";
      showToast("El archivo debe ser una imagen válida.", "error");
      return;
    }

    if (selectedFile.size > MAX_UPLOAD_SIZE_BYTES) {
      event.target.value = "";
      showToast("Imagen rechazada: supera el límite de 5MB.", "error");
    }
  }

  return (
    <>
      <ToastFeedback message={toastMessage} type={toastType} />
      <m.form
        ref={formRef}
        action={clientAction}
        variants={STAGGER_CONTAINER(shouldReduceMotion)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="space-y-4 p-6 border border-border rounded-xl bg-card/50 shadow-inner"
      >
        {/* TÍTULO */}
        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Nombre del proyecto"
          />
        </m.div>

        {/* DESCRIPCIÓN */}
        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="¿De qué trata?"
            className="min-h-[100px]"
          />
        </m.div>

        {/* TECH STACK */}
        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="tech_stack">Tecnologías (separadas por comas)</Label>
          <Input
            id="tech_stack"
            name="tech_stack"
            required
            placeholder="Next.js, Tailwind, PostgreSQL"
          />
        </m.div>

        {/* IMAGEN */}
        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="image">Imagen (Cover)</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            className="cursor-pointer file:text-primary"
            onChange={handleImageValidation}
          />
        </m.div>

        {/* URLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <m.div variants={FADE_UP_ITEM} className="space-y-2">
            <Label htmlFor="github_url">URL Repositorio</Label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              placeholder="https://github.com/..."
            />
          </m.div>
          <m.div variants={FADE_UP_ITEM} className="space-y-2">
            <Label htmlFor="live_url">URL Demo</Label>
            <Input
              id="live_url"
              name="live_url"
              type="url"
              placeholder="https://..."
            />
          </m.div>
        </div>

        {/* BOTÓN DE ENVÍO REUTILIZABLE */}
        <m.div variants={FADE_UP_ITEM} className="pt-4">
          <LoadingButton loadingText="CREANDO PROYECTO...">
            AÑADIR PROYECTO
          </LoadingButton>
        </m.div>
      </m.form>
    </>
  );
}

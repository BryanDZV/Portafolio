"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { m, useReducedMotion } from "framer-motion";
import { createProjectAction, updateProjectAction } from "@/app/[lang]/(admin)/dashboard/actions";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToastFeedback } from "@/components/ui/ToastFeedback";
import {
  STAGGER_CONTAINER,
  FADE_UP_ITEM,
} from "@/components/ui/motion-presets";
import type { Project } from "@/types/Project";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

// 1. Añadimos props para recibir un proyecto si estamos en "modo edición"
// También recibimos una función para cerrar el formulario si estamos editando
export function CreateProjectForm({
  projectToEdit = null,
  onCancelEdit = () => { }
}: {
  projectToEdit?: Project | null;
  onCancelEdit?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [imageError, setImageError] = useState<string | null>(null); //estado para imagen errores

  // 2. Si estamos editando, el modo es 'edit', sino es 'create'
  const isEditing = !!projectToEdit;

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  function showToast(message: string, type: "success" | "error") {
    setToastType(type);
    setToastMessage(message);
  }

  async function clientAction(formData: FormData) {
    try {
      // 3. Decidimos qué acción llamar según el modo
      if (isEditing) {
        await updateProjectAction(projectToEdit.id, formData);
        showToast("Proyecto actualizado correctamente.", "success");
        onCancelEdit(); // Cerramos el modo edición al terminar
      } else {
        await createProjectAction(formData);
        formRef.current?.reset();
        showToast("Proyecto creado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(error instanceof Error ? error.message : "Error desconocido", "error");
    }
  }

  function handleImageValidation(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      event.target.value = ""; // Vaciamos el archivo
      setImageError(" El archivo debe ser una imagen (JPG, PNG, etc).");
      return;
    }

    if (selectedFile.size > MAX_UPLOAD_SIZE_BYTES) {
      event.target.value = ""; // Vaciamos el archivo para que no se envíe
      setImageError(" La imagen es muy pesada. El límite es 5MB.");
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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-primary">
            {isEditing ? "✏️ Editando Proyecto" : "Nuevo Proyecto"}
          </h3>
          {isEditing && (
            <button type="button" onClick={onCancelEdit} className="text-sm text-destructive hover:underline">
              Cancelar Edición
            </button>
          )}
        </div>

        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Nombre del proyecto"
            defaultValue={projectToEdit?.title || ""} // <-- Rellena si hay datos
          />
        </m.div>

        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="¿De qué trata?"
            className="min-h-[100px]"
            defaultValue={projectToEdit?.description || ""}
          />
        </m.div>
        {/* CATEGORÍA */}
        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue={projectToEdit?.category || "FRONTEND"}
            className="w-full p-2 border border-input rounded-md bg-background"
          >
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="FULLSTACK">Fullstack</option>
          </select>
        </m.div>

        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="techStack">Tecnologías (separadas por comas)</Label>
          <Input
            id="techStack"
            name="techStack"
            required
            placeholder="Next.js, Tailwind, PostgreSQL"
            defaultValue={projectToEdit?.techStack ? projectToEdit.techStack.join(", ") : ""}
          />
        </m.div>

        <m.div variants={FADE_UP_ITEM} className="space-y-2">
          <Label htmlFor="imageFile">Imagen (Cover)</Label>
          {isEditing && (
            <p className="text-xs text-muted-foreground mb-1">
              Déjalo vacío si no quieres cambiar la imagen actual.
            </p>
          )}
          <Input
            id="imageFile"
          
            name="imageFile"
            type="file"
            accept="image/*"
            required={!isEditing} // Solo es obligatorio si estamos creando
            className="cursor-pointer file:text-primary"
            onChange={handleImageValidation}
            
          />
          {imageError && <p className="text-red-500 text-xs mt-1 font-medium">{imageError}</p>}
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <m.div variants={FADE_UP_ITEM} className="space-y-2">
            <Label htmlFor="githubUrl">URL Repositorio</Label>
            <Input
              id="githubUrl"
              // IMPORTANTE: camelCase
              name="githubUrl"
              type="url"
              placeholder="https://github.com/..."
              defaultValue={projectToEdit?.githubUrl || ""}
            />
          </m.div>
          <m.div variants={FADE_UP_ITEM} className="space-y-2">
            <Label htmlFor="liveUrl">URL Demo</Label>
            <Input
              id="liveUrl"
              // IMPORTANTE: camelCase
              name="liveUrl"
              type="url"
              placeholder="https://..."
              defaultValue={projectToEdit?.liveUrl || ""}
            />
          </m.div>
        </div>

        <m.div variants={FADE_UP_ITEM} className="pt-4">
          <LoadingButton loadingText={isEditing ? "GUARDANDO..." : "CREANDO PROYECTO..."}>
            {isEditing ? "GUARDAR CAMBIOS" : "AÑADIR PROYECTO"}
          </LoadingButton>
        </m.div>
      </m.form>
    </>
  );
}
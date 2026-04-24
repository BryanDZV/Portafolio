import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ThemeProvider } from "@/components/theme-provider";

import "../globals.css";

//descargamos las fuentes con variables CSS para usarlas globalmente
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immersive Portfolio",
  description: "Portafolio immersivo 2026",
};
//Hace asíncrono el layout para poder leer los params dinámicos (idioma) y cargar el diccionario correspondiente antes de renderizar.
export default async function RootLayout({
  children,
  params, // Next.js ahora pasa los params dinámicos
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>; // Tipamos la promesa del idioma
}>) {
  // QUE HACE: Extrae el idioma actual de la URL de forma asíncrona en el servidor.
  // POR QUE SE ELIGIO: En App Router, 'params' es una promesa, asegurando que se resuelva antes del renderizado estático/dinámico.
  const { lang } = await params;

  return (
    // QUE HACE: Define el contenedor raíz con soporte para hidratación de tema y etiqueta lang dinámica.
    // POR QUE SE ELIGIO: 'lang={lang}' es fundamental para SEO y accesibilidad (screen readers).
    // 'suppressHydrationWarning' es vital para evitar errores de consola cuando el tema guardado en LocalStorage difiere del renderizado inicial.
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        {/* QUE HACE: Orquesta la carga de animaciones y la lógica de tema global. */}
        {/* POR QUE SE ELIGIO: Envolver 'children' con ambos providers garantiza que cualquier componente pueda usar animaciones y reaccionar al modo oscuro. */}
        <MotionProvider>
          <ThemeProvider>
            {/* 1. Capa de interacción: Cursor custom */}
            <CustomCursor />

            {/* 2. Capa de contenido: Inyecta el page.tsx y sus hijos */}
            {children}
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}

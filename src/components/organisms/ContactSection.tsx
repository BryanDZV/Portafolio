// src/components/organisms/ContactSection.tsx
import Link from "next/link";
import { ContactSectionProps } from "@/types/Contact";
import { Mail, MapPin, ArrowLeft } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";

import { LottieAnimation } from "@/components/atoms/LottieAnimation";
import contactAnimation from "@/assets/lotties/Contact.json";

export default function ContactSection({ data, homeHref }: ContactSectionProps) {
  return (
    
    <section
      id="contacto"
      className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/60 backdrop-blur-md p-8 md:p-12 shadow-sm"
    >
      <LottieAnimation 
        animationData={contactAnimation} 
        className="w-48 h-48 md:w-64 md:h-64 mb-4" 
      />
      <h2 className="text-2xl font-bold">Contáctame</h2>
      {/* Indicador de Disponibilidad */}
      <div className="mb-8 flex items-center gap-3">
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
          {data.availability}
        </span>
      </div>

      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
        {data.pageTitle}
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
        {data.description}
      </p>

      {/* Grid de Información de Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-10">
        
        {/* Columna Izquierda: Acción Principal (Email) y Ubicación */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Envíame un correo
            </h3>
            <a
              href={`mailto:${data.email}`}
              aria-label={data.emailLabel}
              className="group inline-flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-6 py-4 text-base font-medium text-primary transition-all hover:bg-primary/20 hover:scale-[1.02]"
            >
              <Mail className="w-5 h-5" />
              {data.email}
            </a>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5 text-foreground/50" />
            <span className="font-medium">{data.location}</span>
          </div>
        </div>

        {/* Columna Derecha: Redes Sociales y Volver */}
        <div className="space-y-6 flex flex-col md:items-end justify-between">
          
          <div className="w-full md:w-auto">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 md:text-right">
              Mis Redes
            </h3>
            <SocialLinks
              className="gap-4 md:justify-end"
              githubAriaLabel={data.socials.githubLabel}
              linkedinAriaLabel={data.socials.linkedinLabel}
              showDownloadCV={false}
              iconLinkClassName="inline-flex items-center justify-center p-3 rounded-full border border-border bg-background hover:bg-muted transition-colors"
            />
          </div>

          <Link
            href={homeHref}
            aria-label={data.backLink}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {data.backLink}
          </Link>
          
        </div>
      </div>
    </section>
  );
}
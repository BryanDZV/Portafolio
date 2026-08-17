import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import DownloadButtonCV from "./DownloadButtonCV";

// QUE HACE: Renderiza los enlaces a redes sociales estandarizados.
// POR QUE SE ELIGIO: Centralizar esto evita copiar y pegar URLs y etiquetas ARIA (accesibilidad) por toda la app.
// COMO FUNCIONA: Acepta una prop 'className' opcional para que el componente padre (Hero, Footer, Contacto) pueda modificar su espaciado o color sin romper el componente original.
interface SocialLinksProps {
  className?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  githubAriaLabel?: string;
  linkedinAriaLabel?: string;
  showDownloadCV?: boolean;
  iconLinkClassName?: string;
}

export function SocialLinks({
  className,
  githubUrl = "https://github.com/BryanDZV",
  linkedinUrl = "https://www.linkedin.com/in/bryanzavaladev/",
  githubAriaLabel = "Abrir perfil de GitHub de Bryan Zavala",
  linkedinAriaLabel = "Abrir perfil de LinkedIn de Bryan Zavala",
  showDownloadCV = true,
  iconLinkClassName,
}: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={githubAriaLabel}
        className={cn(
          "hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm",
          iconLinkClassName
        )}
      >
        <IconBrandGithub size={26} />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkedinAriaLabel}
        className={cn(
          "hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm",
          iconLinkClassName
        )}
      >
        <IconBrandLinkedin size={26} />
      </a>
      {showDownloadCV ? (
        <DownloadButtonCV
          label="Descargar CV"
          fileUrl="/documents/CV_Bryan_Zavala_FullStack.pdf"
        />
      ) : null}
    </div>
  );
}

import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// QUE HACE: Renderiza los enlaces a redes sociales estandarizados.
// POR QUE SE ELIGIO: Centralizar esto evita copiar y pegar URLs y etiquetas ARIA (accesibilidad) por toda la app.
// COMO FUNCIONA: Acepta una prop 'className' opcional para que el componente padre (Hero, Footer, Contacto) pueda modificar su espaciado o color sin romper el componente original.
interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      <a
        href="https://github.com/BryanDZV"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir perfil de GitHub de Bryan Zavala"
        className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
      >
        <IconBrandGithub size={26} />
      </a>
      <a
        href="https://www.linkedin.com/in/bryanzavaladev/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir perfil de LinkedIn de Bryan Zavala"
        className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
      >
        <IconBrandLinkedin size={26} />
      </a>
    </div>
  );
}

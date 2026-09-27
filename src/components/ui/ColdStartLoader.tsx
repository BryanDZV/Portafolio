import { cn } from "@/lib/utils";

const DEFAULT_TITLE = "Despertando el servidor...";
const DEFAULT_DESCRIPTION =
  "Al ser un servidor gratuito en la nube, la primera carga puede tardar entre 30 y 50 segundos. En unos instantes verás el contenido.";

type ColdStartLoaderProps = {
  title?: string;
  description?: string;
  className?: string;
  fullScreen?: boolean;
};

export function ColdStartLoader({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
  fullScreen = false,
}: ColdStartLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-6 py-16 text-center",
        fullScreen && "min-h-screen",
        className,
      )}
    >
      <div
        className="size-12 rounded-full border-2 border-muted border-t-primary motion-safe:animate-spin dark:border-border dark:border-t-primary"
        aria-hidden="true"
      />

      <div className="flex max-w-md flex-col gap-2">
        <p className="font-mono text-sm tracking-widest text-foreground uppercase">
          {title}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted dark:bg-secondary"
        aria-hidden="true"
      >
        <div className="h-full w-1/3 rounded-full bg-primary motion-safe:animate-cold-start-bar motion-reduce:w-full" />
      </div>

      <span className="sr-only">{title}. {description}</span>
    </div>
  );
}

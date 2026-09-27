import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSectionSkeleton() {
  return (
    <section
      className="relative px-6 py-16 md:px-12 lg:px-24"
      aria-busy="true"
      aria-label="Despertando el servidor para cargar los proyectos"
    >
      <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Despertando el servidor en la nube, esto tomará unos segundos…
      </p>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-primary/20 pb-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-20 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <Skeleton className="h-[280px] w-full rounded-2xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </section>
  );
}

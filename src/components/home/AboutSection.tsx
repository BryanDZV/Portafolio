"use client";

import { type ReactNode, useRef } from "react";
import { m, useInView, useReducedMotion, easeInOut } from "framer-motion";
import { Code2, MapPin, Rocket as LucideRocket, Terminal } from "lucide-react";
import { Motion3DCard } from "@/components/ui/Motion3DCard";
import { AnimatedSplitTitle } from "@/components/ui/AnimatedSplitTitle";

interface AboutDictionary {
  title1: string;
  title2: string;
  card1_title: string;
  card1_description: string;
  card2_title: string;
  card2_location: string;
  card3_title: string;
  card4_title: string;
  card4_description1: string;
  card4_description2: string;
}

export function AboutSection({ dictionary }: { dictionary: AboutDictionary }) {
  const constraintsRef = useRef(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sectionInView = useInView(sectionRef, { amount: 0.15, once: false });

  const shouldAnimateLoops = !shouldReduceMotion && sectionInView;

  // QUE HACE: Declara el stack tecnológico mostrado como unidades interactivas dentro de la tarjeta de habilidades.
  // POR QUE SE ELIGIO: Un arreglo plano inmutable simplifica renderizado declarativo, reduce complejidad accidental y facilita mantenimiento de contenido.
  // COMO FUNCIONA: Se itera con map en la capa de UI para producir chips arrastrables con key estable basada en cada tecnología.
  // APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react
  const techStack = [
    "Next.js",
    "React",
    "Angular",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "TypeScript",
    "Tailwind",
  ];

  // QUE HACE: Define la transición de entrada compartida por las tarjetas sticky de la sección About.
  // POR QUE SE ELIGIO: Centralizar variantes evita duplicación de configuraciones de animación y mantiene coherencia perceptiva entre bloques.
  // COMO FUNCIONA: Cada motion.div consume hidden/visible y framer-motion interpola opacidad, escala y desplazamiento vertical con easing uniforme.
  // APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react
  const slideInVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeInOut },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 w-full bg-transparent px-4 py-24 md:px-12 md:py-28 lg:px-24"
    >
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_50%_20%,rgba(120,0,255,0.14),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.1),transparent_40%)]"
      />

      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-20 flex flex-col items-center md:items-start">
          <AnimatedSplitTitle
            as="h2"
            line1={dictionary.title1}
            line2={dictionary.title2}
            viewportAmount={0.35}
            className="text-5xl md:text-7xl font-black tracking-tighter italic text-foreground drop-shadow-xl"
            line1ClassName="text-projects-heading"
            line2ClassName="text-primary italic"
          />
        </header>

        <div className="flex flex-col gap-24 pb-[20vh] relative ">
          {/* QUE HACE: Construye un storytelling por capas usando tarjetas sticky que se superponen progresivamente durante el scroll. */}
          {/* POR QUE SE ELIGIO: Este patrón aumenta retención visual, mejora jerarquía de contenido y evita cambios bruscos de contexto en pantallas grandes. */}
          {/* COMO FUNCIONA: Cada tarjeta fija un offset distinto con top y z-index; la combinación produce un efecto de apilado controlado por viewport. Al permitir reingreso, la animación se repite cada vez que la tarjeta vuelve a entrar en pantalla. */}
          {/* APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react */}
          <AboutStickyCard
            variants={slideInVariants}
            stickyClassName="top-24 z-10"
            shadowClassName="shadow-[0_-15px_30px_-15px_rgba(120,0,255,0.15)]"
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-8 md:p-16 text-center">
              <AnimatedTerminalIcon
                shouldReduceMotion={shouldReduceMotion}
                shouldAnimate={shouldAnimateLoops}
              />
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <AnimatedText
                  text={dictionary.card1_title}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </h3>
              {/*parrafos de la cartas */}
              <div className="text-muted-foreground leading-relaxed text-xl md:text-2xl max-w-3xl">
                <AnimatedText
                  text={dictionary.card1_description}
                  delay={0.3}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </div>
          </AboutStickyCard>

          {/* TARJETA 2: UBICACIÓN */}
          <AboutStickyCard
            variants={slideInVariants}
            stickyClassName="top-32 z-20"
            shadowClassName="shadow-[0_-15px_30px_-15px_rgba(34,211,238,0.15)]"
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-8 md:p-16 text-center">
              <AnimatedRadarIcon
                shouldReduceMotion={shouldReduceMotion}
                shouldAnimate={shouldAnimateLoops}
              />
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                <AnimatedText
                  text={dictionary.card2_title}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </h3>
              <div className="text-muted-foreground tracking-widest uppercase text-xl font-mono">
                <AnimatedText
                  text={dictionary.card2_location}
                  delay={0.2}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </div>
          </AboutStickyCard>

          {/* TARJETA 3: CORE STACK */}
          <AboutStickyCard
            variants={slideInVariants}
            stickyClassName="top-40 z-30"
            shadowClassName="shadow-[0_-15px_30px_-15px_rgba(120,0,255,0.15)]"
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-8 md:p-16 text-center">
              <AnimatedLaserCodeIcon
                shouldReduceMotion={shouldReduceMotion}
                shouldAnimate={shouldAnimateLoops}
              />
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-12">
                <AnimatedText
                  text={dictionary.card3_title}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </h3>

              <div
                ref={constraintsRef}
                className="w-full max-w-3xl relative flex flex-wrap justify-center gap-4"
              >
                {/* QUE HACE: Habilita interacción drag en cada tecnología dentro de un contenedor con límites físicos definidos. */}
                {/* POR QUE SE ELIGIO: La microinteracción incrementa engagement sin introducir navegación extra ni estado global adicional. */}
                {/* COMO FUNCIONA: dragConstraints referencia el contenedor padre y framer-motion aplica elasticidad y cancelación de momentum para control preciso. */}
                {/* APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react */}
                {techStack.map((tech) => (
                  <m.div
                    key={tech}
                    drag
                    dragConstraints={constraintsRef}
                    dragElastic={0.2}
                    dragMomentum={false}
                    whileDrag={{
                      scale: 1.15,
                      cursor: "grabbing",
                      zIndex: 50,
                    }}
                    whileHover={
                      shouldReduceMotion ? undefined : { scale: 1.05, y: -5 }
                    }
                    className="px-6 py-3 text-lg font-mono text-foreground bg-white/5 border border-white/10 rounded-xl cursor-grab active:cursor-grabbing backdrop-blur-md shadow-xl hover:bg-white/10 transition-opacity"
                  >
                    {tech}
                  </m.div>
                ))}
              </div>
            </div>
          </AboutStickyCard>

          {/* TARJETA 4: FILOSOFÍA */}
          <AboutStickyCard
            variants={slideInVariants}
            stickyClassName="top-48 z-40"
            shadowClassName="shadow-[0_-15px_30px_-15px_rgba(34,211,238,0.15)]"
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-8 md:p-16 text-center">
              <AnimatedRocketIcon
                shouldReduceMotion={shouldReduceMotion}
                shouldAnimate={shouldAnimateLoops}
              />
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <AnimatedText
                  text={dictionary.card4_title}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </h3>
              <div className="text-muted-foreground leading-relaxed text-xl md:text-2xl max-w-3xl">
                <AnimatedText
                  text={dictionary.card4_description1}
                  delay={0.2}
                  shouldReduceMotion={shouldReduceMotion}
                />
                <br className="mb-2" />
                <AnimatedText
                  text={dictionary.card4_description2}
                  delay={1.5}
                  className="text-primary font-semibold"
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </div>
          </AboutStickyCard>
        </div>
      </div>
    </section>
  );
}

interface AboutStickyCardProps {
  variants: {
    hidden: { opacity: number; scale: number; y: number };
    visible: {
      opacity: number;
      scale: number;
      y: number;
      transition: { duration: number; ease: typeof easeInOut };
    };
  };
  stickyClassName: string;
  shadowClassName: string;
  children: ReactNode;
}

// QUE HACE: Estandariza el contenedor sticky + tarjeta 3D para las cuatro capas narrativas de la sección About.
// POR QUE SE ELIGIO: El patrón se repetía con la misma estructura base; extraerlo reduce deuda y facilita ajustes coherentes.
// COMO FUNCIONA: Recibe variantes, posicionamiento sticky y sombra específica para renderizar un Motion3DCard con el mismo pipeline de viewport.
// APRENDE MAS: https://react.dev/learn/passing-props-to-a-component y https://motion.dev/docs/react
function AboutStickyCard({
  variants,
  stickyClassName,
  shadowClassName,
  children,
}: AboutStickyCardProps) {
  return (
    <m.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className={`sticky ${stickyClassName} w-full h-[60vh] min-h-[500px]`}
    >
      <Motion3DCard className={`w-full h-full ${shadowClassName}`}>
        {children}
      </Motion3DCard>
    </m.div>
  );
}

// QUE HACE: Renderiza texto con revelado progresivo palabra a palabra y fallback accesible sin animación.
// POR QUE SE ELIGIO: Separa la responsabilidad de animación textual para reutilización y mantiene el componente de sección enfocado en layout.
// COMO FUNCIONA: Divide el string en tokens, aplica variantes con staggerChildren y activa whileInView para ejecutar la entrada al entrar en viewport. Al desactivar once, el reveal se repite cada vez que el texto vuelve a cruzar el umbral visible.
// APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react

function AnimatedText({
  text,
  className = "",
  delay = 0,
  shouldReduceMotion,
}: {
  text: string;
  className?: string;
  delay?: number;
  shouldReduceMotion: boolean;
}) {
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: easeInOut },
    },
  };

  return (
    <m.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {words.map((word, index) => (
        <m.span key={index} variants={child} className="mr-[0.25em]">
          {word}
        </m.span>
      ))}
    </m.span>
  );
}

// QUE HACE: Encapsula íconos animados independientes para reforzar semántica visual de cada tarjeta de About.
// POR QUE SE ELIGIO: Componentizar animaciones evita acoplamiento con layout principal y facilita ajuste de rendimiento por pieza.
// COMO FUNCIONA: Cada icono define su propia secuencia motion con duraciones cortas e infinitas condicionadas por preferencia de movimiento reducido.
// APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react

function AnimatedTerminalIcon({
  shouldReduceMotion,
  shouldAnimate,
}: {
  shouldReduceMotion: boolean;
  shouldAnimate: boolean;
}) {
  return (
    <m.div
      animate={
        shouldReduceMotion || !shouldAnimate
          ? undefined
          : { y: [0, -10, 0], scale: [1, 1.05, 1] }
      }
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 mb-8 flex items-center justify-center w-20 h-20"
    >
      {/* QUE HACE: Renderiza el icono de terminal con movimiento periódico para reforzar identidad de desarrollo en la tarjeta de presentación. */}
      {/* POR QUE SE ELIGIO: Reemplazar trazos SVG manuales por lucide-react reduce superficie de mantenimiento y normaliza estilo iconográfico del módulo. */}
      {/* COMO FUNCIONA: Framer Motion anima desplazamiento y escala del contenedor mientras un cursor inferior parpadea para simular actividad de consola. */}
      {/* APRENDE MAS: https://lucide.dev/guide/packages/lucide-react y https://motion.dev/docs/react */}
      <Terminal className="text-primary w-full h-full drop-shadow-[0_0_20px_rgba(120,0,255,0.6)]" />
      <m.div
        animate={
          shouldReduceMotion || !shouldAnimate
            ? undefined
            : { opacity: [1, 0.2, 1] }
        }
        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1 h-[2px] w-7 rounded-full bg-primary/90"
      />
    </m.div>
  );
}

function AnimatedRadarIcon({
  shouldReduceMotion,
  shouldAnimate,
}: {
  shouldReduceMotion: boolean;
  shouldAnimate: boolean;
}) {
  return (
    <div className="relative mb-8 z-10 flex items-center justify-center w-20 h-20">
      <m.div
        animate={
          shouldReduceMotion || !shouldAnimate
            ? undefined
            : { scale: [1, 2.5], opacity: [0.6, 0] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 bg-cyan-500 rounded-full blur-xl"
      />
      {/* QUE HACE: Sustituye el radar SVG manual por un icono de ubicación de librería manteniendo el feedback visual de pulso geográfico. */}
      {/* POR QUE SE ELIGIO: La versión de librería mejora consistencia entre tarjetas y evita depender de geometría vectorial custom difícil de mantener. */}
      {/* COMO FUNCIONA: Se combina un halo expansivo absoluto con un movimiento vertical suave del icono principal para simular escaneo de posición. */}
      {/* APRENDE MAS: https://lucide.dev/guide/packages/lucide-react y https://motion.dev/docs/react */}
      <m.div
        animate={
          shouldReduceMotion || !shouldAnimate
            ? undefined
            : {
                y: [0, -8, 0],
                filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"],
              }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full"
      >
        <MapPin className="text-cyan-400 w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
      </m.div>
    </div>
  );
}

function AnimatedLaserCodeIcon({
  shouldReduceMotion,
  shouldAnimate,
}: {
  shouldReduceMotion: boolean;
  shouldAnimate: boolean;
}) {
  return (
    <m.div
      className="relative z-10 mb-8 flex items-center justify-center w-20 h-20"
      title="Code Stack"
    >
      {/* QUE HACE: Reemplaza el icono de chevrons SVG por una representación de código de librería con animación cíclica de actividad. */}
      {/* POR QUE SE ELIGIO: Unificar la fuente de iconos simplifica evolución del diseño y reduce inconsistencias visuales entre secciones del portfolio. */}
      {/* COMO FUNCIONA: El contenedor aplica rotación y pulso de escala, mientras una capa de brillo usa opacidad animada para enfatizar estado activo. */}
      {/* APRENDE MAS: https://lucide.dev/guide/packages/lucide-react y https://motion.dev/docs/react */}
      <m.div
        animate={
          shouldReduceMotion || !shouldAnimate
            ? undefined
            : { rotate: [-5, 5, -5], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        <Code2 className="text-purple-400 w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        <m.div
          animate={
            shouldReduceMotion || !shouldAnimate
              ? undefined
              : { opacity: [0.2, 0.7, 0.2] }
          }
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1 rounded-xl bg-purple-400/20 blur-sm"
        />
      </m.div>
    </m.div>
  );
}

function AnimatedRocketIcon({
  shouldReduceMotion,
  shouldAnimate,
}: {
  shouldReduceMotion: boolean;
  shouldAnimate: boolean;
}) {
  return (
    <m.div
      animate={
        shouldReduceMotion || !shouldAnimate
          ? undefined
          : { y: [0, -10, 0], x: [0, 2, -2, 0], scale: [1, 1.06, 1] }
      }
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 mb-8 flex items-center justify-center w-20 h-20"
    >
      {/* QUE HACE: Sustituye el SVG manual por un icono de librería y conserva la semántica visual de despegue en la tarjeta de filosofía. */}
      {/* POR QUE SE ELIGIO: Centralizar iconografía en lucide-react reduce deuda de mantenimiento, evita geometría hardcodeada y mejora consistencia visual del sistema. */}
      {/* COMO FUNCIONA: Se renderiza el componente Rocket de lucide-react con tamaño fijo y se aplica una oscilación angular continua con framer-motion cuando no hay preferencia de movimiento reducido. */}
      {/* APRENDE MAS: https://react.dev/reference/react y https://motion.dev/docs/react */}
      <m.div
        animate={
          shouldReduceMotion || !shouldAnimate
            ? undefined
            : {
                rotate: [-8, 6, -8],
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
              }
        }
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <LucideRocket className="text-primary w-full h-full drop-shadow-[0_0_20px_rgba(120,0,255,0.6)]" />
      </m.div>
      <m.div
        animate={
          shouldReduceMotion || !shouldAnimate
            ? undefined
            : { opacity: [0.35, 1, 0.35], scaleY: [0.7, 1.35, 0.7], originY: 0 }
        }
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-5 h-7 bg-orange-500 rounded-full blur-md opacity-60 mix-blend-screen"
      />
    </m.div>
  );
}

import {
  siAngular,
  siCss,
  siExpress,
  siFirebase,
  siFramer,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

export interface TechItem {
  name: string;
  icon: SimpleIcon;
}

export const TECH_STACK: TechItem[] = [
  { name: "Next.js", icon: siNextdotjs },
  { name: "React", icon: siReact },
  { name: "Angular", icon: siAngular },
  { name: "TypeScript", icon: siTypescript },
  { name: "JavaScript", icon: siJavascript },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Express", icon: siExpress },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "Framer Motion", icon: siFramer },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "MySQL", icon: siMysql },
  { name: "MongoDB", icon: siMongodb },
  { name: "HTML5", icon: siHtml5 },
  { name: "CSS", icon: siCss },
];

export interface ResolvedTechBadge {
  key: string;
  label: string;
  icon: SimpleIcon | null;
}

const TECH_ICON_MAP: Array<{ match: RegExp; icon: SimpleIcon }> = [
  { match: /next/, icon: siNextdotjs },
  { match: /react/, icon: siReact },
  { match: /angular/, icon: siAngular },
  { match: /node|node\.js/, icon: siNodedotjs },
  { match: /express/, icon: siExpress },
  { match: /typescript|ts\b/, icon: siTypescript },
  { match: /javascript|js\b/, icon: siJavascript },
  { match: /tailwind/, icon: siTailwindcss },
  { match: /framer/, icon: siFramer },
  { match: /postgres|postgresql/, icon: siPostgresql },
  { match: /mysql/, icon: siMysql },
  { match: /mongo|mongodb/, icon: siMongodb },
  { match: /firebase/, icon: siFirebase },
  { match: /html/, icon: siHtml5 },
  { match: /css/, icon: siCss },
];

export function getTechIcon(tech: string): SimpleIcon | null {
  const normalizedTech = tech.toLowerCase();
  const match = TECH_ICON_MAP.find((item) => item.match.test(normalizedTech));
  return match?.icon ?? null;
}

export function TechIconGlyph({
  icon,
  className,
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}

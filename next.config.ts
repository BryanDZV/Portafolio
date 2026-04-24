import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
    // QUE HACE: Habilita la optimización de imports para paquetes grandes de iconos y evita incluir módulos completos en el bundle inicial.
    // POR QUE SE ELIGIO: Es el patrón oficial de Next.js para reducir JavaScript transferido cuando usamos subpaths de iconos.
    // COMO FUNCIONA: El compilador reescribe imports a rutas más granulares para cargar solo los íconos efectivamente referenciados.
    // APRENDE MAS: https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports y https://nextjs.org/docs/app/building-your-application/optimizing
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wwvkxykeeiekvwgaqfqz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
// QUE HACE: Importa la funcion de analisis de paquetes.
// POR QUE SE ELIGIO: Se usa una importacion dinamica o condicional para no ensuciar el objeto de configuracion base.
// COMO FUNCIONA: Envuelve el objeto nextConfig; si la variable ANALYZE es true, intercepta el build para generar el reporte.
// APRENDE MAS: https://www.npmjs.com/package/@next/bundle-analyzer

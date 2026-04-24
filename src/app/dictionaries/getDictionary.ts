import "server-only";

//importamos los diccionarios de traducción de forma dinámica para optimizar la carga y evitar incluir todos los idiomas en el bundle inicial.
//usamos lazy loading con import() para que solo se cargue el idioma necesario según la ruta (ej: /es o /en).
const dictionaries = {
  es: () => import("./es.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return (
    dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.es()
  );
};

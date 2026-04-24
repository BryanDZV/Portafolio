// QUE HACE: Declara la cadena de plugins PostCSS usada por Tailwind en la compilación de estilos.
// POR QUE SE ELIGIO: Mantener configuración mínima reduce superficie de error y deja el pipeline CSS explícito.
// COMO FUNCIONA: PostCSS consume este objeto y ejecuta `@tailwindcss/postcss` durante la transformación del CSS global.
// APRENDE MAS: https://postcss.org/
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

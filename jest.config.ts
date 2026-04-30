import nextJest from "next/jest";

//Concepto: configuración del adaptador next/jest.
//Problema+Cómo: Alinea Jest con la configuración de Next.js SWC y App Router para que las pruebas se compilen como la aplicación; envuelve la configuración de Jest con los valores predeterminados de Next.js.
//Documentos: https://nextjs.org/docs/app/building-your-application/testing/jest
const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  //Concepto: testEnvironment.
  //Problema+Cómo: Utiliza un DOM similar a un navegador a través de jsdom para que los componentes de React se representen en las pruebas.
  //Documentos: https://jestjs.io/docs/configuration#testenvironment-string
  testEnvironment: "jest-environment-jsdom",

  //Concepto: setupFilesAfterEnv.
  //Problema+Cómo: ejecuta el código de configuración después de que Jest esté listo, habilitando comparadores personalizados como jest-dom.
  //Documentos: https://jestjs.io/docs/configuration#setupfilesafterenv-array
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  //Concepto: moduleNameMapper.
  //Problema+Cómo: Asigna alias de ruta (por ejemplo, @/...) a carpetas reales para que las importaciones se resuelvan en las pruebas.
  //Documentos: https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  //Concepto: testPathIgnorePatterns.
  //Problema+Cómo: omite las carpetas generadas o de proveedores para reducir el ruido y acelerar las ejecuciones.
  //Documentos: https://jestjs.io/docs/configuration#testpathignorepatterns-arraystring
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],

  //Concepto: recopilarCoverageFrom.
  //Problema+Cómo: Define qué archivos cuentan para la cobertura para que los informes reflejen el código fuente real.
  //Documentos: https://jestjs.io/docs/configuration#collectcoveragefrom-array
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};

export default createJestConfig(customJestConfig);

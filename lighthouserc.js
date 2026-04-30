module.exports = {
  // Concepto: Configuracion de Lighthouse CI.
  // Problema y como funciona: Centraliza reglas de recoleccion, aserciones y carga de reportes.
  // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
  ci: {
    collect: {
      // Concepto: startServerCommand.
      // Problema y como funciona: Levanta el servidor de Next.js para medir la app real.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectstartservercommand
      startServerCommand: "npm run start -- --port=3000",

      // Concepto: startServerReadyPattern.
      // Problema y como funciona: Espera un mensaje generico de ready antes de iniciar mediciones.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectstartserverreadypattern
      startServerReadyPattern: "ready",

      // Concepto: startServerReadyTimeout.
      // Problema y como funciona: Da mas tiempo para que el servidor quede listo.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectstartserverreadytimeout
      startServerReadyTimeout: 20000,

      // Concepto: url.
      // Problema y como funciona: Define las URLs a auditar para generar metricas.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collecturl
      url: ["http://localhost:3000/"],

      // Concepto: numberOfRuns.
      // Problema y como funciona: Promedia varias ejecuciones para reducir ruido.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectnumberofruns
      numberOfRuns: 3,
    },
    assert: {
      // Concepto: assertions.
      // Problema y como funciona: Define umbrales minimos para advertir sobre regresiones.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#assertions
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["warn", { minScore: 0.8 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      // Concepto: upload target.
      // Problema y como funciona: Publica el reporte en almacenamiento temporal para compartir el enlace.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#uploadtarget
      target: "temporary-public-storage",
    },
  },
};

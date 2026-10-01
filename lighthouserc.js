module.exports = {
  // Concepto: Configuracion de Lighthouse CI.
  // Problema y como funciona: Centraliza reglas de recoleccion, aserciones y carga de reportes.
  // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
  ci: {
    collect: {
      // Concepto: startServerCommand.
      // Problema y como funciona: Levanta el servidor de Next.js para medir la app real.
      // Usamos el comando de Next.js directamente para que funcione en Windows
      // y en los runners Linux de GitHub Actions.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectstartservercommand
      startServerCommand: "npm run start -- --port=3000",

      // Concepto: startServerReadyPattern.
      // Problema y como funciona: Espera un mensaje del servidor antes de iniciar mediciones.
      // Next.js imprime lines como "Local:         http://localhost:3000" y "Ready in Xms".
      // Usamos "Local:" para detectar que el servidor ya está escuchando.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectstartserverreadypattern
      startServerReadyPattern: "Local:",

      // Concepto: startServerReadyTimeout.
      // Problema y como funciona: Da mas tiempo para que el servidor quede listo.
      // Aumentamos a 30000ms para entornos lentos.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectstartserverreadytimeout
      startServerReadyTimeout: 30000,

      // Concepto: url.
      // Problema y como funciona: Define las URLs a auditar para generar metricas.
      // Probamos la URL final `/en` porque `/` redirige y eso estaba causando errores 500.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collecturl
      url: ["http://localhost:3000/en"],

      // Concepto: numberOfRuns.
      // Problema y como funciona: Promedia varias ejecuciones para reducir ruido.
      // Para CI reducimos a 1 para evitar falsos negativos por inestabilidad del servidor.
      // Documentacion: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collectnumberofruns
      numberOfRuns: 1,
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

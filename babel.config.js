// Configuración de Babel (traduce el código moderno para que corra en el teléfono).
// Agregamos el plugin inline-import para poder importar los .sql de migración
// como si fueran módulos de código.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["inline-import", { extensions: [".sql"] }]],
  };
};

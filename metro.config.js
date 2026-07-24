// Configuración de Metro (el "empaquetador" de Expo).
// Sumamos "sql" a las extensiones que Metro entiende, para que pueda importar
// los archivos de migración .sql que genera Drizzle.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

module.exports = config;

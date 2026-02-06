const fs = require('fs').promises;

async function leerArchivo(ruta) {
  try {
    const data = await fs.readFile(ruta, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

async function escribirArchivo(ruta, data) {
  await fs.writeFile(ruta, JSON.stringify(data, null, 2));
}

module.exports = {
  leerArchivo,
  escribirArchivo
};

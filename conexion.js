const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://felipemunoz2704:felipemunoz2704@cluster0.vrioqsa.mongodb.net/big-data?retryWrites=true&w=majority")
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

const languageStatsSchema = new mongoose.Schema({
  popular_libraries: [String],
  lenguajes_ia: {
    porcentaje_uso_mundial: [
      {
        lenguaje: String,
        porcentaje: Number
      }
    ],
    top_10_mundial: [String],
    top_5_chile: [String],
    llm_comercio_chile: [
      {
        lenguaje: String,
        uso: String
      }
    ]
  }
}, { collection: 'ias-bd' });

const LanguageStats = mongoose.model('LanguageStats', languageStatsSchema);

app.get('/', async (req, res) => {
  try {
    const stats = await LanguageStats.findOne(); // solo hay un documento, o el primero
    if (!stats) return res.status(404).json({ message: 'Datos no encontrados' });
    res.json(stats.lenguajes_ia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

app.use(cors());
app.use(express.json());

// Configurar conexión SQL Server
const dbConfig = {
    user: 'ADMIN',
    password: '1234',
    server: 'localhost', // puede ser 'localhost' o una IP
    database: 'NEW_HORIZONT',
    options: {
        encrypt: false, // true si usas Azure o conexión segura
        trustServerCertificate: true // para conexiones locales
    }
};

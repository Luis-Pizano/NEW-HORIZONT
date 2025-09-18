const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer');
const app = express();

const PORT = 8080;

// Configuración de Multer (archivos en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());

// Configuración de SQL Server
const dbConfig = {
    user: 'ADMIN',
    password: '1234',
    server: 'localhost',
    database: 'NEW_HORIZONT',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Agregar tema
app.post('/api/add_tema', upload.single('file'), async (req, res) => {
    const { nombre, descripcion } = req.body;
    const fileBuffer = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : null;

    try {
        // Conectar la Base de datos
        await sql.connect(dbConfig);
    // Preparar consulta para evitar inyecciones sql
        const request = new sql.Request();
        request.input('nombre', sql.NVarChar(255), nombre);
        request.input('descripcion', sql.NVarChar(sql.MAX), descripcion);
        request.input('imagen', sql.VarBinary(sql.MAX), fileBuffer);
        request.input('mime_type', sql.NVarChar(50), mimeType);

        await request.query(`
            INSERT INTO TEMAS_USUARIOS (NOMBRE, DESCRIPCION, IMAGEN, MIME_TYPE)
            VALUES (@nombre, @descripcion, @imagen, @mime_type)
        `);

        res.status(200).json({ message: 'Tema agregado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar tema' });
    }
});

// Listar todos los temas
app.get('/api/all_temas', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT ID, NOMBRE, DESCRIPCION, IMAGEN, MIME_TYPE FROM TEMAS_USUARIOS`);

        const temas = result.recordset.map(t => ({
            id: t.ID,
            nombre: t.NOMBRE,
            descripcion: t.DESCRIPCION,
            imagen: t.IMAGEN ? t.IMAGEN.toString('base64') : null,
            mime_type: t.MIME_TYPE || 'image/jpeg'
        }));

        res.status(200).json(temas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener temas' });
    }
});

// Detalle de tema
app.get('/api/theme_detail/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        request.input('id', sql.Int, id);

        const result = await request.query(`SELECT * FROM TEMAS_USUARIOS WHERE ID = @id`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el tema.' });
        }

        const tema = result.recordset[0];

        // Convertir la imagen a Base64 solo si existe
        let imagenBase64 = null;
        if (tema.IMAGEN) {
            imagenBase64 = Buffer.isBuffer(tema.IMAGEN)
                ? tema.IMAGEN.toString('base64')
                : Buffer.from(tema.IMAGEN).toString('base64');
        }

        res.status(200).json({
            id: tema.ID,
            nombre: tema.NOMBRE,
            descripcion: tema.DESCRIPCION,
            imagen: imagenBase64,
            mime_type: tema.MIME_TYPE || 'image/jpeg'
        });

    } catch (error) {
        console.error(`Error al obtener el detalle del tema ${id}:`, error);
        res.status(500).json({ message: 'Ocurrió un error en el servidor.' });
    }
});


//Edicion de temas subidos por los usuarios (Solo los administradores pueden editar)
app.put('/api/editar_tema/:id', upload.single('file'), async (req, res) => {
    const { nombre, descripcion } = req.body;
    const { id } = req.params;
    const uploadFile = req.file ? req.file.buffer : null;

    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        request.input('id', sql.Int, id);
        request.input('nombre', sql.VarChar(255), nombre);
        request.input('descripcion', sql.VarChar(sql.MAX), descripcion);
        request.input('imagen', sql.VarBinary(sql.MAX), uploadFile);

        // Updater por referenciass y no directamente la variable, evita inyecciones SQL
        await request.query(`
            UPDATE TEMAS_USUARIOS SET NOMBRE = @nombre, DESCRIPCION = @descripcion, 
            IMAGEN = @imagen WHERE ID = @id`);

        res.status(200).json({ message: 'Éxito en update' });
    } catch (error) {
        console.error(`Error en la actualización de datos: ${error}`);
        res.status(500).json({ error: 'Error al actualizar el tema' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
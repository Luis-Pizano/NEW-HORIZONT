const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importar bcrypt
const multer = require('multer'); // Permite la que se guarde correctamente imagenes y videos
const path = require('path');

// Configuración de Multer para almacenar los archivos en memoria
const storage = multer.memoryStorage();

// Inicialización de Multer con la configuración de almacenamiento en memoria
const upload = multer({ storage: storage });


const app = express();
const PORT = 8080;

app.use(cors({
    origin: 'http://localhost:3000',  // o la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Ruta para registrar usuarios
app.post('/api/register', async (req, res) => {
    const { name, last_name_father, last_name_Mother, phone_number, email, password } = req.body; // Accede a los name de los input

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de sal

        // Conectar a la base de datos
        await sql.connect(dbConfig);

        // Ejecutar la inserción con la contraseña encriptada
        await sql.query`
            INSERT INTO CUENTAS (nombre, apellido_paterno, apellido_materno, telefono, correo, contraseña)
            VALUES (${name}, ${last_name_father}, ${last_name_Mother}, ${phone_number}, ${email}, ${hashedPassword})
        `;

        res.status(200).json({ message: 'Registro exitoso con contraseña encriptada' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }
});


app.post('/api/add_tema', upload.single('file'), async (req, res) => {
    const { nombre, descripcion } = req.body;
    const uploadFile = req.file ? req.file.buffer : null;  // El contenido binario del archivo

    try {
        // Conectar a la base de datos
        await sql.connect(dbConfig);

        // Preparar la consulta SQL con parámetros para prevenir inyección SQL
        const request = new sql.Request();
        request.input('nombre', sql.VarChar(255), nombre.toUpperCase());
        request.input('descripcion', sql.VarChar(sql.MAX), descripcion.toUpperCase());
        request.input('imagen', sql.VarBinary(sql.MAX), uploadFile);  // Almacenar el archivo binario

        // Ejecutar la inserción de los datos en la tabla
        await request.query(`
            INSERT INTO TEMAS_USUARIOS (nombre, descripcion, imagen)
            VALUES (@nombre, @descripcion, @imagen)
        `);

        res.status(200).json({ message: 'Éxito al ingresar valores' });

    } catch (error) {
        console.error(`Ocurrió un error al intentar subir el contenido, error: ${error}`);
        res.status(500).json({ message: 'Ocurrió un error al intentar insertar los registros.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

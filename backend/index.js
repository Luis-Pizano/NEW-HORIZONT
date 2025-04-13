const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importar bcrypt

const app = express();
const PORT = 8080;

app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

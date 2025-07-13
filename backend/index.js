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
        const admin = 0

        // Conectar a la base de datos
        await sql.connect(dbConfig);

        // Ejecutar la inserción con la contraseña encriptada
        await sql.query`
            INSERT INTO CUENTAS (nombre, apellido_paterno, apellido_materno, telefono, correo, contraseña,visitante,administrador)
            VALUES (${name}, ${last_name_father}, ${last_name_Mother}, ${phone_number}, ${email}, ${hashedPassword},1,${admin})
        `;

        res.status(200).json({ message: 'Registro exitoso con contraseña encriptada' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }
});

//Agregar temas
app.post('/api/add_tema', upload.single('file'), async (req, res) => {
    const { nombre, descripcion } = req.body;
    const uploadFile = req.file ? req.file.buffer : null;  // El contenido binario del archivo

    try {
        // Conectar a la base de datos
        await sql.connect(dbConfig);

        // Preparar la consulta SQL con parámetros para prevenir inyección SQL
        const request = new sql.Request();
        request.input('nombre', sql.VarChar(255), nombre.toUpperCase());
        request.input('descripcion', sql.VarChar(sql.MAX), descripcion);
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

//Listado de todos los temas
app.get('/api/all_temas', async (req,res) => {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query(`SELECT * FROM TEMAS_USUARIOS`);

        const temasProcesados = result.recordset.map(tema => {
            let imagenBase64 = null;

            if (tema.IMAGEN) {
                // Si es un Buffer, conviértelo a base64
                if (Buffer.isBuffer(tema.IMAGEN)) {
                    imagenBase64 = tema.IMAGEN.toString('base64');
                } else if (tema.IMAGEN.data) {
                    // En caso de que venga con estructura { data: [...] }
                    imagenBase64 = Buffer.from(tema.IMAGEN.data).toString('base64');
                }
            }

            return {
                id: tema.ID,
                nombre: tema.NOMBRE,
                descripcion: tema.DESCRIPCION,
                imagen: imagenBase64,
                mime_type: 'image/jpeg'
            };
        });

        res.status(200).json({
            message: "Exito en la operacion GET.",
            data: temasProcesados
        });
        console.log(`exito en la consulta Select`);
    } catch (error) {
        res.status(500).json({ message: `Ocurrio un error en el servidor al intentar hacer el GET de la información.` });
        console.error(`Error en el Get, error ${error}`);
    }
});

// Detalle de temas
app.get('/api/theme_detail/:id', async (req,res) =>{
    const {id} = req.params; // params es una referencia en este caso
    try{
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM TEMAS_USUARIOS WHERE ID = ${id}`);

        if (result.recordset.length === 0){
            res.status(404).json({message: 'No se encontro el tema.'})
            console.error(`No se encontro el tema del id ${id}`)
            return;
        }

        const temasProcesados = result.recordset.map(tema =>{
           let imagenBase64  = null;

           if(tema.IMAGEN){
            if(Buffer.isBuffer(tema.IMAGEN)){
                imagenBase64  = tema.IMAGEN.toString('base64');
            } else if(tema.IMAGEN.data){
                imagenBase64  = Buffer.from(tema.IMAGEN.data).toString('base64');
            }
           }
           return{
            id: tema.ID,
            nombre: tema.NOMBRE,
            descripcion:  tema.DESCRIPCION,
            imagen: imagenBase64 ,
            mime_type: 'image/jpeg'
        }
        })

        res.status(200).json(temasProcesados[0]);

    } catch(error){
        res.status(500).json({message: `Ocurrio un error en el servidor al intentar traer el detalle del objeto ${id}`});
        console.error(`Error en el select para detalle, Error: ${error}`);
    }
})

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

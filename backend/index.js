import express, { response } from 'express';
import sql from 'mssql';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const PORT = 8080;

// Configuración de Multer (archivos en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuración de CORS
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

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { name, last_name_father, last_name_Mother, phone_number, email, password } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Preparar la consulta
        request.input("name", sql.NVarChar(255), name);
        request.input("last_name_father", sql.NVarChar(255), last_name_father);
        request.input("last_name_Mother", sql.NVarChar(255), last_name_Mother || null);
        request.input("phone_number", sql.NVarChar(50), phone_number);
        request.input("email", sql.NVarChar(255), email);
        request.input("password", sql.NVarChar(255), hashedPassword);

        await request.query(`
            INSERT INTO CUENTAS 
            (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO, [CONTRASEÑA], VISITANTE)
            VALUES 
            (@name, @last_name_father, @last_name_Mother, @phone_number, @email, @password, 1)
        `);

        res.status(201).json({ message: "Registro exitoso", success: true });

    } catch (error) {
        console.error("Error en /api/register:", error);

        // Manejar email duplicado
        if (error.number === 2627) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        res.status(500).json({ message: "Error al registrar usuario", error });
    }
});


// Traer cuenta por ID
app.get('/api/Cuenta/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        request.input('id', sql.Int, id);

        const result = await request.query('SELECT * FROM CUENTAS WHERE ID = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró la cuenta.' });
        }

        // Devolver solo la cuenta encontrada
        res.status(200).json(result.recordset[0]);

    } catch (error) {
        console.error(`Error al traer la cuenta ${id}`, error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

//Editar cuenta por ID
app.put('/api/editar_cuenta/:id', async (req, res) => {
    const { id } = req.params;
    const { name, last_name_father, last_name_Mother, phone_number, email , visitante, administrador } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();

        request.input('id', sql.Int, id);
        request.input("name", sql.NVarChar(255), name);
        request.input("last_name_father", sql.NVarChar(255), last_name_father);
        request.input("last_name_Mother", sql.NVarChar(255), last_name_Mother || null);
        request.input("phone_number", sql.NVarChar(50), phone_number);
        request.input("email", sql.NVarChar(255), email);
        request.input("visitante", sql.Bit, visitante ? 1 : 0);
        request.input("administrador", sql.Bit, administrador ? 1 : 0);

        await request.query(`UPDATE CUENTAS SET NOMBRE = @name, APELLIDO_PATERNO = @last_name_father,
             APELLIDO_MATERNO = @last_name_Mother, TELEFONO = @phone_number, CORREO = @email,
             VISITANTE = @visitante, ADMINISTRADOR =@administrador WHERE ID = @id`)
        res.status(200).json({ message: `Exito en la actualización de datos.` })
    } catch (error) {
        console.log(`Error en la actualización de esta cuenta, Cuenta de ID: ${id}, error ${error}`);
    }
})


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

// Search para bsuqueda de tema mediante parametro nombre
app.get('/api/search', async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ message: "Debe enviar el parámetro 'search'" });
    }

    try {
        await sql.connect(dbConfig);
        console.log("Conexion para Search.")

        const request = new sql.Request();

        // Le pasamos el parámetro con % para hacer búsqueda parcial
        request.input("nombre", sql.NVarChar, `%${search}%`);

        // Usamos LIKE para coincidencias parciales
        const result = await request.query(
            "SELECT * FROM TEMAS_USUARIOS WHERE NOMBRE COLLATE SQL_Latin1_General_CP1_CI_AI LIKE @nombre"
        );


        const temas = result.recordset.map(t => ({
            id: t.ID,
            nombre: t.NOMBRE,
            descripcion: t.DESCRIPCION,
            imagen: t.IMAGEN ? t.IMAGEN.toString('base64') : null,
            mime_type: t.MIME_TYPE || 'image/jpeg'

        }));

        res.status(200).json({
            message: "Éxito en búsqueda",
            success: true,
            data: temas
        });

    } catch (error) {
        console.error("Error en search:", error);
        res.status(500).json({ message: "Error en search", error });
    }
});

// Listado de cuentas 
app.get('/api/cuentas', async (req, res) => {
    try {
        const connect = await sql.connect(dbConfig)

        const result = await connect.query('SELECT * FROM CUENTAS')
        const cuentas = result.recordset.map(user => ({
            id: user.ID,
            nombre: user.NOMBRE,
            apellido_paterno: user.APELLIDO_PATERNO,
            apellido_materno: user.APELLIDO_MATERNO,
            telefono: user.TELEFONO,
            correo: user.CORREO,
            visitante: user.VISITANTE,
            administrador: user.ADMINISTRADOR,
            fecha_creacion: user.FECHA_CREACION,
        }));
        res.status(200).json(cuentas)

    } catch (error) {
        res.status(500).json({ message: `Administrador, Hubo un error en el listado de cuentas, Codigo de error: ${error}` })
    }
})

//API para login
app.post('/api/login', async (req, res) => {
    const { password, email } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ message: "Debe ingresar un correo y contraseña." });
        }

        await sql.connect(dbConfig);

        const request = new sql.Request();

        request.input("email", sql.VarChar, email);

        const result = await request.query(
            'SELECT * FROM CUENTAS WHERE CORREO = @email'
        );

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        const user = result.recordset[0];

        let rol = "visitante";
        if (user.ADMINISTRADOR === true || user.ADMINISTRADOR === 1) {
            rol = "administrador";
        }


        // Comparamos la contraseña con bcrypt
        const password_correct = await bcrypt.compare(password, user["CONTRASEÑA"])

        if (!password_correct) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }


        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Clave secreta JWT no definida en el servidor." });
        }

        const token = jwt.sign({ id: user.ID, email: user.CORREO, rol }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: 'Login exitoso.', token, rol })

    } catch (error) {
        res.status(500).json({ message: `Error interno en el servidor,` });
    }

})

// Logout

const removeToken = new Set();

app.post('/api/logout', (req, res) => {

    const authLogin = req.headers.authorization;
    if (!authLogin) {
        return res.status(401).json({ message: `No hay token` })
    }
    const token = authLogin.split(' ')[1];
    removeToken.add(token);
    res.status(200).json({ message: "Logout exitoso." });
})

//API eliminar cuenta por ID

app.delete("/api/delete_cuenta/:id", async (req,res) => {
    const {id} = req.params;
    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input("id",sql.Int(),id);

        request.query('') // FALTA LA QUERY DE DELETE

    } catch (error) {
        console.error(`Error para eliminar esta cuenta.`)
    }
})

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
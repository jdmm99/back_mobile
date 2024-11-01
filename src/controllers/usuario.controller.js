
import { getConection } from "../database/database.js";
// iniciarSesion
export const iniciarSesion  = async (req, res) => {
    const {numero_cuenta,  contraseña} = req.body;
    try{
        //Busqueda de usuario por numero 
        const connection = await getConection();
        const [usuarios] = await connection.query(
            'SELECT * FROM usuarios WHERE numero_cuenta = ? and contraseña=?', 
            [numero_cuenta, contraseña]
        );
        //Verificacion de existencia del usuario
        if (usuarios.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Usuario no encontrado' 
            });
        }
         const usuario = usuarios[0];

         // Comparacion de contraseña
        if (usuario.contraseña !== contraseña) {
            return res.status(401).json({ 
                mensaje: 'Contraseña incorrecta' 
            });
        }
        // Eliminar contraseña antes de enviar datos del usuario
        const { contraseña: pass, ...usuarioSinContraseña } = usuario;
        
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: usuarioSinContraseña
        });
    }catch (err) {
        res.status(500).json({
            mensaje: 'Error en el inicio de sesión',
            error: err.message
        });

        }    
}

const registrarUsuario = async (req, res) => {
    const connection = await getConection();
    try{
        const {nombre,email,contraseña,numero_cuenta,tipo,saldo = 0} = req.body;

        // Validaciones básicas
        if (!nombre || !email || !contraseña || !numero_cuenta || !tipo) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si el email ya existe
        const [emailExistente] = await connection.query(
            'SELECT email FROM usuarios WHERE email = ?',
            [email]
        );
        

        if (emailExistente.length > 0) {
            return res.status(400).json({
                mensaje: 'El email ya está registrado'
            });
        }

        // Verificar si el número de cuenta ya existe
        const [cuentaExistente] = await connection.query(
            'SELECT numero_cuenta FROM usuarios WHERE numero_cuenta = ?',
            [numero_cuenta]
        );

        if (cuentaExistente.length > 0) {
            return res.status(400).json({
                mensaje: 'El número de cuenta ya está registrado'
            });
        }

        // Insertar nuevo usuario
        const [result] = await connection.query(
            'INSERT INTO usuarios(nombre, email, contraseña, numero_cuenta, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, email, contraseña, numero_cuenta, tipo, saldo]
        );
        // Respuesta exitosa
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: result.insertId,nombre,email,numero_cuenta,tipo,saldo
            }
        });

    }catch (err) {
        res.status(500).json({
            mensaje: 'Error al registrar usuario',
            error: err.message
        });

    }
}

 export const metodosUsuario = {
    iniciarSesion,
    registrarUsuario,
 }
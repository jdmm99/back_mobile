import { getConection } from '../database/database.js';

// iniciarSesion
const iniciarSesion  = async (req, res) => {
    const {numero_cuenta,  contraseña} = req.body;
    try{
        //Busqueda de usuario por numero 
        const connection  = await getConection();
        const [usuarios] = await connection.query(
            'SELECT * FROM usuarios WHERE numero_cuenta = ?', 
            [numero_cuenta]
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


//Obtener perfil

const obtenerPerfil = async (req, res) => {
    try{
        const { usuario_id } = req.params;
        const connection = await getConection();

        const [usuarios] = await connection.query(
            'SELECT id, nombre, email, numero_cuenta, tipo_cuenta, saldo FROM usuarios WHERE id = ?',
            [usuario_id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Usuario no encontrado' 
            });
        }
        
        const usuario = usuarios[0];

        // Obtener últimas transacciones
        const [transacciones] = await connection.query(
            `SELECT tipo, monto, fecha 
             FROM transacciones 
             WHERE cuenta_id = ? 
             ORDER BY fecha DESC 
             LIMIT 5`,
            [usuario_id]
        );

        res.json({
            usuario,
            ultimasTransacciones: transacciones
        });

    }catch (err) {
        res.status(500).json({
            mensaje: 'Error al obtener perfil',
            error: err.message
        });
    }
}

export const metodosUsuario ={
    iniciarSesion,
    obtenerPerfil
}
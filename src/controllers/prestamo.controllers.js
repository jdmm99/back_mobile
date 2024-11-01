import { getConection } from "../database/database.js";

const solicitarPrestamo = async (req, res) => {
    try {
        const { usuario_id, monto, plazo } = req.body;
        const connection = await getConection();

        // Validar que el usuario existe
        const [usuario] = await connection.query(
            'SELECT * FROM usuarios WHERE id = ?',
            [usuario_id]
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        // Validar si el usuario ya tiene préstamos pendientes
        const [prestamosActivos] = await connection.query(
            'SELECT * FROM prestamos WHERE usuario_id = ? AND estado = "pendiente"',
            [usuario_id]
        );

        if (prestamosActivos.length > 0) {
            return res.status(400).json({
                mensaje: 'El usuario ya tiene un préstamo pendiente'
            });
        }

        // Insertar la solicitud de préstamo
        const [result] = await connection.query(
            'INSERT INTO prestamos (usuario_id, monto, plazo, estado, fecha_solicitud) VALUES (?, ?, ?, "pendiente", NOW())',
            [usuario_id, monto, plazo]
        );

        res.json({
            mensaje: 'Solicitud de préstamo registrada exitosamente',
            prestamo: {
                id: result.insertId,
                usuario_id,
                monto,
                plazo,
                estado: 'pendiente'
            }
        });

    } catch (err) {
        res.status(500).json({
            mensaje: 'Error al solicitar préstamo',
            error: err.message
        });
    }
};

const obtenerPrestamos = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const connection = await getConection();

        // Obtener todos los préstamos del usuario
        const [prestamos] = await connection.query(
            `SELECT p.*, u.nombre as nombre_usuario 
             FROM prestamos p 
             INNER JOIN usuarios u ON p.usuario_id = u.id 
             WHERE p.usuario_id = ?
             ORDER BY p.fecha_solicitud DESC`,
            [usuario_id]
        );

        res.json(prestamos);

    } catch (err) {
        res.status(500).json({
            mensaje: 'Error al obtener préstamos',
            error: err.message
        });
    }
};

const actualizarEstadoPrestamo = async (req, res) => {
    try {
        const { prestamo_id } = req.params;
        const { estado } = req.body;
        const connection = await getConection();

        // Validar que el estado sea válido
        const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado de préstamo no válido'
            });
        }

        // Actualizar estado del préstamo
        const [result] = await connection.query(
            'UPDATE prestamos SET estado = ? WHERE id = ?',
            [estado, prestamo_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Préstamo no encontrado'
            });
        }

        res.json({
            mensaje: 'Estado del préstamo actualizado exitosamente',
            estado: estado
        });

    } catch (err) {
        res.status(500).json({
            mensaje: 'Error al actualizar estado del préstamo',
            error: err.message
        });
    }
};

export const metodosPrestamos = {
    solicitarPrestamo,
    obtenerPrestamos,
    actualizarEstadoPrestamo
};
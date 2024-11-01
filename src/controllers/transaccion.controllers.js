import { getConection } from "../database/database.js";

const obtenerTransacciones = async (req, res) => {
 const connection = await getConection();
 try{
    const { usuario_id } = req.params;
     const [transacciones] = await connection.query(
            `SELECT t.id, t.tipo,t.monto,
            t.fecha, u.nombre,u.numero_cuenta
             FROM transacciones t
             INNER JOIN usuarios u ON t.cuenta_id = u.id
             WHERE t.cuenta_id = ?
             ORDER BY t.fecha DESC`,
            [usuario_id]
        );
        if (transacciones.length === 0) {
            return res.status(404).json({
                mensaje: 'No se encontraron transacciones para este usuario'
            });
        }
        res.json({
            mensaje: 'Transacciones encontradas',
            transacciones: transacciones
        });

    }catch (err) {
        res.status(500).json({
            mensaje: 'Error al obtener las transacciones',
            error: err.message
        });
    }
}
const realizarTransferencia = async (req, res) =>{
    const connection = await getConection();
    try{
        const { cuenta_origen, cuenta_destino, monto } = req.body;
        // Iniciar transacción
        await connection.beginTransaction();

        try {
            // Verificar saldo suficiente en cuenta origen
            const [cuentaOrigen] = await connection.query(
                'SELECT id, saldo FROM Usuarios WHERE numero_cuenta = ?',
                [cuenta_origen]
            );
            if (cuentaOrigen.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    mensaje: 'Cuenta de origen no encontrada'
                });
            }

            if (cuentaOrigen[0].saldo < monto) {
                await connection.rollback();
                return res.status(400).json({
                    mensaje: 'Saldo insuficiente'
                });
            }
            // Verificar que existe la cuenta destino
            const [cuentaDestino] = await connection.query(
                'SELECT id FROM usuarios WHERE numero_cuenta = ?',
                [cuenta_destino]
            );

            if (cuentaDestino.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    mensaje: 'Cuenta de destino no encontrada'
                });
            }
             // Realizar la transferencia
            // 1. Restar dinero de cuenta origen
            await connection.query(
                'UPDATE usuarios SET saldo = saldo - ? WHERE numero_cuenta = ?',
                [monto, cuenta_origen]
            );

            // 2. Sumar dinero a cuenta destino
            await connection.query(
                'UPDATE usuarios SET saldo = saldo + ? WHERE numero_cuenta = ?',
                [monto, cuenta_destino]
            );

            // 3. Registrar transacción para cuenta origen (egreso)
            await connection.query(
                'INSERT INTO transacciones (cuenta_id, tipo, monto) VALUES (?, ?, ?)',
                [cuentaOrigen[0].id, 'transferencia', monto]
            );

            // 4. Registrar transacción para cuenta destino (ingreso)
            await connection.query(
                'INSERT INTO transacciones (cuenta_id, tipo, monto) VALUES (?, ?, ?)',
                [cuentaDestino[0].id, 'deposito', monto]
            );

            // Confirmar transacción
            await connection.commit();

            res.json({
                mensaje: 'Transferencia realizada con éxito',
                monto: monto,
                cuenta_origen: cuenta_origen,
                cuenta_destino: cuenta_destino
            });
        }catch (error) {
            // Si hay error, revertir cambios
            await connection.rollback();
            throw error;
        }
    }catch (err) {
        res.status(500).json({
            mensaje: 'Error al realizar la transferencia',
            error: err.message
        });
    }
}

const realizarDeposito = async (req, res) => {
    const connection = await getConection();
    try {
        const { cuenta_destino, monto } = req.body;

        // Validar que el monto sea positivo
        if (monto <= 0) {
            return res.status(400).json({
                mensaje: 'El monto a depositar debe ser mayor que cero'
            });
        }

        // Iniciar transacción
        await connection.beginTransaction();

        try {
            // Verificar que existe la cuenta destino
            const [cuentaDestino] = await connection.query(
                'SELECT id, saldo FROM usuarios WHERE numero_cuenta = ?',
                [cuenta_destino]
            );

            if (cuentaDestino.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    mensaje: 'Cuenta de destino no encontrada'
                });
            }

            // Sumar dinero a cuenta destino
            await connection.query(
                'UPDATE usuarios SET saldo = saldo + ? WHERE numero_cuenta = ?',
                [monto, cuenta_destino]
            );

            // Registrar transacción para cuenta destino (ingreso)
            await connection.query(
                'INSERT INTO transacciones (cuenta_id, tipo, monto) VALUES (?, ?, ?)',
                [cuentaDestino[0].id, 'depósito', monto]
            );

            // Confirmar transacción
            await connection.commit();

            res.json({
                mensaje: 'Depósito realizado con éxito',
                monto: monto,
                cuenta_destino: cuenta_destino
            });
        } catch (error) {
            // Si hay error, revertir cambios
            await connection.rollback();
            throw error;
        }
    } catch (err) {
        res.status(500).json({
            mensaje: 'Error al realizar el depósito',
            error: err.message
        });
    }
}
const realizarRetiro = async (req, res) => {
    try {
        const { numero_cuenta, monto } = req.body;
        const connection = await getConection();

        // Primero verificamos que exista la cuenta y tenga saldo suficiente
        const [usuario] = await connection.query(
            'SELECT id, saldo FROM usuarios WHERE numero_cuenta = ?',
            [numero_cuenta]
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                mensaje: 'Cuenta no encontrada'
            });
        }

        const { id, saldo } = usuario[0];

        // Verificar que tenga saldo suficiente
        if (saldo < monto) {
            return res.status(400).json({
                mensaje: 'Saldo insuficiente',
                saldo_actual: saldo
            });
        }

        // Actualizar saldo
        await connection.query(
            'UPDATE usuarios SET saldo = saldo - ? WHERE id = ?',
            [monto, id]
        );

        // Registrar la transacción
        await connection.query(
            'INSERT INTO transacciones (cuenta_id, tipo, monto) VALUES (?, ?, ?)',
            [id, 'retiro', monto]
        );

        // Obtener saldo actualizado
        const [saldoActualizado] = await connection.query(
            'SELECT saldo FROM usuarios WHERE id = ?',
            [id]
        );

        res.json({
            mensaje: 'Retiro realizado con éxito',
            monto_retirado: monto,
            saldo_actual: saldoActualizado[0].saldo
        });

    } catch (err) {
        res.status(500).json({
            mensaje: 'Error al procesar el retiro',
            error: err.message
        });
    }
};
    
export const metodosTransacciones = {
    obtenerTransacciones,
    realizarTransferencia,
    realizarDeposito,
    realizarRetiro
}
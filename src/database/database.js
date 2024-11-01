import mysql from 'mysql2/promise';
import { config } from '../config.js';

//Crear conexión
const connection = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port:  config.dbPort
})

//Crear constante para la conexion
const getConection = () => {
    return connection;
}

export { getConection };

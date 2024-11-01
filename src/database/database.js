import mysql from 'mysql2/promise';

//Crear conexión
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'estabanquito',
    port:  '3306'
});

//Crear constante para la conexion
 const getConection = () => {
    return connection;
 }

 export { getConection };



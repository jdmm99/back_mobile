import app from './app.js'

const main = () => {
    app.listen(app.get('port'))
    console.log('La app está escuchando por el puerto: ', app.get('port'))
}
 main()
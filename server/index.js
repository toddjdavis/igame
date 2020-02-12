require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const {SESSION_SECRET, CONNECTION_STRING, SERVER_PORT} = process.env
const gameController = require('./gameController')
const userController = require('./userController')
const app = express()

app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 3600000}
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db is ready to game')
    app.listen(SERVER_PORT, ()=> console.log(`server is listening on port: ${SERVER_PORT}`))
})

//////game endpoints 
////get
//Dashboard.js
app.get('/api/games', gameController.getAllGames)
app.get('/api/games/comment/:id', gameController.getComments)
app.get('/api/games/rating/:id', gameController.getRating)
app.get('/api/game/:id', gameController.getGame)
//Profile.js
app.get('/api/games/mine', gameController.getMyGames)
////post
//Dashboard.js
app.post('/api/comment', gameController.addComment)
app.post('/api/games/like', gameController.likeAGame)
app.post('/api/games/rate', gameController.rateGame)
app.post('/api/games/look', gameController.searchGame)
//Form.js
app.post('/api/games/post', gameController.addGame)
////put
//Dashboard.js
app.put('/api/comment/update/:id', gameController.updateComment)
//Form.js
app.put('/api/game/update/:id', gameController.updateGame)
////delete
app.delete('/api/game/delete/:id', gameController.deleteGame)
app.delete('/api/comment/delete/:id', gameController.deleteComment)
app.delete('/api/game/unlike/:id', gameController.unlike)

////user endpoints
app.post('/auth/register', userController.register)
app.post('/auth/login', userController.login)
app.get('/auth/logout', userController.logout)
app.put('/auth/email/:id', userController.updateEmail)
const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req, res) =>{
        console.log(req.body)
        const {email, password, user_picture} = req.body
        const db = req.app.get('db')
        let userCheck = await db.user.get_user(email)
        if (userCheck[0]){
            return res.status(409).send('email already registered')
        }
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        let newUser = await db.user.register(email, hash, user_picture)
        req.session.user = {user_id: newUser[0].user_id, email: newUser[0].email, user_picture: newUser[0].user_picture}
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        const {email, password} = req.body
        const db = req. app.get('db')
        let user = await db.user.get_user(email)
        if (!user[0]){
            return res.status(400).send('email nt registered')
        }
        let authenticated = bcrypt.compareSync(password, user[0].password)
        if(!authenticated){
            res.status(401).send('password incorrect')
        }
        req.session.user = {user_id: user[0].user_id, email: user[0].email,
        user_picture: user[0].user_picture}
        res.status(202).send(req.session.user)
    },
    logout: (req, res) => {
        console.log('hit')
        req.session.destroy()
        res.sendStatus(200)
    },
    updateEmail: async (req, res) => {
        const {email} = req.body
        const db = req. app.get('db')
        const {user_id} = req.session.user
        let newEmail = await db.user.update_email(email, user_id)
        res.status(200).send(newEmail)
    }
}
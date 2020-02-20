require('dotenv').config()
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const {EMAIL, PASSWORD} = process.env
module.exports = {
    register: async (req, res) =>{
        // console.log(req.body)
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
        // console.log(req.body)
        const {email, password} = req.body
        const db = req.app.get('db')
        let user = await db.user.get_user(email)
        // console.log(user)
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
        // console.log(req.body)
        const {email, user_picture} = req.body
        const db = req. app.get('db')
        const {id} = req.params
        let newEmail = await db.user.update_email(email, id , user_picture)
        console.log(newEmail)
        res.status(200).send(newEmail)
    },
    email: async (req, res) => {
        const {email} = req.body
        let message = 'Thank you for registering your account'
        let image = 'https://i.etsystatic.com/17857814/r/il/5e775c/1612229339/il_570xN.1612229339_bj2s.jpg'
        try {
            // console.log(EMAIL)
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL,
                    pass: PASSWORD
                }
            })
            let info = await transporter.sendMail({
                from: EMAIL,
                to: `<${email}>`,
                subject: 'Register',
                text: message,
                html: `<div>${message}</div>
                       <img src="cid:unique@nodemailer.com"/>`,

                attachments: [
                    { 
                      filename: 'license.txt',
                      path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
                    },
                    { 
                      cid: 'unique@nodemailer.com', 
                      path: image
                    }
                  ]
            }, (err, res) => {
                if (err) {
                    console.log('err', err)
                } else {
                    console.log('res', res)
                    res.status(200).send(info)
                }
            })
        } catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    },
    async getProfile(req, res){
        const db = req.app.get('db')
        const {id} = req. params
        let profileInfo = await db.user.get_profile(id)
        res.status(200).send(profileInfo)
    },
    async getMyChats(req, res){
        const db = req.app.get('db')
        // console.log(req.session)
        const {id} = req.params
        console.log(id)
        let myChats = await db.messages.get_my_chats(id)
        res.status(200).send(myChats)
    }
}
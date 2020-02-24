module.exports={
    async buyGame(req, res){
        console.log(req.body)
        const {user_id, game_id} = req.body
        const db = req.app.get('db')
        await db.purchase.buy_game(game_id, user_id)
        res.sendStatus(200)
    },
    async postBuyGame(req, res){
        console.log(req.body)
        const {game_id, shipping, price} = req.body
        const db = req.app.get('db')
        await db.purchase.post_buy_game(game_id, price, shipping)
        res.sendStatus(200)
    },
    async getBuyGame(req, res){
        console.log(req.params)
        const db = req.app.get('db')
        const {id} = req.params
        let game = await db.purchase.get_buy_game(id)
        res.status(200).send(game)
    },
    async updateBuyGame(req, res){
        const db = req.app.get('db')
        console.log('id', req.params, 'body', req.body)
        const {id} = req.params
        const {price, shipping} = req.body
        await db.purchase.update_buy_game(price, shipping, id)
        res.sendStatus(200)
    },
    async makeAvailable(req, res){
        const db = req.app.get('db')
        console.log('hit')
        const {id} = req.body
        await db.purchase.make_game_available(id)
        res.sendStatus(200)
    }
}
module.exports = {
    //get endpoint
    //this will get every game in the database
    getAllGames: async (req, res) => {
        const db = req.app.get('db')
        // console.log('hit')
        let games = await db.game.get_all_games()
        // console.log(games)
        res.status(200).send(games)
    },
    //this will get all the games your signed in user has liked
    getMyGames: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        let games = await db.game.get_my_games(+user_id)
        res.status(200).send(games)
    },
    //this will get all the likes and comments for games as they display
    getRating: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params
        let info = await db.game.get_rating(+id)
        res.status(200).send(info)
    },
    //this function will get all the comments for one game and send it to the front end
    getComments: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params
        let info = await db.game.get_comments(+id)
        res.status(200).send(info)
    },
    //when a use select a specific game this will fire showing just the one game
    getGame: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params
        // console.log(id)
        let game = await db.game.get_game(id)
        // console.log(game)
        res.status(200).send(game)  
    },
    //if a user is looking for just one game this will alow the user to search for that game
    searchGame: async (req, res) => {
        const db = req.app.get('db')
        console.log(req.body)
        const {search} = req.body
        let searched = await db.game.search_games(search)
        // console.log(searched)
        res.status(200).send(searched)
    },
    ////post endpoints
    //when a user is logged in they can post a game and and the front end will route them back to the main dashboard which will have a componentDidMount() and will fire the getAllGames request
    addGame: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {title, description, game_picture} = req.body
        await db.game.post_game(user_id, title, description, game_picture)
        res.sendStatus(200)
    },
    //after a user has been signed in they can comments, after they comment this will return every comment on the game and redisplay them in order of posting
    addComment: async (req, res) => {
        const db = req.app.get('db')
        // console.log(req.session)
        const {user_id} = req.session.user
        // console.log(req.body)
        const {game_id, comment} = req.body
        
        let newComment = await db.game.add_comment(user_id, game_id, comment)
        res.status(200).send(newComment)
    },
    //this will add a game to the users liked games ist if they are logged in
    likeAGame: async (req, res) => {
        const db = req.app.get('db')
        // console.log(req.session)
        const {user_id} = req.session.user
        const {game_id} = req.body
        // console.log(game_id)
        // console.log(user_id)
        let liked = await db.game.like_game(user_id, game_id)
        res.status(200).send(liked)
    },
    // if a user is signed in they can like a game and it will adjust the current rating on the game
    rateGame: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        // console.log(req.body)
        const {game_id, rating} = req.body
        let rate = await db.game.rate_game(user_id, game_id, rating)
        res.status(200).send(rate)
    },
    //put -these endpoints will only be available for the poster of them endpoints
    //the user will be able to change the description, title and picture with this method, this will not return anything because you will be routed to a new page on the front end
    updateGame: async (req, res) => {
        const db = req.app.get('db')
        // console.log('body', req.body, 'user', req.session.user, 'id', req.params)
        const {user_id} = req.session.user
        const {title, description, game_picture} = req.body
        const {id} = req.params
        db.game.update_game(title, description, game_picture, id,user_id)
        res.sendStatus(200)
    },
    
    //haven't made functional on the front end yet
    // this will update a posted comment and will return all the comments from the selected game
    updateComment: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {comment} = req.body
        const {id} = req.params
        db.game.update_comment(comment, comment_id, user_id)
        let info = await db.game.get_rating_andComments(id)
        res.status(200).send(info)
    },
    //delete endpoints
    //this is where users can delete there comments and games they have posted
    //this will remove a game a user has posted
    deleteGame: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {id} = req.params
        db.game.delete_game(id, user_id)
        res.sendStatus(200)
    },
    //haven't made functional on the front end yet
    deleteComment: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {id} = req.params
        db.game.delete_comment(id, user_id)
        res.sendStatus(200)
    }
}
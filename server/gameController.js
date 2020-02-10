module.exports = {
    //get endpoint
    //this will get every game in the database
    getAllGames: async (req, res) => {
        const db = req.app.get('db')
        let games = await db.game.get_all_games()
        res.status(200).send(games)
    },
    //this will get all the games your signed in user has liked
    getMyGames: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        let games = await db.game.get_my_games(user_id)
        res.status(200).send(games)
    },
    //this will get all the likes and comments for games as they display
    getRatingAndComments: async (req, res) => {
        const db = req.app.get('db')
        const {game_id} = req.body
        let info = await db.game.get_rating_andComments(game_id)
        res.status(200).send(info)
    },
    //when a use select a specific game this will fire showing just the one game
    getGame: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params
        let game = await db.get_game(id)
        res.status(200).send(game)  
    },
    //post endpoints
    //when a user is logged in they can post a game and and the front end will route them back to the main dashboard which will have a componentDidMount() and will fire the getAllGames request
    addGame: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {title, descriptions, game_picture} = req.body
        let newGame = await db.game.post_game(user_id, title, descriptions, game_picture)
        res.sendStatus(200)
    },
    //after a user has been signed in they can comments, after they comment this will return every comment on the game and redisplay them in order of posting
    addComment: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {game_id, comment} = req.body
        let newComment = await db.game.add_comment(user_id, game_id, comment)
        res.status(200).send(newComment)
    },
    //this will add a game to the users liked games ist if they are logged in
    likeAGame: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {game_id} = req.body
        let liked = await db.game.like_game(user_id, game_id)
        res.status(200).send(liked)
    },
    // if a user is signed in they can like a game and it will a just the current rating on the game
    rateGame: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {game_id, rating} = req.body
        let rate = await db.game.rate_game(user_id, game_id, rating)
        res.status(200).send(rate)
    },
    //put -these endpoints will only be available for the poster of them endpoints
    //the user will be able to change the description, title and picture with this method, this will not return anything because you will be routed to a new page on the front end
    updateGame: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {title, descriptions, game_picture} = req.body
        const {game_id} = req.params
        db.game.update_game(title, descriptions, game_picture, game_id,user_id)
        res.sendStatus(200)
    },
    // this will update a posted comment and will return all the comments from the selected game
    updateComment: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {comment} = req.body
        const {comment_id} = req.params
        db.game.update_comment(comment, comment_id, user_id)
        let info = await db.game.get_rating_andComments(game_id)
        res.status(200).send(info)
    },
    //delete endpoints
    //this is where users can delete there comments and games they have posted
    //this will remove a game a user has posted
    deleteGame: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {game_id} = req.params
        db.game.delete_game(game_id, user_id)
        res.sendStatus(200)
    },
    deleteComment: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {comment_id} = req.params
        db.game.delete_comment(comment_id, user_id)
        res.sendStatus(200)
   }
}
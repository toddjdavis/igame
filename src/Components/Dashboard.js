import React, {Component} from 'react'
import './Dashboard.css'
import axios from 'axios'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

class Dashboard extends Component {
    constructor(){
        super()
        this.state ={
            games: [],
            rating: [],
            comments: [],
            game_picture: '',
            title: '',
            description: '',
            commentText: '',
            search: '',
            email: '',
            liked: false,
            available: false,
            userRating: null,
            game_id: null,
            user_id: null
        }
    }
    componentDidMount(){
        axios.get('/api/games').then(res => {
            this.setState({games: res.data})
        }).catch(err=>console.log(err))
        if(this.props.match.params.id){
            this.select(this.props.match.params.id)
        }
    }

    
    //this function will use three endpoints to set the state for comments, rating and selected game values when a user selects a game they would like to view
    select = (value) => {
        this.setState({game_id:value})
        axios.get(`/api/game/${value}`).then(res => {
            // console.log(res.data)
            this.setState({
                game_picture: res.data[0].game_picture,
                title: res.data[0].title,
                description: res.data[0].description,
                user_id: res.data[0].user_id,
                email: res.data[0].email,
                available: res.data[0].available,
                userRating: null
            })
            axios.get(`/api/games/comment/${value}`).then(res1=> {
                // console.log(res1.data)
                this.setState({comments: res1.data})
                axios.get(`/api/games/rating/${value}`).then(res2=> {
                    this.setState({rating: res2.data})
                }).catch(err=>console.log('rating', err))
            }).catch(err=>console.log('comment',err))
        }).catch(err=>console.log('game',err))
    }
    handleComment = (value) => {
        this.setState({commentText: value})
    }
    handleRating = (value) => {
        // console.log(value)
        this.setState({userRating: value})
    }
    handleSearch = (value) => {
        this.setState({search: value})
    }
    //this will check and see if a use is logged in and has enter text in there comment and then post and return the entire comment array for the selected game
    addComment = () => {
        if(!this.props.user.user.loggedIn){
            return(
                this.errorToUser('Please login')
            )
        }
        if(!this.state.commentText){
            return(
                this.errorToUser('Please enter a comment')
            )
        }
        const {commentText, game_id} = this.state
        // console.log(game_id)
        axios.post('/api/comment', {comment: commentText, game_id: game_id}).then(res => {
            this.setState({comments: res.data})
        }).catch(err=>console.log(err))
    }
    //this will check if a user has logged in and if they have it will add the game to there liked game array
    likeGame = () => {
        if(!this.props.user.user.loggedIn){
            return(
                this.errorToUser('Please login to like a game')
            )
        }
        const {game_id} = this.state
            axios.post('/api/games/like', {game_id}).then(res => {
                this.setState({likeGame: true})
            }).catch(err=>console.log(err))
        
        }
    //this will push the user to the forms page so they can  update the game, but with conditionally rendering only the user who posted the game can see the update and delete button
    updateGame=()=> {
        const {game_id} = this.state
            this.props.history.push(`/add/${game_id}`)
    }
    //this will reload the game and remove the game
    deleteGame = (game_id)=> {
        axios.delete(`/api/game/delete/${game_id}`).then(res=> {
            this.setState({
                games: res.data
            })
        })
    }
    //this function will allow admins to delete games off the dashboard
    adminDelete = (id) => {
        axios.delete(`/api/game/delete/${id}`).then(res => {
            console.log(res.data)
            this.setState({games: res.data})
            this.props.history.push('/dashboard')
        }).catch(err=>console.log(err))
    }
    //this will allow you to click on a email and go to there profile page and view the games they have liked as well as message them
    viewProfile=(value)=> {
        console.log(value)
        if(this.props.user.user.loggedIn){
            this.props.history.push(`/profile/${value}`)
        }else{
            return(this.errorToUser('please login to view a users profile'))
        }
    }
    buyGame = () => {
        if(!this.props.user.user.loggedIn){
            return(this.errorToUser('please login to buy a game'))
        }
        const {game_id} = this.state
        this.props.history.push(`/checkout/${game_id}`)
    }
    adminBuyGame = () => {
        const {game_id} = this.state
        this.props.history.push(`/admin/edit/${game_id}`)
    }
    //things function will allow ypu to message the admin to get a game available
    messageAdmin=()=> {
        const {user_id} = this.props.user.user.user
        if(!this.props.user.user.loggedIn){
            return(this.errorToUser('please login to message admin'))
        }else{
            this.props.history.push(`/chat/1/${user_id}/todd@test.com`)
        }
    }
    //this allows users to rate and game and will return the new avg of how the game has been rated
    rateAGame = () => {
        if(!this.props.user.user.loggedIn){
            return(
                this.errorToUser('Please Login to rate this game')
            )
        }
        const {game_id, userRating} = this.state
        if(!userRating){
            return(
                this.errorToUser('please select a rating')
            )
        }
        let rating = userRating
        // console.log(rating)
        axios.post('/api/games/rate', {game_id, rating}).then(res=> {
            this.setState({rating:res.data})
        }).catch(err=>console.log(err))
    }
    //this function will allow you to search through game and update state to the new games that match the passed in params
    searching =()=> {
        const{search}=this.state
        axios.post('/api/games/look', {search}).then(res=>{this.setState({games:res.data})})
        .catch(err=> console.log(err))
    }
    errorToUser = (errorMessage) => { 
        Swal.fire({
        title: 'error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Ok!'
    })}
    render(){
        const {game_picture, user_id, title, description, games, game_id, comments, userRating, rating, email, available} = this.state
        // console.log(this.state.commentText)
        // console.log(this.props.user)
        // console.log(games)
        // console.log(game_picture)
        // console.log(liked)
        // console.log(userRating)
        // console.log(comments)
        
        let mappedGames = games.map((el)=> {
            return(
                <div className='smallGame' onClick={()=> this.select(el.game_id)}>
                    <div className='in-game'>
                        <img className='smallPicture' alt={el.title} src={el.game_picture}/>
                        <h2>{el.title}</h2>
                    </div>
                    {this.props.user.user.user.admin ? (
                        <button onClick={()=>this.adminDelete(el.game_id)} className='search-button'>Delete Game</button>
                    ):(
                        <div></div>
                    )}
                </div>
            )
        })
        let mappedComments = comments.map((el)=> {
            let pic = 'https://cdn2.iconfinder.com/data/icons/bubbles-phone-interface/100/avatar_blank_human_face_contact_user_app-512.png'
            
            return(
                <div onClick={() => this.viewProfile(el.user_id)} className='comment'>
                    <span>{el.comment}</span>
                    <span>: Posted by {el.email} </span>
                    {el.user_picture ? (
                        <img className='comment-picture' src={el.user_picture} />
                    ) : (
                        <img className='comment-picture' src={pic} />
                    )}
                </div>
            )
        })
        let mappedRating = rating.map((el)=> {
            // console.log(el)
            let rate = +el.avg
            // console.log(rate)
            return(
                <div className='rating'>
                    <h1 className='rating-hidden'>Rating: {Math.round(rate *100)/100} /5</h1>
                    <h1 className='large-hidden'>{Math.round(rate *100)/100} /5</h1>
                </div>
            )
        })
        return(
            <div className='dashboard' >
                <div className='gameHolder' id='style-2'>
                    <div className='game'>
                        <input className='search' placeholder='looking for a new game?' onChange={(e) => this.handleSearch(e.target.value)} />
                        <button className='search-button' onClick={this.searching}>Search</button>
                    </div>
                    {mappedGames}
                </div>
                {/* this will either ask you to select a game to view or show you the game you have selected and display the relevant data */}
                {!game_id ?(
                        <h1 >Please Select a game to view</h1>
                        ):(
                            <div className='singleGame' >
                    <div className='ads-space'>
                        <img className='largePicture' src={game_picture} alt={title} />
                    </div>
                    <div className='side'>

                        {this.props.user.user.user.admin ? (
                            <div>
                                {available ?(
                                    <button onClick={this.adminBuyGame} className='buy-button'>Update {title}</button>
                                    ):(
                                    <button onClick={this.adminBuyGame} className='buy-button'>Post {title}</button>
                                    )}
                            </div>
                        ):(
                            <div>
                                {available?(
                                    <button className='buy-button' onClick={this.buyGame}>Buy {title}</button>
                                    ):(
                                        <button className='buy-button' onClick={this.messageAdmin}>Message Admin about {title}</button>
                                        )}
                            </div>
                        )}
                        <div className='title'>
                            <h1>{title}</h1>
                        </div>
                    </div>
                    <div className='desc'>
                        <span id='textBody'>{description}</span>
                    </div>
                    <div className='bar'>
                        <div className='hello-world'>
                            <h3>{mappedRating}</h3>
                        </div>
                        <select className='dropdown' value={userRating} onChange={(e)=> this.handleRating(e.target.value)}>
                            <option className='down' value={null}>select a rating</option>
                            <option className='down' value={1}>1</option>
                            <option className='down' value={2}>2</option>
                            <option className='down' value={3}>3</option>
                            <option className='down' value={4}>4</option>
                            <option className='down' value={5}>5</option>
                        </select>
                        <button className='rate-button' onClick={this.rateAGame}>Rate Game</button>
                        <div className='together'>
                            <div>like this game?</div>
                            <input className='liked' onChange={this.likeGame} type='checkbox'/>
                        </div>
                        {user_id === this.props.user.user.user.user_id ? (
                        <div>
                            <button onClick={()=>this.updateGame(game_id)}>Update?</button>
                            <button onClick={()=>this.deleteGame(game_id)}>Delete?</button>
                        </div>
                        ) : (
                            <div onClick={() => this.viewProfile(user_id)}>Posted by: {email}</div>
                        )}
                    </div>
                    <div className='commentArea'>
                        <div className='addComment'>
                            <textarea placeholder='Write your comment here' onChange={(e) => this.handleComment(e.target.value)}/>
                            <button className='search-button' onClick={this.addComment}>Add Comment</button>
                        </div>
                        <div  className='displayComments' id='style-2'>
                            Comments:
                            {mappedComments}
                        </div>
                    </div>
                </div>
                )}
            </div>
        )
    }
}
//i am using redux to check the state there for when users want to make a comment they have to be logged in first
function mapStateToProps(state){
    return{user: state}
}
export default connect(mapStateToProps)(Dashboard)
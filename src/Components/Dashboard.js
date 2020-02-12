import React, {Component} from 'react'
import './Dashboard.css'
import axios from 'axios'
import { connect } from 'react-redux'

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
            userRating: null,
            liked: false,
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
                alert('Please Login to comment')
            )
        }
        if(!this.state.commentText){
            return(
                alert('Please enter a comment')
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
                alert('Please Login to save a game to your list')
            )
        }
        const {game_id} = this.state
            axios.post('/api/games/like', {game_id}).then(res => {
                this.setState({likeGame: true})
            }).catch(err=>console.log(err))
        
        }
        //this will use the reducer state to see if you are logged in user who posted the game and if you are then it will let edit the game by sending you back to Form.js
        updateGame=()=> {
            const {game_id} = this.state
            if(this.state.user_id === this.props.user.user.user.user_id){
                this.props.history.push(`/add/${game_id}`)
            }else{
                return(alert('only the creator of a game can edit it'))
            }
        }
        deleteGame = (game_id)=> {
            if(this.state.user_id === this.props.user.user.user.user_id){
                axios.delete(`/api/game/delete/${game_id}`).then(res=> {
                    this.setState({
                        games: res.data
                    })
                })
            }else{
                return(alert('only the creator of a game can delete it'))
            }
        }
        //this allows users to rate and game and will return the new avg of how the game has been rated
        rateAGame = () => {
            if(!this.props.user.user.loggedIn){
                return(
                    alert('Please Login to rate this game')
                )
            }
            const {game_id, userRating} = this.state
            if(!userRating){
                return(
                    alert('please select a rating')
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
    render(){
        const {game_picture, user_id, title, description, games, game_id, comments, userRating, rating, email} = this.state
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
                    <img className='smallPicture' alt={el.title} src={el.game_picture}/>
                    <h2>{el.title}</h2>
                </div>
            )
        })
        let mappedComments = comments.map((el)=> {
            return(
                <div className='displayComments'>
                    <span>{el.email}</span>
                    <span>{el.comment}</span>
                </div>
            )
        })
        let mappedRating = rating.map((el)=> {
            // console.log(el)
            return(
                <div>
                    
                    <h1>Rating: {Math.round(el.avg *100)/100} /5</h1>
                </div>
            )
        })
        return(
            <div className='dashboard'>
                <div className='gameHolder'>
                    <input placeholder='looking for a new game?' onChange={(e) => this.handleSearch(e.target.value)} />
                    <button onClick={this.searching}>Search</button>
                    {mappedGames}
                </div>
                {/* this will either ask you to select a game to view or show you the game you have selected and display the relevant data */}
                {!game_id ?(
                    <h1>Please Select a game to view</h1>
                ):(
                <div className='singleGame'>
                    <img className='largePicture' src={game_picture} alt={title} />
                    <h1>{title}</h1>
                    <span id='textBody'>{description}</span>
                    <div className='bar'>
                        <h3>{mappedRating}</h3>
                        <select value={userRating} onChange={(e)=> this.handleRating(e.target.value)}>
                            <option value={null}>select a rating</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                        <button onClick={this.rateAGame}>Rate Game</button>
                        <div className='together'>
                            <div>like this game?</div>
                            <input onChange={this.likeGame} type='checkbox'/>
                        </div>
                        {user_id === this.props.user.user.user.user_id ? (
                        <div>
                            <button onClick={()=>this.updateGame(game_id)}>Update?</button>
                            <button onClick={()=>this.deleteGame(game_id)}>Delete?</button>
                        </div>
                        ) : (
                            <div>Posted by: {email}</div>
                        )}
                    </div>
                    <div className='commentArea'>
                        <div className='addComment'>
                            <textarea placeholder='Write your comment here' onChange={(e) => this.handleComment(e.target.value)}/>
                            <button onClick={this.addComment}>Comment</button>
                        </div>
                        <div>
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
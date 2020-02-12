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
            game_id: null,
            user_id: null,
            liked: false
        }
    }
    componentDidMount(){
        axios.get('/api/games').then(res => {
            this.setState({games: res.data})
        }).catch(err=>console.log(err))
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
                user_id: res.data[0].user_id
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
        updateGame=(game_id)=> {
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
    render(){
        // console.log(this.props.user)
        // console.log(this.state.games)
        // console.log(this.state.game_picture)
        // console.log(this.state.commentText)
        const {game_picture, title, description, games, game_id, comments} = this.state
        // console.log(liked)
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
        return(
            <div className='dashboard'>
                <div className='gameHolder'>
                    All Games
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
                        <h2>Rating(wip)</h2>
                        
                        <div className='together'>
                            <div>like this game?</div>
                            <input onChange={this.likeGame} type='checkbox'/>
                        </div>
                        <div>
                            <button onClick={()=>this.updateGame(game_id)}>Update?</button>
                            <button onClick={()=>this.deleteGame(game_id)}>Delete?</button>
                        </div>
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
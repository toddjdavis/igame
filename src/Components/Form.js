import React, {Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {update} from '../ducks/gameReducer'
import './Dashboard.css'


class Form extends Component {
    constructor(){
        super()
        this.state ={
            game_picture: '',
            title: '',
            description: '',
            update: false,
            game_id: 0
        }
    }
    //if you entered this page from editing it will set the values on state equal to there current values until they are update and then it will kick you back to the dashboard
    componentDidMount(){
        console.log(this.props.match.params.id)
        axios.get(`/api/game/${this.props.match.params.id}`).then(res => {
            console.log('hit')
            this.setState({
                game_picture: res.data[0].game_picture,
                title: res.data[0].title,
                description: res.data[0].description,
                game_id: res.data[0].game_id,
                update: true
            })
        })
    }
    //i used arrow functions so i would not have to bind them in the constructor
    pictureInput = value => {
        this.setState({
            game_picture: value
        })
    }
    titleInput = value => {
        this.setState({
            title: value
        })
    }
    descriptionInput = value => {
        this.setState({
            description: value
        })
    }
    //this will check two conditions before letting someone post a new game first if you ate signed in adn second if you have entered a game fields
    addGame = () => {
        if(!this.props.user.user.loggedIn){
            return(
                alert('Please sign In')
        )
    }
        if(!this.state.title){
            return(
                alert('Please enter a title')
                )
            }
            if(!this.state.game_picture){
            return(
                alert('Please enter a Picture URL')
                )
        }
        if(!this.state.description){
            return(
                alert('Please enter a description')
                )
        }
        const{game_picture, title, description} = this.state
        axios.post('/api/games/post', {title, description, game_picture}).then(res=>{
            this.props.history.push('/dashboard')
        }).catch(err=>console.log(err))
    }
    //after you update the game it will push you back to the dashboard and pull up the game you have updated
    
    render(){
        // console.log(this.props.user.user.loggedIn)
        const{game_id, game_picture, title, description, update} = this.state
        console.log(description)
        console.log(this.props)
        return(
            <div className='dashboard'>
                <div className='singleGame'>
                    <img className='profile-picture' src={game_picture}/>
                    <input placeholder='Picture URL' value={game_picture} onChange={(e)=> this.pictureInput(e.target.value)}/>
                    <input placeholder='Title' value={title} onChange={(e)=> this.titleInput(e.target.value)}/>
                    <textarea placeholder='Description' value={description} onChange={(e)=> this.descriptionInput(e.target.value)}/>
                    {!update ? (
                        <button className='form-button' onClick={this.addGame}>Post Game</button>
                    ):(
                        <button className='form-button' onClick={()=> this.props.update(game_id, title, description, game_picture).then(()=> this.props.history.push(`/dashboard/${game_id}`))}>Update Game</button>
                    )}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{user: state}
}
export default withRouter(connect(mapStateToProps, {update})(Form))
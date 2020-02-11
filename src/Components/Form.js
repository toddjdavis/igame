import React, {Component} from 'react'
import axios from 'axios'

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
        axios.get(`/api/game/${this.props.match.params.id}`).then(res => {
            this.setState({
                game_picture: res.data.game_picture,
                title: res.data.title,
                description: res.data.description,
                game_id: res.data.game_id,
                update: true
            })
        })
    }
    //i used arrow functions so i would not have to bind them in the com
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
    addGame = () => {
        const{game_picture, title, description} = this.state
        axios.post('/api/games/post', {title, description, game_picture}).then(res=>{
            this.props.history.push('/')
        }).catch(err=>console.log(err))
    }
    updateGame = () => {
        const{game_picture, title, description, game_id} = this.state
        axios.put(`/api/games/update/${game_id}`, {title, description, game_picture})
        .then(res=>{
            this.props.history.push('/')
        }).catch(err=>console.log(err))
    }
    render(){
        const{game_picture, title, description, update} = this.state
        return(
            <div>
                <img src={game_picture}/>
                <input placeholder='Picture URL' value={game_picture} onChange={(e)=> this.pictureInput(e.target.value)}/>
                <input placeholder='Title' value={title} onChange={(e)=> this.titleInput(e.target.value)}/>
                <textarea placeholder='Description' value={description} onChange={(e)=> this.descriptionInput(e.target.value)}/>
                {!update ? (
                    <button onClick={this.addGame}>Post Game</button>
                ):(
                    <button onClick={this.updateGame}>Update Game</button>
                )}
            </div>
        )
    }
}

export default Form
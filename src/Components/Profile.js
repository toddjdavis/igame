import React, {Component} from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './Dashboard.css'
class Profile extends Component {
    constructor(){
        super()
        this.state ={  
            games: [],
            email: '',
            user_picture: '',
            user_id: null,
            editing: false
        }
    }
    componentDidMount(){
        this.refresh()
    }
    refresh = () => {
        axios.get('/api/games/mine').then(res=>{
            console.log(res.data)
            this.setState({
                games: res.data,
                email: this.props.user.user.user.email,
                user_picture: this.props.user.user.user.user_picture,
                user_id: this.props.user.user.user.user_id
            })
        })

    }
    handleEmail = (value) => {
        this.setState({email: value})
    }
    handlePicture = (value) => {
        this.setState({user_picture: value})
    }
    sendChanges = () => {
        const {user_id, email, user_picture} = this.state
        console.log(user_id)
        axios.put(`/auth/email/${user_id}`, {email, user_picture}).then(res => {
            console.log(res.data)
            this.setState({
                email: res.data[0].email,
                user_picture: res.data[0].user_picture,
                editing: false
            })
        }).catch(err=>console.log(err))
    }
    edit = () => {
        this.setState({editing:true})
    }
    select = (game_id) => {
        this.props.history.push(`/dashboard/${game_id}`)
    }
    render(){
        // console.log(this.props.user.user.loggedIn)
        // console.log(this.state)
        const {games, email, user_picture, editing} = this.state
        let mappedGames = games.map((el)=> {
            return(
                <div className='smallGame' onClick={()=> this.select(el.game_id)}>
                    <img className='smallPicture' alt={el.title} src={el.game_picture}/>
                    <h2>{el.title}</h2>
                </div>
            )
        })
        return(
            <div >
                {!this.props.user.user.loggedIn ? (
                    <h1>Please Login</h1>
                ): (
                <div className='profile-page'>
                    <div className='profile'>
                        {editing ? (
                            <div>
                                <input placeholder='Profile Picture URL' value={user_picture} onChange={(e)=> this.handlePicture(e.target.value)} />
                                <input placeholder='Email' value={email} onChange={(e)=> this.handleEmail(e.target.value)} />
                                <button onClick={this.sendChanges}>Submit changes</button>
                            </div>
                        ) : (
                            <div>
                                <img className='profile-picture' src={user_picture}/>
                                <h2>Hello: {email}</h2>
                                <button onClick={this.edit}>Edit Profile</button>
                            </div>
                        )}
                    </div>
                    <div className='gameHolder' id='style-2'>
                        My games
                        {mappedGames}
                    </div>
                </div>
                )}
            </div>
        )
    }
}
function mapStateToProps(state){
    return{user: state}
}
export default connect(mapStateToProps)(Profile)
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
            editing: false,
            notYou: false
        }
    }
    //this will look and see if you enter by clicking profile or trying to view another users profile, if you however selected you own comment it will still let you edit your profile
    componentDidMount(){
        if(this.props.match.params.id){
            axios.get(`/api/user/${this.props.match.params.id}`).then(res => {
                // console.log(res.data)
                this.setState({
                    email: res.data[0].email,
                    user_picture: res.data[0].user_picture,
                    user_id: res.data[0].user_id,
                    games: res.data,
                    notYou: true
                })
                // console.log(this.state.user_id, this.props.user.user.user.user_id)
                if(this.state.user_id === this.props.user.user.user.user_id){
                    this.setState({
                        notYou: false
                    })
                }
            })
        } else {
            this.refresh()
        }
    }
    //this function will make an axios call and get your logged in information stored on the reducer state
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
        axios.get('/api/')

    }
    handleEmail = (value) => {
        this.setState({email: value})
    }
    handlePicture = (value) => {
        this.setState({user_picture: value})
    }
    //this will push your update changes to the database 
    sendChanges = () => {
        const {user_id, email, user_picture} = this.state
        // console.log(user_id)
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
    messageUser = () => {
        const {user_id} = this.props.user.user.user
        let id = this.state.user_id
        const {email} = this.state
        this.props.history.push(`/chat/${id}/${user_id}/${email}`)
    }
    render(){
        // console.log(this.props.user.user.loggedIn)
        // console.log(this.state)
        // console.log(this.props)
        const {games, email, user_picture, editing, notYou} = this.state
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
                                {notYou ? (
                                    <button onClick={this.messageUser}>Message</button>
                                ) : (
                                    <button onClick={this.edit}>Edit Profile</button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='gameHolder' id='style-2'>
                    {notYou ? (
                        <div>{email} games</div>           
                    ) : (
                        <div>My Games</div>          
                    )}
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
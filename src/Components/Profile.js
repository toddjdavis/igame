import React, {Component} from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './Dashboard.css'
class Profile extends Component {
    constructor(){
        super()
        this.state ={  
            games: [],
            chats: [],
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
        const {user_id, email, user_picture} = this.props.user.user.user
        axios.get('/api/games/mine').then(res=>{
            // console.log(res.data)
            this.setState({
                games: res.data,
                email: email,
                user_picture: user_picture,
                user_id: user_id
            })
        }).catch(err=>console.log(err))
        axios.get(`/api/chats/${user_id}`).then(res => {
            console.log(res.data)
            this.setState({chats: res.data})
        }).catch(err=>console.log(err))

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
    //this will push users back to the dashboard with the game they selected to see
    select = (game_id) => {
        this.props.history.push(`/dashboard/${game_id}`)
    }
    //this function will pull the user information and create a new chatroom allowing users to talk to each other
    messageUser = () => {
        const {user_id} = this.props.user.user.user
        let id = this.state.user_id
        const {email} = this.state
        this.props.history.push(`/chat/${id}/${user_id}/${email}`)
    }
    //this will let you use the mappedChat array to let you message users you already have active messages with
    messageUserAgain = (id, email) => {
        const {user_id} = this.props.user.user.user
        this.props.history.push(`/chat/${id}/${user_id}/${email}`)
    }
    render(){
        // console.log(this.props.user.user.loggedIn)
        // console.log(this.state)
        // console.log(this.props)
        const {games, email, user_picture, editing, notYou, chats} = this.state
        let mappedGames = games.map((el)=> {
            return(
                <div className='smallGame' onClick={()=> this.select(el.game_id)}>
                    <img className='smallPicture' alt={el.title} src={el.game_picture}/>
                    <h2>{el.title}</h2>
                </div>
            )
        })
        let mappedChats = chats.map((el)=> {
            let pic = 'https://cdn2.iconfinder.com/data/icons/bubbles-phone-interface/100/avatar_blank_human_face_contact_user_app-512.png'
            return(
                <div className='chats' onClick={()=> this.messageUserAgain(el.user_id, el.email)}>
                    {el.user_picture ? (
                        <img className='comment-picture' src={el.user_picture} />
                    ) : (
                        <img className='comment-picture' src={pic} />
                    )}
                    <h4>{el.email}</h4>
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
                                <button className='search-button' onClick={this.sendChanges}>Submit changes</button>
                            </div>
                        ) : (
                            <div>
                                <img className='profile-picture' src={user_picture}/>
                                <h2>Hello: {email}</h2>
                                {notYou ? (
                                    <button className='search-button' onClick={this.messageUser}>Message</button>
                                ) : (
                                    <button className='search-button' onClick={this.edit}>Edit Profile</button>
                                )}
                                {notYou ? (
                                    <div></div>
                                ):(
                                    <div id='style-2' className='display-chats'>
                                        Your Chats:
                                        {mappedChats}
                                    </div>
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
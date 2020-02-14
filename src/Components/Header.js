import React, {useState} from 'react'
import '../App.css'
import {Link} from 'react-router-dom'
import {register, login, logout, email} from '../ducks/userReducer'
import {connect} from 'react-redux'
import './Dashboard.css'

const Header = props => {
    //using hooks to hold state to conserve on storage space they pass there data to redux to login and register
    const [inputs, handleInputs] = useState({email: '', password: ''})
    // console.log(inputs.email, inputs.password)
    // console.log(props.user)
    return(
        <div className='head'>
            <div className='tabs'>
                <h1>I-Game</h1> 
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/add'>Add new game</Link>
                <Link to='/profile'>Profile</Link>
            </div>
            {/* this is conditional rendering wither you are logged in, if you are it give you the option to log in, if you are not logged in it has the log in information */}
            {!props.user.user.loggedIn ? (
            <div className='login'>
                <input className='search' placeholder='Email' onChange={(e) => handleInputs({...inputs, email: e.target.value})}/>
                <input className='search' placeholder='Password' type='password' onChange={(e) => handleInputs({...inputs, password: e.target.value})}/>
                <button className='search-button' onClick={()=>props.login(inputs.email, inputs.password)}>Login</button>
                <button className='search-button2' onClick={()=>props.register(inputs.email, inputs.password).then(()=> {props.email(inputs.email)})} >Register</button>
            </div>
            ):(
            <div className='login'>
                <h1>Hello {props.user.user.user.email}</h1>
                <button onClick={()=>props.logout()}>Logout</button>
            </div>
            )}
        </div>
    )
}
function mapStateToProps(state){
    return{user: state}
}
export default connect(mapStateToProps, {register, login, logout, email})(Header)
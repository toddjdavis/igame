import React, {useState} from 'react'
import '../App.css'
import {Link, withRouter} from 'react-router-dom'
import {register, login, logout, email} from '../ducks/userReducer'
import {connect} from 'react-redux'
import Swal from 'sweetalert2'
import './Dashboard.css'

const Header = props => {
    //using hooks to hold state to conserve on storage space they pass there data to redux to login and register
    const [inputs, handleInputs] = useState({email: '', password: ''})
    // console.log(inputs.email, inputs.password)
    // console.log(props.user)
    const errorToUser = (errorMessage) => { 
        Swal.fire({
        title: 'error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Ok!'
    })}
    return(
        <div className='head'>
            <div className='tabs'>
                <h1>I-Game</h1> 
                {!props.user.user.loggedIn ? (
                    <div></div>
                ):(
                    <div className='the-links'>
                        <Link to='/dashboard'>Dashboard</Link>
                        <Link to='/add'>Add new game</Link>
                        <Link to='/profile'>Profile</Link>
                    </div>
                )}
            </div>
            {/* this is conditional rendering wither you are logged in, if you are it give you the option to log in, if you are not logged in it has the log in information */}
            {!props.user.user.loggedIn ? (
            <div className='login'>
                <input className='search' placeholder='Email' onChange={(e) => handleInputs({...inputs, email: e.target.value})}/>
                <input className='search' placeholder='Password' type='password' onChange={(e) => handleInputs({...inputs, password: e.target.value})}/>
                <div className='user-buttons'>
                    <button className='search-button' onClick={()=>props.login(inputs.email, inputs.password).then(()=> handleInputs({...inputs, password: '', email: ''})).catch(err=>{errorToUser('Incorrect username or password')})}>Login</button>
                    <button className='search-button2' onClick={()=>props.register(inputs.email, inputs.password).then(()=> {props.email(inputs.email)}).then(()=> handleInputs({...inputs, password: '', email: ''})).catch(err=>errorToUser('Email is already taken'))} >Register</button>
                </div>
            </div>
            ):(
            <div className='login'>
                <h1 className='small-hidden'>Hello {props.user.user.user.email}</h1>
                <button className='search-button' onClick={()=>props.logout().then(()=> {
                    props.history.push('/dashboard')})}>Logout</button>
            </div>
            )}
        </div>
    )
}
function mapStateToProps(state){
    return{user: state}
}
export default withRouter(connect(mapStateToProps, {register, login, logout, email})(Header))
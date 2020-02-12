import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {register, login, logout} from '../ducks/userReducer'
import {connect} from 'react-redux'

const Header = props => {
    //using hooks to hold state to conserve on storage space they pass there data to redux to login and register
    const [inputs, handleInputs] = useState({email: '', password: ''})
    // console.log(inputs.email, inputs.password)
    // console.log(props.user)
    return(
        <div>
            
            <Link to='/dashboard'>Dashboard</Link>
            <Link to='/add'>Add new game</Link>
            <Link to='/profile'>Profile</Link>
            {/* this is conditional rendering wither you are logged in, if you are it give you the option to log in, if you are not logged in it has the log in information */}
            {!props.user.user.loggedIn ? (
            <div>
            <input placeholder='Email' onChange={(e) => handleInputs({...inputs, email: e.target.value})}/>
            <input placeholder='Password' type='password' onChange={(e) => handleInputs({...inputs, password: e.target.value})}/>
            <button onClick={()=>props.login(inputs.email, inputs.password)}>Login</button>
            <button onClick={()=>props.register(inputs.email, inputs.password)} >Register</button>
            </div>
            ):(
                <div>
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
export default connect(mapStateToProps, {register, login, logout})(Header)
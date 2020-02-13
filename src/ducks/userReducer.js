import axios from 'axios'

const initialState = {
    loggedIn: false,
    user: {}
}

const REGISTER ='REGISTER'
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const EMAIL = 'EMAIL'


//using redux here so i can keep header a functional component
export const register = (email, password) => {
    let data = axios.post('/auth/register', {email, password}).then(res=>res.data)
    return{
        type: REGISTER,
        payload: data
    }
}
export const login = (email, password) => {
    let data = axios.post('/auth/login', {email, password}).then(res=>res.data)
    return{
        type:LOGIN,
        payload: data
    }
}
export const logout = () => {
    let data = axios.get('/auth/logout').then(res=>res.data)
    return{
        type:LOGOUT,
        payload: data
    }
}
export const email = (email) => {
    let data = axios.post('/auth/email', {email}).then(res => res.data)
    return {
        type: EMAIL,
        payload: data
    }
}


export default function reducer(state = initialState, action){
    switch(action.type){
        case REGISTER + '_FULFILLED':
            return{...state, user: action.payload, loggedIn: true}
        case LOGIN + '_FULFILLED':
            return{...state, user: action.payload, loggedIn: true}
        case LOGOUT + '_FULFILLED':
            return{...state, user: action.payload, loggedIn: false}
        case EMAIL + '_FULFILLED':
            return{...state, loggedIn: true}
        default:
            return state
    }
}
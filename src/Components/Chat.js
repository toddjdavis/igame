import React, {useEffect, useState} from 'react'
import io from 'socket.io-client'
import {withRouter} from 'react-router-dom'
import './Chat.css'
import { connect } from 'react-redux'

function Chat(props){
    const [input, handleChange] = useState('')
    const [messages, updateMessages] = useState([])
    const [chatroom_id, updateChatroomId] = useState(0)
    const socket = io.connect('http://localhost:4200')
    // console.log(props.match)
    useEffect(()=> {
        if (props.match.params.id){
            socket.emit('join', {
                user_id2: props.match.params.id,
                user_id: props.match.params.sessionUser
            })
        }
        socket.on('login complete', body => {
            // console.log(body)
            updateMessages([...body.chatroomMessages]);
            if(body.newChatroomId){
                updateChatroomId(body.newChatroomId.chatroom_id)
            } else {
                updateChatroomId(body.chatroom_id)
            }
        })
    }, []);
    useEffect(()=> {
        socket.on('incoming', body => {
            // console.log(body)
            updateMessages(pMessages => [...pMessages, body[0]])
        })
    }, [])
    function messageToServer(){
        // console.log(chatroom_id)
        const {sessionUser} = props.match.params

        socket.emit('message to server', {
            user_id: sessionUser,
            message: input,
            chatroom_id,
            email: props.user.user.user.email
        })
        handleChange('')
    }
    // console.log(messages)
    // console.log(props.user.user.user)
    return (
        <div className='chat'>
            <div className='messages' id='style-2'>
                {messages.map(msg => (
                    <div
                    className={msg.user_id === props.match.params.sessionUser
                    ? 'sender'
                    : 'receiver'}>
                        <h4>{msg.email}</h4>
                       <span>{msg.message}</span> 
                    </div>
                ))}
            </div>
            <div className='message-area'>
                <textarea className='message-input' value={input} onChange={(e)=> handleChange(e.target.value)} label='message'/>
                <button className='message-button' onClick={()=>messageToServer()}>Send</button>
            </div>
        </div>
    )
}
function mapStateToProps(state){
    return{user: state}
}
export default  withRouter(connect(mapStateToProps)(Chat))
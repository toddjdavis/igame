import React, {Component} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import stripe from './StripeKey'
import StripeCheckout from 'react-stripe-checkout'
import Swal from 'sweetalert2'
import './checkout.css'

class Checkout extends Component{
    constructor(){
        super()
        this.state={
            price: 0,
            game_id: 0,
            user_id: 0,
            shipping: '',
            title: '',
            game_picture: '',
            
        }
    }
    componentDidMount(){
        const {id} = this.props.match.params
            axios.get(`/api/buygame/${id}`).then(res=> {
            this.setState({
                price: res.data[0].price,
                shipping: res.data[0].shipping,
                title: res.data[0].title,
                game_picture: res.data[0].game_picture,
                game_id: id,
                user_id: this.props.user.user.user.user_id
            })
        })
        
    }
    backToDash=()=>{
        this.props.history.push('/dashboard')
    }
    buyGame=()=>{
        const {game_id, user_id} = this.state
        axios.post('/api/buygame/buy', {user_id, game_id}).then(()=> this.backToDash())
    }
    onToken = (token) => {
        token.card = void 0
        let cost = this.state.price * 100
        console.log(cost)
        axios.post('/api/payment', {token, amount: cost, user_id: this.state.user_id, game_id: this.state.game_id}).then(res => {
            this.errorToUser()
            this.backToDash()
        })
    }
    errorToUser = () => { 
        Swal.fire({
        title: 'order send to seller',
        icon: 'success',
        confirmButtonText: 'Ok!'
    })}
    render(){
        console.log(this.state)
        const {game_picture, title, shipping, price} =this.state
        return(
            <div className='checkout-holder'>
                <img className='checkout-image' src={game_picture} />
                <div className='checkout-info'>
                    <h1>{title}</h1>
                    <h4>Shipping: {shipping}</h4>
                    <h2>${price} +tax</h2>
                </div>
                <div className='checkout-actions'>
                    <button className='checkout-button' onClick={this.backToDash}>Back</button>
                    {/* <button onClick={this.buyGame}>Buy {title}</button> */}
                    <StripeCheckout token={this.onToken} stripeKey={stripe.publicKey}amount={this.state.price *100}/>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return{user:state}
}
export default connect(mapStateToProps)(Checkout)
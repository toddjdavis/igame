import React, {Component} from 'react'
import axios from 'axios'

class CheckoutEdit extends Component{
    constructor(){
        super()
        this.state={
            price: 0,
            purchase_id: 0,
            shipping: '',
            title: '',
            game_picture: '',
            available: false
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
                purchase_id: res.data[0].purchase_id,
                available: res.data[0].available
            })
        })    
    }
    handleShipping = (value) => {
        this.setState({shipping: value})
    }
    handleCost = (value) => {
        this.setState({price: value})
    }
    backToDash =() => {
        this.props.history.push('/dashboard')
    }
    postGame = () =>{
        const {game_id, price, shipping} = this.state
        axios.post('/api/buygame/post', {game_id, price, shipping}).then(()=> this.backToDash())
    }
    editGame = () =>{
        console.log('hit')
        const {purchase_id, price, shipping} = this.state
        console.log(purchase_id)
        axios.put(`/api/bg/u/${purchase_id}`, {price, shipping}).then(()=>this.backToDash()).catch(err=>console.log(err))

    }
    makeAvailable = () => {
        const {id} = this.props.match.params
        axios.post('/api/available', {id})
    }
    render(){
        console.log(this.state)
        const {title, game_picture, available, price, shipping} = this.state
        return(
            <div>
                <input value={price} onChange={(e)=> this.handleCost(e.target.value)} type='number' placeholder='price' />
                <input value={shipping} onChange={(e)=> this.handleShipping(e.target.value)} placeholder='shipping' />
                <span>{title}</span>
                <img src={game_picture}/>
                {available ? (
                    <div>
                        <button onClick={this.editGame}>update Game</button>
                        <button onClick={this.backToDash}>Cancel</button>
                    </div>
                ):(
                    <div>
                        <button onClick={this.postGame}>Post Game</button>
                        <button onClick={this.makeAvailable}>Make Available</button>
                        <button onClick={this.backToDash}>Cancel</button>
                    </div>
                )}
            </div>
        )
    }
}

export default CheckoutEdit
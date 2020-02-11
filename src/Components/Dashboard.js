import React, {Component} from 'react'
import axios from 'axios'

class Dashboard extends Component {
    constructor(){
        super()
        this.state ={
            games: []
        }
    }
    componentDidMount(){
        axios.get('/api/games').then(res => {
            this.setState({games: res.date})
        }).catch(err=>console.log(err))
    }
    render(){
        let mappedGames = this.state.games.map((el)=> {
            return(
                <div>
                    <img src={el.game_picture}/>
                    <h2>{el.title}</h2>
                </div>
            )
        })
        return(
            <div>
                Dashboard
                {mappedGames}
            </div>
        )
    }
}

export default Dashboard